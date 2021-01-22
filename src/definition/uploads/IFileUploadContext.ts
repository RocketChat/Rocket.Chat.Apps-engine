import { IUploadDetails } from './IUploadDetails';

export interface IFileUploadContext {
    file: IUploadDetails;
    stream: Stream;
}
