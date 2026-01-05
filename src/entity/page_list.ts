export default class PageList<T> {
    list: Array<T> = [];
    page_size: number = 0;
    page_no: number = 0;
    page_count: number = 0;
    total: number = 0;

    constructor(data?: Partial<PageList<T>>) {
        if (data) {
            Object.assign(this, data);
        }
    }

    static fromJSON<T>(json: any, itemConstructor?: (item: any) => T): PageList<T> {
        const page = new PageList<T>(json);
        if (itemConstructor && json.list) {
            page.list = json.list.map(itemConstructor);
        }
        return page;
    }
};

export interface PaginationParams {
    page_no: number;
    page_size: number;
}

