export default class File {
    id?: number;
    hash?: string;
    filename?: string;
    filesize?: number;
    filepath?: string;
    mimetype?: string;

    constructor(data?: Partial<File>) {
        if (data) {
            Object.assign(this, data);
        }
    }
};