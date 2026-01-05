import { Fragment } from "react/jsx-runtime";

export default class PaginationListHandler <T> {
    elementRender: (item: T, index: number) => React.ReactNode = (item, index) => (<Fragment>{JSON.stringify(item)}</Fragment>);
    elementKey: (item: T, index: number) => string = (item, index) => index.toString();
}