import { IMessage } from '../messages/index';
import { IRoom } from '../rooms/IRoom';
import { IUser } from '../users/IUser';

/**
 * Accessor methods are used to fetch private data stored within an object. 
 * This accessor provides methods for accessing messages 
 * in a read-only fashion. 
 * These methods do not allow you to modify messages. 
 * The methods below will recall a message, the room where 
 * a message was sent or the user that send a message 
 * if you provide the message's ID. 
 * We recommend using this interface to follow cybersecurity guidelines
 * (by storing only the message IDs, the accessor guarantees 
 * some level of anonymity of its contents) and for a 
 * better storage management (less stored data on the server).  
 * 
 * __What can go wrong?__
 * If you are experiencing problems using these methods, 
 * it's wise to double check if the message ID you're 
 * using to gather the data really exists. 
 * If the message ID exists but you're still experiencing 
 * problems, the error is probably related to infrastructure 
 * issues, such as connecting to databases or other 
 * network related issues.  
 */

export interface IMessageRead {
/**
* Based on the ID provided, this method returns 
*the content of a message. 
*/
    getById(id: string): Promise<IMessage | undefined>;

/**
* Based on the ID provided, this method returns 
* the user that sent the message.  
*/
    getSenderUser(messageId: string): Promise<IUser | undefined>;
/**
* Based on the ID provided, this method returns 
* the room where the message was sent.
*/   
    getRoom(messageId: string): Promise<IRoom | undefined>;
}
