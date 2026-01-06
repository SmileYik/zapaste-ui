import { solarizedLight as codeStyle } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { MdDialog, MdDivider, MdElevation, MdFilledButton, MdFilledTextField, MdFilledTonalButton, MdIcon, MdOutlinedButton, MdOutlinedIconButton, MdOutlinedTextField } from "../../components/Material";
import type PasteModel from "../../entity/paste_model";
import styles from "./paste-detail.module.css"
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import hljs from 'highlight.js';
import { calendar_today, content_copy, edit_document, lock, visibility, visibility_off } from "../../components/Icons";
import FileList from "../../components/file-list/file-list";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLockedPaste } from "../../api";
import PatseModelDetail, { PatseModelDetailSkeleton } from "../../components/paste-model-detail/paste-model-detail";
import { useLocation, useMatches, useNavigate } from "react-router";

export default function PatseDetail({

}: PatseDetailProps) {
    const matches = useMatches();
    const route = matches[matches.length - 1];
    const navigate = useNavigate();

    const [name, setName] = useState(route.params?.name || "");
    const [password, setPassword] = useState("");
    const [passwordField, setPasswordField] = useState("");
    const [errorTimes, setErrorTimes] = useState(0);

    const isEmptyName = useMemo(() => {
        return (name || "").trim().length === 0;
    }, [name]);

    const {isPending, error, data, isError} = useQuery({
        queryKey: ["data", name, password],
        queryFn: () => getLockedPaste(name, password),
        retry: false,
        enabled: !isEmptyName
    });
    useEffect(() => {
        setErrorTimes(t => t + 1);
        console.log(errorTimes);
        
    }, [isError])

    const enterPassword = useCallback(() => {
        if (!passwordField || passwordField.trim().length === 0) {
            return;
        }
        setPassword(passwordField);
    }, [passwordField]);

    const gotoChoosePastePage = useCallback(() => {
        navigate(route.pathname + "/..")
    }, [])

    return (
        <div className={styles["detail-container"]}>
            {data && (
                <PatseModelDetail pasteModel={data}></PatseModelDetail>
            )}

            {(isPending || isError) && (
                <PatseModelDetailSkeleton></PatseModelDetailSkeleton>
            )}
            
            <MdDialog open={!isPending && isError} type="alert">
                <div slot="headline">请尝试输入密码</div>
                <form slot="content" className={styles["password-dialog-content"]} method="dialog">
                    <MdOutlinedTextField
                        label="密码"
                        placeholder="请输入密码"
                        required
                        defaultValue={passwordField}
                        onChange={(target: any) => setPasswordField(target.target.value)}
                        style={{
                            width: "100%"
                        }}
                    ></MdOutlinedTextField>
                    {errorTimes > 2 && (
                        <span className={styles["password-dialog-error"]}>{error?.message}</span>)
                    }

                    <div slot="actions" className={styles["password-dialog-actions"]}>
                        <MdFilledButton value="ok" onClick={enterPassword}>确定</MdFilledButton>
                        <MdFilledTonalButton value="cancel" onClick={gotoChoosePastePage}>返回</MdFilledTonalButton>
                    </div>
                </form>
            </MdDialog>
        </div>
    )
}

interface PatseDetailProps {
    
}

function PasteNameInput({
    name = "",
    onChange,
}: PasteNameInputProps) {
    const [currentName, setCurrentName] = useState(name)
    return (
        <div>
            <form className={styles["request-paste-name"]} method="dialog">
                <MdElevation/>

                <MdOutlinedTextField
                    label="剪切板名"
                    placeholder="请输入剪切板名"
                    required
                    defaultValue={currentName}
                    onChange={(target: any) => setCurrentName(target.target.value)}
                    style={{
                        width: "100%"
                    }}
                ></MdOutlinedTextField>

                <div className={styles["request-paste-name-actions"]}>
                    <MdFilledButton value="ok" onClick={() => onChange(currentName)}>确定</MdFilledButton>
                </div>
            </form>
        </div>
    );
}

interface PasteNameInputProps {
    name?: string,
    onChange: (name: string) => void
}