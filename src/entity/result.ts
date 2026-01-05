export default class Result<T> {
    code: number = 404;
    data?: T;
    message?: string;

    constructor(data?: Partial<Result<T>>) {
        if (data) {
            Object.assign(this, data);
        }
    }

    static fromJSON<T>(json: any, itemConstructor?: (item: any) => T): Result<T> {
        const result = new Result<T>(json);
        if (itemConstructor && json.data) {
            result.data = itemConstructor(json.data);
        }
        return result;
    }
};