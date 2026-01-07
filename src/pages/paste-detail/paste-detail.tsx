import { MdDialog, MdFilledButton, MdFilledTonalButton, MdOutlinedTextField } from "../../components/Material";
import styles from "./paste-detail.module.css"
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLockedPaste } from "../../api";
import PatseModelDetail, { PatseModelDetailSkeleton } from "../../components/paste-model-detail/paste-model-detail";
import { useMatches, useNavigate } from "react-router";
import type PasteModel from "../../entity/paste_model";
import PasteEditor from "../../components/paste-editor/paste-editor";

export default function PatseDetail({

}: PatseDetailProps) {
    const matches = useMatches();
    const route = matches[matches.length - 1];
    const navigate = useNavigate();

    const gotoChoosePastePage = useCallback(() => {
        navigate(route.pathname + "/..")
    }, [])

    const name = route.params?.name || "";
    const [password, setPassword] = useState("");
    const [passwordField, setPasswordField] = useState("");
    const [errorTimes, setErrorTimes] = useState(0);

    const isEmptyName = useMemo(() => {
        return (name || "").trim().length === 0;
    }, []);

    if (isEmptyName) {
        gotoChoosePastePage();
        return (<></>)
    }

    let {isPending, error, data, isError} = useQuery({
        queryKey: ["data", name, password],
        queryFn: () => getLockedPaste(name, password),
        retry: false,
        enabled: !isEmptyName
    });

    const enterPassword = useCallback((_: FormData) => {
        setPassword(old => {
            if (old === passwordField) {
                setErrorTimes(t => t + 1);
                return old;
            }
            return passwordField;
        });
    }, [passwordField]);

    const [editMode, setEditMode] = useState(false);
    const [editEntity, setEditEntity] = useState<PasteModel | undefined>();
    const [overwriteData, setOverwriteData] = useState<PasteModel | undefined>(undefined);

    useEffect(() => {
        setErrorTimes(t => t + 1);
        setOverwriteData(undefined);
    }, [isError])

    useEffect(() => {
        setOverwriteData(undefined);
    }, [data])

    const onEdit = () => {
        const p = data;
        if (p) {
            if (p.paste) {
                p.paste.password = password;
            }
            setEditEntity(p);
            setEditMode(true);
        }
    }

    const afterEdit = (entity: PasteModel) => {
        setEditMode(false);
        setEditEntity(undefined);
        setOverwriteData(entity);
        setPassword(entity.paste?.password || "");
    }

    return (
        <div className={styles["detail-container"]}>
            {!editMode && (data || overwriteData) && (
                <PatseModelDetail pasteModel={overwriteData || data} onEdit={onEdit}></PatseModelDetail>
            )}

            {(isPending || isError) && (
                <PatseModelDetailSkeleton></PatseModelDetailSkeleton>
            )}

            {editMode && (
                <PasteEditor pasteModle={editEntity} onChange={afterEdit}></PasteEditor>
            )}
            
            <MdDialog key={errorTimes} open={!isPending && isError} type="alert">
                <div slot="headline">请尝试输入密码</div>
                <form slot="content" className={styles["password-dialog-content"]} method="dialog" action={enterPassword}>
                    <MdOutlinedTextField
                        name="password"
                        label="密码"
                        placeholder="请输入密码"
                        required
                        defaultValue={passwordField}
                        onChange={(target: any) => setPasswordField(target.target.value)}
                        style={{ width: "100%" }}
                    ></MdOutlinedTextField>
                    {errorTimes > 2 && (
                        <span className={styles["password-dialog-error"]}>{error?.message}</span>)
                    }

                    <div slot="actions" className={styles["password-dialog-actions"]}>
                        <MdFilledButton value="ok">确定</MdFilledButton>
                        <MdFilledTonalButton value="cancel" onClick={gotoChoosePastePage}>返回</MdFilledTonalButton>
                    </div>
                </form>
            </MdDialog>
        </div>
    )
}

interface PatseDetailProps {
    
}