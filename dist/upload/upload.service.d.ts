export declare class UploadService {
    constructor();
    uploadImage(file: {
        buffer: Buffer;
        [key: string]: any;
    }): Promise<string>;
}
