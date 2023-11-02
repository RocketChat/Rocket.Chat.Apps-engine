export type JSONRPC_Message = {
    jsonrpc: '2.0-rc';
};

export type RequestDescriptor = {
    method: string;
    params: unknown[];
};

export type Request = JSONRPC_Message &
    RequestDescriptor & {
        id: string;
    };

export type SuccessResponseDescriptor = {
    id: string;
    result: unknown;
};

export type SuccessResponse = JSONRPC_Message & SuccessResponseDescriptor;

export type ErrorResponseDescriptor = {
    error: {
        code: number;
        message: string;
        data?: Record<string, unknown>;
    };
    id: string | null;
};

export type ErrorResponse = JSONRPC_Message & ErrorResponseDescriptor;

export type Response = SuccessResponse | ErrorResponse;

export type NotificationDescriptor = RequestDescriptor;

export function isJSONRPCMessage(message: object): message is JSONRPC_Message {
    return 'jsonrpc' in message && message['jsonrpc'] === '2.0-rc';
}

export function isRequest(message: object): message is Request {
    return isJSONRPCMessage(message) && 'method' in message && 'params' in message && 'id' in message;
}

export function isResponse(message: object): message is Response {
    return isJSONRPCMessage(message) && ('result' in message || 'error' in message);
}

export function isErrorResponse(response: Response): response is ErrorResponse {
    return 'error' in response;
}

export function isSuccessResponse(response: Response): response is SuccessResponse {
    return 'result' in response;
}

const encoder = new TextEncoder();
export const RPCResponseObserver = new EventTarget();

export async function serverParseError(): Promise<void> {
    const rpc: ErrorResponse = {
        jsonrpc: '2.0-rc',
        id: null,
        error: { message: 'Parse error', code: -32700 },
    };

    const encoded = encoder.encode(JSON.stringify(rpc));
    await Deno.stdout.write(encoded);
}

export async function serverMethodNotFound(id: string): Promise<void> {
    const rpc: ErrorResponse = {
        jsonrpc: '2.0-rc',
        id,
        error: { message: 'Method not found', code: -32601 },
    };

    const encoded = encoder.encode(JSON.stringify(rpc));
    await Deno.stdout.write(encoded);
}

export async function errorResponse({ error: { message, code = -32000, data }, id }: ErrorResponseDescriptor): Promise<void> {
    const rpc: ErrorResponse = {
        jsonrpc: '2.0-rc',
        id,
        error: { message, code, ...(data && { data }) },
    };

    const encoded = encoder.encode(JSON.stringify(rpc));
    Deno.stdout.write(encoded);
}

export async function successResponse({ id, result }: SuccessResponseDescriptor): Promise<void> {
    const rpc: SuccessResponse = {
        jsonrpc: '2.0-rc',
        id,
        result,
    };

    const encoded = encoder.encode(JSON.stringify(rpc));
    await Deno.stdout.write(encoded);
}

export async function sendRequest(requestDescriptor: RequestDescriptor): Promise<SuccessResponse> {
    const request: Request = {
        jsonrpc: '2.0-rc',
        id: Math.random().toString(36).slice(2),
        ...requestDescriptor,
    };

    const encoded = encoder.encode(JSON.stringify(request));
    await Deno.stdout.write(encoded);

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

export function sendNotification(notification: NotificationDescriptor) {
    const request = {
        jsonrpc: '2.0-rc',
        ...notification,
    }

    const encoded = encoder.encode(JSON.stringify(request));
    Deno.stdout.write(encoded);
}
