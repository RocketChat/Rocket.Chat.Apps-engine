import * as jsonrpc from 'jsonrpc-lite';

import { AppObjectRegistry } from "../AppObjectRegistry.ts";
import type { Logger } from './logger.ts'

export type RequestDescriptor = Pick<jsonrpc.RequestObject, 'method' | 'params'>;

export type NotificationDescriptor = Pick<jsonrpc.NotificationObject, 'method' | 'params'>;

export type SuccessResponseDescriptor = Pick<jsonrpc.SuccessObject, 'id' | 'result'>;

export type ErrorResponseDescriptor = Pick<jsonrpc.ErrorObject, 'id' | 'error'>;

export type JsonRpcRequest = jsonrpc.IParsedObjectRequest | jsonrpc.IParsedObjectNotification;
export type JsonRpcResponse = jsonrpc.IParsedObjectSuccess | jsonrpc.IParsedObjectError;

export function isRequest(message: jsonrpc.IParsedObject): message is JsonRpcRequest {
    return message.type === 'request' || message.type === 'notification';
}

export function isResponse(message: jsonrpc.IParsedObject): message is JsonRpcResponse {
    return message.type === 'success' || message.type === 'error';
}

export function isErrorResponse(message: jsonrpc.JsonRpc): message is jsonrpc.ErrorObject {
    return message instanceof jsonrpc.ErrorObject;
}

const encoder = new TextEncoder();
export const RPCResponseObserver = new EventTarget();

export const Transport = new class Transporter {
    private selectedTransport: Transporter["stdoutTransport"] | Transporter["noopTransport"];

    constructor() {
        this.selectedTransport = this.stdoutTransport.bind(this);
    }

    private async stdoutTransport(message: jsonrpc.JsonRpc): Promise<void> {
        const encoded = encoder.encode(message.serialize() + AppObjectRegistry.get<string>('MESSAGE_SEPARATOR'));
        await Deno.stdout.write(encoded);
    }

    private async noopTransport(_message: jsonrpc.JsonRpc): Promise<void> { }

    public selectTransport(transport: 'stdout' | 'noop'): void {
        switch (transport) {
            case 'stdout':
                this.selectedTransport = this.stdoutTransport.bind(this);
                break;
            case 'noop':
                this.selectedTransport = this.noopTransport.bind(this);
                break;
        }
    }

    public send(message: jsonrpc.JsonRpc): Promise<void> {
        return this.selectedTransport(message);
    }
}

export function parseMessage(message: string) {
    const parsed = jsonrpc.parse(message);

    if (Array.isArray(parsed)) {
        throw jsonrpc.error(null, jsonrpc.JsonRpcError.invalidRequest(null));
    }

    if (parsed.type === 'invalid') {
        throw jsonrpc.error(null, parsed.payload);
    }

    return parsed;
}

export async function sendInvalidRequestError(): Promise<void> {
    const rpc = jsonrpc.error(null, jsonrpc.JsonRpcError.invalidRequest(null));

    await Transport.send(rpc);
}

export async function sendInvalidParamsError(id: jsonrpc.ID): Promise<void> {
    const rpc = jsonrpc.error(id, jsonrpc.JsonRpcError.invalidParams(null));

    await Transport.send(rpc);
}

export async function sendParseError(): Promise<void> {
    const rpc = jsonrpc.error(null, jsonrpc.JsonRpcError.parseError(null));

    await Transport.send(rpc);
}

export async function sendMethodNotFound(id: jsonrpc.ID): Promise<void> {
    const rpc = jsonrpc.error(id, jsonrpc.JsonRpcError.methodNotFound(null));

    await Transport.send(rpc);
}

export async function errorResponse({ error: { message, code = -32000, data = {} }, id }: ErrorResponseDescriptor): Promise<void> {
    const logger = AppObjectRegistry.get<Logger>('logger');

    if (logger?.hasEntries()) {
        data.logs = logger.getLogs();
    }

    const rpc = jsonrpc.error(id, new jsonrpc.JsonRpcError(message, code, data));

    await Transport.send(rpc);
}

export async function successResponse({ id, result }: SuccessResponseDescriptor): Promise<void> {
    const payload = { value: result } as Record<string, unknown>;
    const logger = AppObjectRegistry.get<Logger>('logger');

    if (logger?.hasEntries()) {
        payload.logs = logger.getLogs();
    }

    const rpc = jsonrpc.success(id, payload);

    await Transport.send(rpc);
}

export async function sendRequest(requestDescriptor: RequestDescriptor): Promise<jsonrpc.SuccessObject> {
    const request = jsonrpc.request(Math.random().toString(36).slice(2), requestDescriptor.method, requestDescriptor.params);

    await Transport.send(request);

    // TODO: add timeout to this
    return new Promise((resolve, reject) => {
        const handler = (event: Event) => {
            if (event instanceof ErrorEvent) {
                reject(event.error);
            }

            if (event instanceof CustomEvent) {
                resolve(event.detail);
            }

            RPCResponseObserver.removeEventListener(`response:${request.id}`, handler);
        };

        RPCResponseObserver.addEventListener(`response:${request.id}`, handler);
    });
}

export function sendNotification({ method, params }: NotificationDescriptor) {
    const request = jsonrpc.notification(method, params);

    Transport.send(request);
}
