import { Fragment } from "react/jsx-runtime";
import { MdList, MdListItem } from "../material";
import type PaginationListHandler from "./pagination-list-handler";
import type PageList from "../../entity/page_list";
import type { PaginationParams } from "../../entity/page_list";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export default function PaginationList<T>({
    requestFn,
    handler,
    lineSize = 5,
    lineCount = 2,
}: PaginationListProps<T>) {

    const [pageNo, setPageNo] = useState(0);
    const pageSize = useMemo(() => {
        return lineSize * lineCount;
    }, [lineSize, lineCount]);

    const pageParams = useMemo(() => {
        return {
            page_no: pageNo,
            page_size: pageSize
        } as PaginationParams;
    }, [pageNo, pageSize]);

    const { isPending, error, data } = useQuery({
        queryKey: ["data", pageParams],
        queryFn: () => requestFn(pageParams),
    });

    const realPageNo = useMemo(() => {
        return data?.page_no || pageNo
    }, [data, pageNo]);

    const rows = useMemo(() => {
        const list = data?.list || [];
        const result: T[][] = [];
        for (let i = 0; i < list.length; i += lineSize) {
            result.push(list.slice(i, i + lineSize));
        }
        return result;
    }, [data?.list, lineSize]);
    
    return (
        <div>
            <div>
                {isPending && <p>Loading...</p>}
                {error && <p>{error.message}</p>}
                {(!isPending && (error || true)) && (
                    <MdList>
                        <MdListItem>
                            {rows.map((row, index) => (
                                <PaginationListLine data={row} key={`${index}`} handler={handler}></PaginationListLine> 
                            ))}
                        </MdListItem>
                    </MdList>
                )}
            </div>
            <div>
                <button onClick={() => setPageNo(p => Math.max(1, realPageNo - 1))}>Prev</button>
                <span>Page {realPageNo}</span>
                <button onClick={() => setPageNo(p => realPageNo + 1)}>Next</button>
            </div>
        </div>
    )
}

function PaginationListLine<T>({
    data,
    handler
}: PaginationListLineProps<T>) {
    return (
        <div>
            <MdList style={{
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        justifyContent: "center",
                        alignItems: "stretch"
                    }}>
                {data.map((item, index) => (
                    <MdListItem style={{
                        flex: 1,
                        // maxWidth: `${100 / data.length}%`,
                        justifyContent: "center",
                        textAlign: "center"
                    }}>
                        <Fragment key={handler.elementKey(item, index)}>
                            {handler.elementRender(item, index)}
                        </Fragment>
                    </MdListItem>
                ))}
            </MdList>
        </div>
    )
}

interface PaginationListLineProps<T> {
    data: T[];
    handler: PaginationListHandler<T>
}

interface PaginationListProps<T> {
    requestFn: (pageParams: PaginationParams) => Promise<PageList<T>>,
    handler: PaginationListHandler<T>,
    lineSize?: number,
    lineCount?: number
}