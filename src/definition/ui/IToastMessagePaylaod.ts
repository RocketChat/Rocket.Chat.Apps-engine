export interface IToastMessagePayload {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
}
