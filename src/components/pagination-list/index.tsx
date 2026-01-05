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
    lineCount = 3,
}: PaginationListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const {width} = useResizeObserver(containerRef);
    const [pageNo, setPageNo] = useState(1);
    
    const pageSize = useMemo(() => {
        return Math.max(1, Math.floor(width / minWidth)) * lineCount;
    }, [width, lineCount]);

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

    const emptyItems = useMemo(() => {
        return Array.from({ length: pageSize - (data?.list || []).length }, (_, i) => {return {
            id: i
        } as PasteSummary}) as Array<PasteSummary>;
    }, [data]);

    const previousPage = useCallback(() => {
        setPageNo(Math.max(1, realPageNo - 1));
    }, [realPageNo])

    const nextPage = useCallback(() => {
        setPageNo(Math.min(data?.page_count || 1, realPageNo + 1));
    }, [realPageNo, data])

    
    return (
        <div>
            <div ref={containerRef} style={{
                position: "relative"
            }}>
                {isPending && <MaskPanel><div style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#ffffff65"
                }}></div></MaskPanel>}
                {error && <p>{error.message}</p>}
                <MdList style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    width: "100%"
                }}>
                    {(data?.list || []).map((item, index) => (
                        <MdListItem key={handler.elementKey(item, index)} style={{
                            flex: "0 0 calc(20% - 12px)",
                            justifyContent: "center",
                            textAlign: "center",
                            minWidth: minWidth
                        }}>
                            <div>
                                {(isPending ? handler.skeletonRender : handler.elementRender)(item, index)}
                            </div>
                        </MdListItem>
                    ))}
                    {emptyItems.map((item, index) => (
                        <MdListItem key={`empty-${index}`} style={{
                            flex: "0 0 calc(20% - 12px)",
                            justifyContent: "center",
                            textAlign: "center",
                            minWidth: minWidth,
                            visibility: "hidden" // (isPending ? "visible" : "hidden")
                        }}>
                            <div>
                                {(isPending ? handler.skeletonRender : handler.elementRender)(item as T, index)}
                            </div>
                        </MdListItem>
                    ))}
                </MdList>
            </div>
            <div style={{
                display: "flex",
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
                        <span>{data?.page_count || realPageNo}</span>
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
    lineCount?: number
}