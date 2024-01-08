import { IApiEndpoint } from "@rocket.chat/apps-engine/definition/api/IApiEndpoint.ts";
import { AppObjectRegistry } from "../AppObjectRegistry.ts";
import { Logger } from "../lib/logger.ts";
import { Defined, JsonRpcError } from "jsonrpc-lite";
import { AppAccessorsInstance } from "../lib/accessors/mod.ts";

export default async function apiHandler(call: string, params: unknown): Promise<JsonRpcError | Defined> {
    const [, path, httpMethod] = call.split(':');

    const endpoint = AppObjectRegistry.get<IApiEndpoint>(`api:${path}`);
    const logger = AppObjectRegistry.get<Logger>('logger');

    if (!endpoint) {
        return new JsonRpcError(`Endpoint ${path} not found`, -32000);
    }

    const method = endpoint[httpMethod as keyof IApiEndpoint];

    if (typeof method !== 'function') {
        return new JsonRpcError(`${path}'s ${httpMethod} not exists`, -32000);
    }

    const [ request, endpointInfo ] = params as Array<unknown>;

    logger?.debug(`${path}'s ${method} is being executed...`, request);

    try {
        // deno-lint-ignore ban-types
        const result = await(method as Function).apply(endpoint, [
            request,
            endpointInfo,
            AppAccessorsInstance.getReader(), 
            AppAccessorsInstance.getModifier(),
            AppAccessorsInstance.getHttp(),
            AppAccessorsInstance.getPersistence()
        ]);
    
        logger?.debug(`${path}'s ${method} was successfully executed.`);
        
        return result;
    } catch (e) {
        logger?.debug(`${path}'s ${method} was unsuccessful.`);
        return new JsonRpcError(e.message, -32000);
    }
}