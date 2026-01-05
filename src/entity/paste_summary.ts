import type { PaginationParams } from "./page_list";

export default class PasteSummary {
    id?: number;
    name?: string;
    content_type?: string;
    read_only?: boolean;
    has_password?: boolean;
    read_count?: number;
    latest_read_at?: number;
    create_at?: number;
    expiration_at?: number;

    constructor(data?: Partial<PasteSummary>) {
        if (data) {
            Object.assign(this, data);
        }
    }
};