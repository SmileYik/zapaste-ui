export default class Result<T> {
    code: number = 404;
    data?: T;
    message?: string;
};