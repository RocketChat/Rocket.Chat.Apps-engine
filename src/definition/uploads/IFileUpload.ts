import { IUploadDetails } from './IUploadDetails';

export interface IFileUpload {
    file: IUploadDetails;
    stream: Buffer;
}
