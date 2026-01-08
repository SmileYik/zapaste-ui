import { MdElevatedButton, MdElevation, MdIcon, MdList, MdListItem } from "../Material";
import type PaginationListHandler from "./PaginationListHandler";
import type PageList from "../../entity/page_list";
import type { PaginationParams } from "../../entity/page_list";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import useResizeObserver from "../../utils/useResizeObserver";
import PasteSummary from "../../entity/paste_summary";
import MaskPanel from "../MaskPanel";
import { chevron_backward, chevron_forward } from "../Icons";
import styles from "./PaginationList.module.css"

export default function PaginationList<T>({
    requestFn,
    handler,
    minWidth = 265,
    maxSizePerLine = 5,
    lineCount = 3,
    onClick,
    disablePagination = false,
    disableEmptyFill = false,
    bodyClassName,
    bypassData,
}: PaginationListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const {width} = useResizeObserver(containerRef);
    const [pageNo, setPageNo] = useState(1);
    const realWidth = useMemo(() => {
        const maxWidth = Math.floor(width / maxSizePerLine)
        return Math.max(minWidth, maxWidth)
    }, [width, minWidth, maxSizePerLine])
    
    const pageSize = useMemo(() => {
        return Math.max(1, Math.floor(width / realWidth)) * lineCount;
    }, [width, lineCount, realWidth]);

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

    const realData = useMemo(() => {
        return bypassData || data;
    }, [data, bypassData]);

    const realPageNo = useMemo(() => {
        return realData?.page_no || pageNo
    }, [realData, pageNo]);

    const emptyItems = useMemo(() => {
        if (disableEmptyFill) return [];
        return Array.from({ length: pageSize - (realData?.list || []).length }, (_, i) => {return {
            id: i
        } as PasteSummary}) as Array<PasteSummary>;
    }, [realData, pageSize, disableEmptyFill]);

    const previousPage = useCallback(() => {
        setPageNo(Math.max(1, realPageNo - 1));
    }, [realPageNo])

    const nextPage = useCallback(() => {
        setPageNo(Math.min(realData?.page_count || 1, realPageNo + 1));
    }, [realPageNo, realData])

    const renderColumn = useCallback((item: T, index: number, isEmpty: boolean) => {
        const isHidden = !isPending && isEmpty
        return (
            <MdListItem 
                key={isEmpty ? `empty-skeleton-${index}` : handler.elementKey(item, index)} 
                style={{
                    flex: "0 0 calc(20% - 12px)",
                    justifyContent: "center",
                    textAlign: "center",
                    minWidth: realWidth,
                    maxWidth: realWidth,
                    opacity: isHidden ? 0 : 1,
                    pointerEvents: isHidden ? "none" : "auto",
                    transition: "all 200ms ease-in-out"
                }}
                onClick={() => onClick && onClick(item)}
            >
                <div>
                    {(isPending ? handler.skeletonRender : handler.elementRender)(item, index)}
                </div>
            </MdListItem>
        );
    }, [handler, realWidth, isPending])
    
    return (
        <div>
            <div ref={containerRef} style={{
                position: "relative",
                width: "100%",
                padding: "10px 0"
            }}>
                {isPending && <MaskPanel><div style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#ffffff65"
                }}></div></MaskPanel>}
                {error && <p>{error.message}</p>}
                <MdList 
                    className={`${bodyClassName} ${styles["default-body"]}`} 
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        width: "100%"
                    }}
                >
                    {(data?.list || []).map((item, index) => renderColumn(item, index, false))}
                    {emptyItems.map((item, index) => renderColumn(item as T, index, true))}
                </MdList>
            </div>
            <div style={{
                display: disablePagination ? "none" : "flex",
                justifyContent: "center",
                gap: 24,
                margin: 12,
                textAlign: "center",
                lineHeight: "44px",
                userSelect: "none"
            }}>
                <MdElevatedButton onClick={previousPage} className={styles["page-button"]}>
                    <div style={{display: "flex", position: "relative"}}>
                        <MdIcon slot="icon" style={{display: "flex", position: "relative", top: -1}}>{chevron_backward}</MdIcon>
                        <span>Prev</span>
                    </div>
                </MdElevatedButton>
                <span>
                    <span className={styles["page-number"]}>
                        <MdElevation/>
                        <span>{realPageNo}</span>
                    </span>
                    /
                    <span className={styles["page-number"]}>
                        <MdElevation/>
                        <span>{realData?.page_count || realPageNo}</span>
                    </span>
                </span>
                <MdElevatedButton onClick={nextPage} className={styles["page-button"]}>
                    <div style={{display: "flex", position: "relative"}}>
                        <span style={{position: "relative", top: 1}}>Next</span>
                        <MdIcon slot="icon" style={{display: "flex"}}>{chevron_forward}</MdIcon>
                    </div>
                </MdElevatedButton>
            </div>
        </div>
    )
}
interface PaginationListProps<T> {
    requestFn: (pageParams: PaginationParams) => Promise<PageList<T>>,
    handler: PaginationListHandler<T>,
    minWidth?: number,
    lineCount?: number,
    maxSizePerLine?: number,
    onClick?: (item: T) => void,
    disablePagination?: boolean,
    disableEmptyFill?: boolean,
    bodyClassName?: string,
    bypassData?: PageList<T>
}