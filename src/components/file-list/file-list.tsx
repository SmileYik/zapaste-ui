import { useCallback, useMemo, useState } from "react";
import type File from "../../entity/file";
import PaginationList from "../pagination-list";
import PaginationListHandler from "../pagination-list/PaginationListHandler";
import type { PaginationParams } from "../../entity/page_list";
import type PageList from "../../entity/page_list";
import { MdDivider, MdElevation, MdIcon, MdOutlinedIconButton } from "../Material";
import { delete_icon, download, file_present, image } from "../Icons"
import styles from "./file-list.module.css"

export default function FileList({
    files = [] as File[],
    readonly = false,
}: FileListProps) {
    
    const [list] = useState(files);

    const pageResult = useMemo(() => {
        return {
            list: list,
            page_size: list.length,
            total: list.length,
            page_count: 1,
            page_no: 1
        } as PageList<File>
    }, [list]);

    const requestList = useCallback((_: PaginationParams) => {
        return new Promise<PageList<File>>((resolve, __) => {
            resolve(pageResult);
        });
    }, [pageResult]);

    return (
        <div className={styles["file-list"]}>
            <div className={styles["file-list-header"]}>
                <h2 className={styles["file-list-title"]}>Files</h2>
                <MdDivider/>
            </div>
            <PaginationList 
                requestFn={requestList} 
                bypassData={pageResult}
                handler={new FileListHandler(readonly)}
                disablePagination
                disableEmptyFill
                lineCount={1}
                bodyClassName={styles["file-list-body"]}
            ></PaginationList>
        </div>
    );
}

interface FileListProps {
    files: File[],
    readonly?: boolean,
}

class FileListHandler extends PaginationListHandler<File> {

    readonly: boolean = false;

    constructor(readonly: boolean) {
        super()
        this.readonly = readonly;
    }

    override skeletonRender = (_: File, __: number) => {
        return (
            <div>

            </div>
        )
    }

    override elementRender = (item: File, _: number) => {
        console.log(item);
        const filename = item.filename || "未知";
        const filesize = item.filesize || 0;

        const units = ["Byte", "KB", "MB", "GB", "TB"];
        let transformedSize = filesize;
        let unitIndex = 0;
        while (transformedSize > 1024 && unitIndex < units.length - 1) {
            transformedSize /= 1024;
            unitIndex++;
        }

        return (
            <div className={styles["file-panel"]}>
                <MdElevation/>

                <MdIcon slot="start">
                    {item.mimetype?.includes("image") ? image : file_present}
                </MdIcon>

                <div slot="headline" style={{ fontWeight: '500' }}>{filename}</div>
                <div slot="supporting-text">
                    {transformedSize.toFixed(2)} {units[unitIndex]}
                </div>

                <div slot="end" className={styles["action-bar"]}>
                    <MdOutlinedIconButton 
                        title="下载文件"
                        className={styles["download-button"]}
                    >
                        <MdIcon>{download}</MdIcon>
                    </MdOutlinedIconButton>
                    
                    {!this.readonly && (
                        <MdOutlinedIconButton 
                            title="删除"
                            className={styles["delete-button"]}
                        >
                            <MdIcon>{delete_icon}</MdIcon>
                        </MdOutlinedIconButton>
                    )}
                </div>
            </div>
        )
    }

    override elementKey = (item: File, index: number) => item.hash || item.id?.toString() || `${item.filename}-${index}`;
}