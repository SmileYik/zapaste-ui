import { useCallback, useMemo } from "react";
import type File from "../../entity/file";
import PaginationList from "../pagination-list";
import PaginationListHandler from "../pagination-list/PaginationListHandler";
import type { PaginationParams } from "../../entity/page_list";
import type PageList from "../../entity/page_list";
import { MdElevation, MdIcon, MdOutlinedIconButton } from "../Material";
import { delete_icon, download, file_present, image } from "../Icons"
import styles from "./file-list.module.css"

export default function FileList({
    files = [] as File[],
    pasteName,
    readonly = false,
    onDelete,
    onDownload,
}: FileListProps) {

    const pageResult = useMemo(() => {
        return {
            list: files,
            page_size: files.length,
            total: files.length,
            page_count: 1,
            page_no: 1
        } as PageList<File>
    }, [files]);

    const requestList = useCallback((_: PaginationParams) => {
        return new Promise<PageList<File>>((resolve, __) => {
            resolve(pageResult);
        });
    }, [pageResult]);

    return (
        <div className={styles["file-list"]}>
            <div className={styles["file-list-header"]}>
                {/* <h2 className={styles["file-list-title"]}>Files</h2> */}
                {/* <MdDivider/> */}
            </div>
            <PaginationList 
                requestFn={requestList} 
                bypassData={pageResult}
                handler={new FileListHandler(readonly, pasteName, onDelete, onDownload)}
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
    pasteName: string,
    onDelete?: (file: File) => void,
    onDownload?: (filename: string) => void,
}

class FileListHandler extends PaginationListHandler<File> {

    readonly: boolean = false;
    pasteName: string = "";
    onDelete?: (file: File) => void;
    onDownload?: (filename: string) => void;

    constructor(readonly: boolean, pasteName: string, onDelete?: (file: File) => void, onDownload?: (filename: string) => void) {
        super()
        this.readonly = readonly;
        this.pasteName = pasteName;
        this.onDelete = onDelete;
        this.onDownload = onDownload;
    }

    override skeletonRender = (_: File, __: number) => {
        return (
            <div>

            </div>
        )
    }

    override elementRender = (item: File, _: number) => {
        const filename = item.filename || "未知";
        const filesize = item.filesize || 0;

        const units = ["Byte", "KB", "MB", "GB", "TB"];
        let transformedSize = filesize;
        let unitIndex = 0;
        while (transformedSize > 1024 && unitIndex < units.length - 1) {
            transformedSize /= 1024;
            unitIndex++;
        }

        const gotoDownload = (filename: string) => {
            this.onDownload && this.onDownload(filename);
            // window.open(downloadUrl(this.pasteName, filename));
        };

        return (
            <div className={styles["file-panel"]}>
                <MdElevation/>

                <MdIcon title={item.mimetype}>
                    {item.mimetype?.includes("image") ? image : file_present}
                </MdIcon>

                <div className={styles["file-name"]} title={filename}>{filename}</div>
                <div>
                    {transformedSize.toFixed(2)} {units[unitIndex]}
                </div>

                <div className={styles["action-bar"]}>
                    {item.id && (
                        <MdOutlinedIconButton 
                            title="下载文件"
                            className={styles["download-button"]}
                            onClick={() => gotoDownload(item.filename || "")}
                        >
                            <MdIcon>{download}</MdIcon>
                        </MdOutlinedIconButton>
                    )}
                    
                    {!this.readonly && (
                        <MdOutlinedIconButton 
                            title="删除"
                            className={styles["delete-button"]}
                            onClick={() => this.onDelete && this.onDelete(item)}
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