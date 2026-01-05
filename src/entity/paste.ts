export default class Paste {
    id?: number;
    name?: string;
    content?: string;
    content_type?: string;
    attachements?: string;
    private?: boolean;
    read_only?: boolean;
    has_password?: boolean;
    password?: string;
    read_count?: number;
    burn_after_reads?: number;
    latest_read_at?: number;
    create_at?: number;
    expiration_at?: number;
    profiles?: string;

    constructor(data?: Partial<Paste>) {
        if (data) {
            Object.assign(this, data);
        }
    }
};