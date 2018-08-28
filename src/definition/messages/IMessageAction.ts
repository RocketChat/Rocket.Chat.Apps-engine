/**
 * Interface which represents an action which can be added to a message.
 */
export interface IMessageAction {
    type?: string,
    text?: string,
    url?: string,
    image_url?: string,
    is_webview?: boolean,
    webview_height_ratio?: string,
    msg?: string,
    msg_in_chat_window?: boolean,
}
