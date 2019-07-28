/**
 * This interface provides webhooks to the game. You can set
 * the target URL for each webhook event according to your demand.
 */
export interface IWebHooks {
    // When a game is closed, Rocket.Chat will post all
    // relevant information to that URL.
    sessionEnds?: string;
}
