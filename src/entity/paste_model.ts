import Paste from "./paste";
import File from "./file";

export default class PasteModel {
    paste: Paste | null = null;
    files: File[] = [];

    constructor(data?: Partial<PasteModel>) {
        if (data) {
            Object.assign(this, data);
            if (data.paste) {
                this.paste = new Paste(data.paste);
            }
            if (data.files) {
                this.files = data.files.map(file => new File(file));
            }
        }
    }
};