import { useCallback, useMemo, useRef, useState } from "react";
import { MdDialog, MdElevatedButton, MdElevation, MdFilledButton, MdIcon, MdIconButton, MdOutlinedButton, MdOutlinedSelect, MdOutlinedTextField, MdPrimaryTab, MdSelectOption, MdSwitch, MdTabs, MdTextButton } from "../Material";
import styles from "./paste-editor.module.css"
import { lock, lock_open_right } from "../Icons";
import type { TextFieldType } from "@material/web/textfield/outlined-text-field";
import { solarizedLight as codeStyle } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import hljs from 'highlight.js';
import type File from "../../entity/file";
import FileList from "../file-list/file-list";
import { createNewPasteWithFile, deleteLockedPaste, updatePasteWithFile } from "../../api";
import type { UnsupportedTextFieldType } from "@material/web/textfield/internal/text-field";
import type PasteModel from "../../entity/paste_model";

const readCount = [0, 1, 10, 100, 1000, 10000, 100000];
const expiration = [0, 3 * 60, 10 * 60, 60 * 60, 3 * 60 * 60, 10 * 60 * 60, 24 * 60 * 60, 3 * 24 * 60 * 60, 30 * 24 * 60 * 60, 365 * 24 * 60 * 60]

function dateString(seconds: number) {
    const s = seconds % 60; seconds = Math.floor(seconds / 60);
    const m = seconds % 60; seconds = Math.floor(seconds / 60);
    const h = seconds % 24; seconds = Math.floor(seconds / 24);
    const d = seconds;
    let result = "";
    if (d > 0) result += `${d}天`;
    if (h > 0) result += `${h}小时`;
    if (m > 0) result += `${m}分钟`;
    if (s > 0) result += `${s}秒`;
    return result === "" ? "无限期" : result;
}

export default function PasteEditor({
    pasteModle,
    readonly,
    onChange,
    onDelete,
}: PasteEditorProps) {
    const editMode = pasteModle?.paste?.name && true || false;
    const password = pasteModle?.paste?.password || "";

    const [mode, setMode] = useState(0);
    const [sendFlag, setSendFlag] = useState(false);

    const [paste, setPaste] = useState(pasteModle?.paste || {});
    const [attachements, setAttachements] = useState(pasteModle?.files || []);
    const [files, setFiles] = useState<Array<globalThis.File>>([]);

    const [error, setError] = useState<string>("");
    const [isDelete, setDelete] = useState(false);
    const [deleteComfirm, setDeleteComfirm] = useState("");

    const language = useMemo(() => {
        const highliteResult = hljs.highlightAuto(paste.content || "");
        const lang = highliteResult.language || "text";
        setPaste({...paste, content_type: lang});
        return lang;
    }, [paste.content]);

    const doAction = () => {
        if (readonly || sendFlag) return;

        const body = new FormData;
        const p = {...paste};
        p.attachements = attachements.map(it => it.id).join(",");
        if ((p.name || "").length === 0) {
            p.name = undefined;
        }
        if (p.burn_after_reads === 0) p.burn_after_reads = undefined;
        if (p.expiration_at === 0) p.expiration_at = undefined;
        if (p.private === undefined) p.private = false;
        if (p.read_only === undefined) p.read_only = false;
        else if (p.expiration_at) p.expiration_at += Math.floor(Date.now() / 1000);

        const hasContent = (p.content || "").trim() !== "";
        const hasFiles = files.length > 0;
        if (!hasContent && !hasFiles) {
            setError("新建剪切板时, 必须含有剪切板内容或者文件中的一个");
            return;
        }

        
        files.forEach(file => {
            body.append("file", file);
        });

        let promise: Promise<PasteModel>;
        if (editMode) {
            body.set("paste", JSON.stringify({
                password: password,
                paste: p
            }));
            promise = updatePasteWithFile(p, body);
        } else {
            body.set("paste", JSON.stringify(p));
            promise = createNewPasteWithFile(body);
        }
        promise
            .then(it => {
                setSendFlag(true);
                if (it.paste) {
                    setPaste(it.paste);
                }
                if (it.files) {
                    setAttachements(it.files);
                }
                setFiles([]);
                const e = it;
                if (e.paste) {
                    e.paste.password = p.password;
                }
                if (onChange) onChange(e);
            })
            .catch(e => {
                setError(e.message);
            });
    }

    const beginDelete = () => {
        setDelete(true);
        setDeleteComfirm("");
    }

    const cancelDelete = () => {
        setDelete(false);
        setDeleteComfirm("");
    }

    const startDelete = () => {
        const pasteName = deleteComfirm;
        cancelDelete();
        deleteLockedPaste(pasteName, password)
        .then(_ => {
            onDelete && onDelete();
        })
        .catch(e => {
            setError(e.message);
        })
    }

    return (
        <div className={`${styles["panel"]}`}>
            <MdElevation/>

            <form method="dialog" style={{width: "100%"}}>
                <div className={`${styles["metadatas"]}`}>
                    <SwitchTextField
                        label="自动生成剪切板名"
                        selectedLabel="剪切板名"
                        placeholder="自动生成剪切板名"
                        selectedPlaceholder="请输入剪切板名"
                        maxLength={16}
                        readOnly={editMode || sendFlag || readonly}
                        value={paste.name}
                        onChange={name => setPaste({...paste, name: name})}
                    ></SwitchTextField>
                    <SwitchTextField
                        label="禁用密码"
                        selectedLabel="密码"
                        placeholder="已禁用密码"
                        selectedPlaceholder="请输入密码"
                        maxLength={16}
                        type="password"
                        value={paste.password}
                        onChange={p => setPaste({...paste, password: p})}
                    />
                    
                    <div className={`${styles["metadatas"]}`}>
                        <MdOutlinedSelect
                            className={`${styles["switch-text-field"]}`}
                            label="可阅读次数"
                            onChange={(e: any) => setPaste({...paste, burn_after_reads: parseInt(e.target.value)})}
                        >
                            {readCount.map((count, _) => (
                                <MdSelectOption key={count} value={`${count}`} selected={(paste.expiration_at || 0) === count}>
                                    {count === 0 ? "无限" : `${count}`}
                                </MdSelectOption>
                            ))}
                        </MdOutlinedSelect>

                        <MdOutlinedSelect
                            className={`${styles["switch-text-field"]}`}
                            label="有效期"
                            onChange={(e: any) => setPaste({...paste, expiration_at: parseInt(e.target.value)})}
                        >
                            {expiration.map((seconds, _) => (
                                <MdSelectOption key={seconds} value={`${seconds}`} selected={(paste.expiration_at || 0) === seconds}>
                                    {dateString(seconds)}
                                </MdSelectOption>
                            ))}
                        </MdOutlinedSelect>
                    </div>

                    <span className={`${styles["metadatas"]}`}>
                        <label className={`${styles["switch"]}`}>
                            <span>公开</span>
                            <span><MdSwitch icons selected={!paste.private} onChange={(e: any) => setPaste({...paste, private: !e.target.selected})}></MdSwitch></span>
                        </label>

                        <label className={`${styles["switch"]}`}>
                            <span>只读</span>
                            <span><MdSwitch icons selected={paste.read_only} onChange={(e: any) => setPaste({...paste, read_only: e.target.selected})}></MdSwitch></span>
                        </label>
                    </span>
                </div>
                
                <div className={`${styles["textarea"]}`}>
                    <MdTabs style={{
                        backgroundColor: "var(--md-sys-color-surface, #ffffff)"
                    }}>
                        <MdPrimaryTab onClick={() => setMode(0)}>编辑</MdPrimaryTab>
                        <MdPrimaryTab onClick={() => setMode(1)}>预览</MdPrimaryTab>
                        <MdPrimaryTab onClick={() => setMode(2)}>文件</MdPrimaryTab>
                    </MdTabs>
                    <div style={{
                        marginTop: "16px"
                    }}>
                        {mode === 0 && (
                            <PasteContentEditor 
                                defaultValue={paste.content}
                                onChange={content => setPaste({...paste, content: content})}
                                language={language}
                            ></PasteContentEditor>
                        )}
                        {mode === 1 && (
                            <PastePreview content={paste.content} language={language}></PastePreview>
                        )}
                        {mode === 2 && (
                            <PasteFile attachements={attachements} uploads={files} onUpload={setFiles} onDeleteAttachements={(a, b) => {
                                setAttachements(a);
                                setFiles(b);
                            }}></PasteFile>
                        )}
                    </div>
                </div>

                <MdElevatedButton
                    style={{
                        width: "100%",
                        margin: "24px auto 2px"
                    }}
                    onClick={doAction}
                >发布</MdElevatedButton>
                {editMode && (
                    <MdOutlinedButton
                        className={styles["danger-delete"]}
                        style={{
                            width: "100%",
                            margin: "24px auto 2px",
                        }}
                        onClick={beginDelete}
                    >删除</MdOutlinedButton>
                )}
            </form>

            <MdDialog 
                open={error !== ""}
                type="alert"
                onClose={() => setError("")}
                onCancel={() => setError("")}
            >
                <div slot="headline">创建失败</div>
                <div slot="content">{error}</div>
                <div slot="actions">
                    <MdTextButton onClick={() => setError("")}>确定</MdTextButton>
                </div>
            </MdDialog>

            <MdDialog 
                open={isDelete}
                type="alert"
                onClose={cancelDelete}
                onCancel={cancelDelete}
                style={{width: "80%"}}
            >
                <div slot="headline" style={{color: "#ba1a1a"}}>是否删除</div>

                <div slot="content" style={{color: "#ba1a1a"}}>
                    <p>请输入当前剪切板名 '{paste.name}' 以确认删除</p>
                    <MdOutlinedTextField 
                        className={styles["danger-delete"]}
                        label="请输入剪切板名"
                        value={deleteComfirm}
                        onInput={(e: any) => setDeleteComfirm(e.target.value)}
                        style={{width: "100%"}}
                    ></MdOutlinedTextField>
                </div>

                <div slot="actions">
                    <MdOutlinedButton 
                        className={styles["danger-delete"]}
                        onClick={startDelete}
                        disabled={deleteComfirm !== paste.name}
                    >确定</MdOutlinedButton>
                    <MdFilledButton 
                        onClick={cancelDelete}
                    >取消</MdFilledButton>
                </div>
            </MdDialog>
        </div>
    );
}

interface PasteEditorProps {
    pasteModle?: PasteModel,
    readonly?: boolean,
    onChange?: (_: PasteModel) => void,
    onError?: (_: Error) => void,
    onDelete?: () => void
}

function SwitchTextField({
    maxLength,
    placeholder,
    selectedPlaceholder,
    label,
    selectedLabel,
    value,
    type = "text",
    onChange,
    readOnly,
}: SwitchTextFieldProps) {
    const [enabled, setEnabled] = useState(false);

    return (
        <span className={`${styles["switch-text-field"]}`}>
            <MdOutlinedTextField
                label={enabled ? selectedLabel : label}
                placeholder={enabled ? selectedPlaceholder : placeholder}
                value={value || ""}
                readOnly={!enabled || readOnly}
                required={enabled}
                type={type}
                maxLength={(value || "").length > 0 ? maxLength : undefined}
                onChange={(e: any) => onChange && onChange(e.target.value)}
            >
                <MdIconButton
                    slot="trailing-icon"
                    toggle
                    selected={enabled || readOnly}
                    onChange={(e: any) => setEnabled(e.target.selected)}
                    disabled={false}
                    type="button"
                >
                    <MdIcon>{lock}</MdIcon>
                    <MdIcon slot="selected">{lock_open_right}</MdIcon>
                </MdIconButton>
            </MdOutlinedTextField>
        </span>
    )
}

interface SwitchTextFieldProps {
    maxLength?: number,
    placeholder: string,
    selectedPlaceholder: string,
    label: string,
    selectedLabel: string,
    type?: TextFieldType | UnsupportedTextFieldType,
    value?: string,
    onChange?: (_: string) => void,
    readOnly?: boolean
}

function PasteContentEditor({
    onChange,
    defaultValue,
    language = "text"
}: PasteContentEditorProps) {

    const [rows, setRows] = useState(Math.max(10, defaultValue?.split("\n").length || 0))

    return (
        <MdOutlinedTextField
            label={`剪切板内容 - ${language}`}
            placeholder="剪切板内容"
            style={{width: "100%", minHeight: "374px"}}
            value={defaultValue || ""}
            onInput={(e: any) => {
                setRows(Math.max(10, e.target.value.split("\n").length));
                onChange(e.target.value);
            }}
            type="textarea"
            rows={rows + 2}
        >

        </MdOutlinedTextField>
    );
}

interface PasteContentEditorProps {
    onChange: (content: string) => void,
    defaultValue?: string,
    language?: string
}

function PastePreview({
    content,
    language
}: PastePreviewProps) {
    return (
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
            >{content || ""}</SyntaxHighlighter>
        </div>
    );
}

interface PastePreviewProps {
    content?: string,
    language: string,
}

function PasteFile({
    uploads,
    attachements,
    onUpload,
    onDeleteAttachements,
}: PasteFileProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [count, setCount] = useState(0);
    const files = useMemo(() => {
        const list = [...attachements];
        let index = 0;
        for (const f of uploads) {
            list.push({
                filename: f.name,
                filesize: f.size,
                mimetype: f.type,
                hash: index.toString()
            } as File);
            index += 1;
        }
        setCount(t => t + 1);
        return list;
    }, [uploads, attachements]);

    const chooseFile = useCallback((filelist: FileList) => {
        const list = [...uploads];
        for (let i = 0; i < filelist.length; ++i) {
            const f = filelist[i];
            for (const file of files) {
                if (f.name === file.filename) {
                    break;
                }
            }
            list.push(f);
        }
        onUpload(list);
    }, [files, uploads])

    const deleteFile = useCallback((file: File) => {
        if (file.id) {
            onDeleteAttachements(
                attachements.filter(i => i.id !== file.id),
                uploads
            );
        } else {
            onDeleteAttachements(
                attachements,
                uploads.filter(it => it.name !== file.filename)
            );
        }
    }, [uploads, attachements])

    return (
        <div className={`${styles["paste-file"]}`}>
            <div style={{ padding: "24px" }}>
                <input type="file" style={{display: "none"}} ref={fileInputRef} onChange={e => {
                    if (e.target.files) chooseFile(e.target.files);
                }}/>
                <MdElevatedButton 
                    style={{
                        width: "100%"
                    }}
                    onClick={() => fileInputRef.current!.click()}
                    type="button"
                >上传</MdElevatedButton>
            </div>

            {files.length > 0 && 
                <FileList key={count} files={files} pasteName="null" onDelete={deleteFile}></FileList>
            }
        </div>
    )
}

interface PasteFileProps {
    uploads: globalThis.File[],
    attachements: File[],
    onUpload: (_: globalThis.File[]) => void,
    onDeleteAttachements: (_: File[], __: globalThis.File[]) => void,
}