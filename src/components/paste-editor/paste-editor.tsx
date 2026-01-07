import { useCallback, useMemo, useRef, useState } from "react";
import { MdElevatedButton, MdElevation, MdIcon, MdIconButton, MdOutlinedSelect, MdOutlinedTextField, MdPrimaryTab, MdSecondaryTab, MdSelectOption, MdSwitch, MdTabs } from "../Material";
import styles from "./paste-editor.module.css"
import { lock, lock_open_right } from "../Icons";
import type { TextFieldType } from "@material/web/textfield/outlined-text-field";
import { solarizedLight as codeStyle } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import hljs from 'highlight.js';
import type File from "../../entity/file";
import FileList from "../file-list/file-list";
import type Paste from "../../entity/paste";
import { createNewPasteWithFile } from "../../api";
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
    pasteModle
}: PasteEditorProps) {
    const [mode, setMode] = useState(0);

    const [content, setContent] = useState(pasteModle?.paste?.content || "");
    const [files, setFiles] = useState<Array<FileList>>([]);
    const [attachements, setAttachements] = useState<File[]>(pasteModle?.files || []);
    const language = useMemo(() => {
        const highliteResult = hljs.highlightAuto(content);
        return highliteResult.language || "text";
    }, [content]);

    const doAction = (body: FormData) => {
        const name = (body.get("name")?.toString() || "").trim();
        const burn_after_reads = parseInt((body.get("burn_after_reads")?.toString() || "0").trim());
        const expiration_at = parseInt((body.get("expiration_at")?.toString() || "0").trim());
        
        const paste: Paste = {
            name: name === "" ? undefined : name,
            password: body.get("password")?.toString() || "",
            private: "true" === (body.get("private")?.toString() || "true"),
            read_only: "true" === (body.get("read_only")?.toString() || "true"),
            content: body.get("content")?.toString(),
            attachements: attachements.map(it => it.id).join(","),
            content_type: body.get("content_type")?.toString(),
            burn_after_reads: burn_after_reads === 0 ? undefined : burn_after_reads,
            expiration_at: expiration_at === 0 ? undefined : expiration_at + Math.floor(Date.now() / 1000),
        };
        body.delete("name");
        body.delete("password");
        body.delete("private");
        body.delete("read_only");
        body.delete("content");
        body.delete("content_type");
        body.delete("burn_after_reads");
        body.delete("expiration_at");

        if ((paste.content || "").trim() === "") {
            return;
        }

        body.set("paste", JSON.stringify(paste));
        files.forEach(file => {
            body.append("file", file[0]);
        })

        createNewPasteWithFile(body).then(it => {
            console.log(it);
        })
    }

    return (
        <div className={`${styles["panel"]}`}>
            <MdElevation/>

            <form method="dialog" style={{width: "100%"}} action={doAction}>
                <div className={`${styles["metadatas"]}`}>
                    <SwitchTextField
                        name="name"
                        label="自动生成剪切板名"
                        selectedLabel="剪切板名"
                        placeholder="自动生成剪切板名"
                        selectedPlaceholder="请输入剪切板名"
                        maxLength={16}
                        defaultValue={pasteModle?.paste?.name || undefined}
                    ></SwitchTextField>
                    <SwitchTextField
                        name="password"
                        label="禁用密码"
                        selectedLabel="密码"
                        placeholder="已禁用密码"
                        selectedPlaceholder="请输入密码"
                        maxLength={16}
                        type="password"
                    />
                    
                    <MdOutlinedSelect
                        name="burn_after_reads"
                        label="可阅读次数"
                        defaultValue="0"
                    >
                        {readCount.map((count, _) => (
                            <MdSelectOption key={count} value={`${count}`} defaultChecked={count === 0}>
                                {count === 0 ? "无限" : `${count}`}
                            </MdSelectOption>
                        ))}
                    </MdOutlinedSelect>

                    <MdOutlinedSelect
                        name="expiration_at"
                        label="有效期"
                        defaultValue="0"
                    >
                        {expiration.map((seconds, _) => (
                            <MdSelectOption key={seconds} value={`${seconds}`} defaultChecked={seconds === 0}>
                                {dateString(seconds)}
                            </MdSelectOption>
                        ))}
                    </MdOutlinedSelect>

                    <span className={`${styles["metadatas"]}`}>
                        <label className={`${styles["switch"]}`}>
                            <span>公开</span>
                            <span><MdSwitch name="private" icons defaultChecked={pasteModle?.paste?.private || true}></MdSwitch></span>
                        </label>

                        <label className={`${styles["switch"]}`}>
                            <span>只读</span>
                            <span><MdSwitch name="read_only" icons defaultChecked={pasteModle?.paste?.read_only || false}></MdSwitch></span>
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
                                defaultValue={content}
                                onChange={setContent}
                                language={language}
                            ></PasteContentEditor>
                        )}
                        {mode === 1 && (
                            <PastePreview content={content} language={language}></PastePreview>
                        )}
                        {mode === 2 && (
                            <PasteFile attachements={attachements} uploads={files} onUpload={setFiles} onDeleteAttachements={(a, b) => {
                                setAttachements(a);
                                setFiles(b);
                            }}></PasteFile>
                        )}
                    </div>
                </div>
                <div style={{display: "none"}}>
                    <textarea name="content" value={content} readOnly/>
                    <input name="content_type" value={language} readOnly/>
                </div>

                <MdElevatedButton
                    style={{
                        width: "100%",
                        margin: "24px auto"
                    }}
                    type="submit"
                >发布</MdElevatedButton>
            </form>
        </div>
    );
}

interface PasteEditorProps {
    pasteModle?: PasteModel
}

function SwitchTextField({
    maxLength,
    name,
    placeholder,
    selectedPlaceholder,
    label,
    selectedLabel,
    defaultValue,
    type = "text",
}: SwitchTextFieldProps) {
    const [enabled, setEnabled] = useState(false);
    const [value, setValue] = useState<any>(defaultValue || "");

    return (
        <span className={`${styles["switch-text-field"]}`}>
            <MdOutlinedTextField
                name={name}
                label={enabled ? selectedLabel : label}
                placeholder={enabled ? selectedPlaceholder : placeholder}
                value={value}
                readOnly={!enabled}
                required={enabled}
                type={type}
                maxLength={value.length > 0 ? maxLength : undefined}
                onChange={(e: any) => setValue(e.target.value)}
            >
                <MdIconButton
                    slot="trailing-icon"
                    toggle
                    selected={enabled}
                    onChange={(e: any) => { setEnabled(e.target.selected); defaultValue && setValue(undefined) }}
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
    name: string,
    placeholder: string,
    selectedPlaceholder: string,
    label: string,
    selectedLabel: string,
    type?: TextFieldType | UnsupportedTextFieldType,
    defaultValue?: string,
}

function PasteContentEditor({
    onChange,
    defaultValue,
    language = "text"
}: PasteContentEditorProps) {

    const [rows, setRows] = useState(Math.max(10, defaultValue.split("\n").length))

    return (
        <MdOutlinedTextField
            label={`剪切板内容 - ${language}`}
            placeholder="剪切板内容"
            required
            style={{width: "100%", minHeight: "374px"}}
            value={defaultValue}
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
    defaultValue: string,
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
            >{content}</SyntaxHighlighter>
        </div>
    );
}

interface PastePreviewProps {
    content: string,
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
        for (const fl of uploads) {
            for (let i = 0; i < fl.length; ++i) {
                const f = fl[i];
                list.push({
                    filename: f.name,
                    filesize: f.size,
                    mimetype: f.type,
                    hash: index.toString()
                } as File);
            }
            index += 1;
        }
        setCount(t => t + 1);
        return list;
    }, [uploads, attachements]);

    const chooseFile = useCallback((filelist: FileList) => {
        for (let i = 0; i < filelist.length; ++i) {
            const f = filelist[i];
            for (const file of files) {
                if (f.name === file.filename) {
                    return;
                }
            }
        }
        onUpload([...uploads, filelist]);
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
                uploads.filter(it => {
                    for (let i = 0; i < it.length; ++i) {
                        const f = it[i];
                        if (f.name === file.filename) {
                            return false;
                        }
                    }
                    return true;
                })
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
    uploads: FileList[],
    attachements: File[],
    onUpload: (_: FileList[]) => void,
    onDeleteAttachements: (_: File[], __: FileList[]) => void,
}