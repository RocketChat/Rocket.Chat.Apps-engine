export type JSONRPC_Message = {
    jsonrpc: '2.0-rc';
};

export type SuccessResponse = JSONRPC_Message & {
    id: string;
    result: any;
};

export type ErrorResponse = JSONRPC_Message & {
    error: {
        code: number;
        message: string;
        data?: Record<string, unknown>;
    };
    id: string | null;
};

export type JSONRPC_Response = SuccessResponse | ErrorResponse;

const encoder = new TextEncoder();

export async function errorResponse({ error: { message, code = -32000, data }, id }: Omit<ErrorResponse, 'jsonrpc'>): Promise<void> {
    const rpc: ErrorResponse = {
        jsonrpc: '2.0-rc',
        id,
        error: { message, code, ...(data && { data }) },
    };

    const encoded = encoder.encode(JSON.stringify(rpc));
    Deno.stdout.write(encoded);
}

export async function successResponse(id: string, ...result: unknown[]): Promise<void> {
    const rpc: SuccessResponse = {
        jsonrpc: '2.0-rc',
        id,
        result,
    };
    const encoded = encoder.encode(JSON.stringify(rpc));
    await Deno.stdout.write(encoded);
}
