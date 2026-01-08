
import { MdDialog, MdDivider, MdElevation, MdFilledTextField, MdIcon, MdOutlinedIconButton, MdTextButton } from "../Material";
import type PasteModel from "../../entity/paste_model";
import styles from "./paste-model-detail.module.css"
import { solarizedLight as codeStyle } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import hljs from 'highlight.js';
import { calendar_today, captive_portal, content_copy, edit_document, lock, visibility, visibility_off } from "../Icons";
import FileList from "../file-list/file-list";
import { useState } from "react";

export default function PatseModelDetail({
    pasteModel = {} as PasteModel,
    onEdit,
}: PatseModelDetailProps) {

    const paste = pasteModel.paste || {};
    const files = pasteModel.files;

    const content = paste.content || "";
    const highliteResult = hljs.highlightAuto(content);
    const language = paste.content_type || highliteResult.language || "text"

    const createDate = paste.create_at ? new Date(paste.create_at * 1000).toLocaleString() : "未知";

    const [copyLink, setCopyLink] = useState(false);

    return (
        <div className={styles["detail-container"]}>
            <div className={styles["panel"]}>
                <MdElevation/>

                <div className={styles["panel-header"]}>
                    <div className={styles["header-top"]}>
                        <div className={styles["title-group"]}>
                            <h1 className={styles["title"]}>{paste.name}</h1>
                            <MdIcon 
                                className={`${styles["status-icon"]} ${styles["copy-link"]}`}
                                title="复制链接"
                                onClick={() => setCopyLink(true)}
                            >{captive_portal}</MdIcon>
                            
                            {paste.has_password && <MdIcon className={styles["status-icon"]}>{lock}</MdIcon>}
                            {paste.private && <MdIcon className={styles["status-icon"]}>{visibility_off}</MdIcon>}
                        </div>
                        <div className={styles["actions"]}>
                            <MdOutlinedIconButton title="编辑" onClick={onEdit}>
                                <MdIcon>{edit_document}</MdIcon>
                            </MdOutlinedIconButton>
                            <MdOutlinedIconButton title="复制" onClick={() => navigator.clipboard.writeText(content)}>
                                <MdIcon>{content_copy}</MdIcon>
                            </MdOutlinedIconButton>
                        </div>
                    </div>
                    
                    <div className={styles["metadata"]}>
                        <span><MdIcon>{visibility}</MdIcon> {paste.read_count || 0} 次阅读</span>
                        <span><MdIcon>{calendar_today}</MdIcon> 创建于 {createDate}</span>
                        <span className={styles["lang-tag"]}>{language.toUpperCase()}</span>
                    </div>
                    <MdDivider />
                </div>

                <div className={styles["panel-body"]}>
                    {content && content !== "" && (
                        <div className={styles["code-container"]}>
                            <SyntaxHighlighter
                                language={language}
                                style={codeStyle}
                                showLineNumbers
                                useInlineStyles
                                customStyle={{
                                    "borderRadius": "20px",
                                    "minHeight": "350px",
                                    "padding": "12px",
                                    "margin": "8px",
                                    "fontSize": "14px",
                                    "lineHeight": "1.6",
                                    "background": "var(--md-sys-color-surface-container-lowest)"
                                }}
                            >{content}</SyntaxHighlighter>
                        </div>
                    )}

                    <div className={styles["file-container"]}>
                        {files && files.length > 0 && <FileList readonly files={files || []} pasteName={paste.name || ""}></FileList>}
                    </div>
                </div>
            </div>

            <MdDialog 
                open={copyLink}
                onClose={() => setCopyLink(false)}
                onCancel={() => setCopyLink(false)}
                style={{width: "80%"}}
            >
                <div slot="headline">复制链接</div>
                <div slot="content">
                    <MdFilledTextField
                        value={location.href}
                        selectionStart={0}
                        selectionEnd={location.href.length}
                        style={{width: "100%"}}
                    ></MdFilledTextField>
                </div>
                <div slot="actions">
                    <MdTextButton onClick={() => setCopyLink(false)}>确定</MdTextButton>
                </div>
            </MdDialog>
        </div>
    )
}

interface PatseModelDetailProps {
    pasteModel?: PasteModel,
    onEdit?: () => void,
}

export function PatseModelDetailSkeleton() {
    return (
        <div className={`${styles["detail-container"]} ${styles["skeleton-wrapper"]}`}>
            <div className={styles["panel"]}>
                <MdElevation/>

                <div className={`${styles["panel-header"]}`}>
                    <div className={`${styles["header-top"]}`}>
                        <div className={styles["title-group"]}>
                            <h1 className={`${styles["title"]} ${styles["skeleton"]}`}></h1>
                        </div>
                        <div className={`${styles["actions"]} ${styles["skeleton"]}`}>
                        </div>
                    </div>
                    <div className={`${styles["metadata"]} ${styles["skeleton"]}`}>
                    </div>
                    <MdDivider />
                </div>

                <div className={styles["panel-body"]}>
                    <div className={`${styles["code-container"]} ${styles["skeleton"]}`}></div>
                    <div className={`${styles["code-container"]} ${styles["skeleton"]}`}></div>
                    <div className={`${styles["code-container"]} ${styles["skeleton"]}`}></div>
                    <div className={`${styles["code-container"]} ${styles["skeleton"]}`}></div>
                    <div className={`${styles["code-container"]} ${styles["skeleton"]}`}></div>
                </div>
                <div></div>
            </div>
        </div>
    )
}