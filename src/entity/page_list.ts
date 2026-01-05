export default class PageList<T> {
    list: Array<T> = [];
    page_size: number = 0;
    page_no: number = 0;
    page_count: number = 0;
    total: number = 0;
};