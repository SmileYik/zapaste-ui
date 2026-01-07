import { MdDialog, MdFilledButton, MdFilledTonalButton, MdOutlinedTextField } from "../../components/Material";
import styles from "./paste-detail.module.css"
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLockedPaste } from "../../api";
import PatseModelDetail, { PatseModelDetailSkeleton } from "../../components/paste-model-detail/paste-model-detail";
import { useMatches, useNavigate } from "react-router";

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

    const {isPending, error, data, isError} = useQuery({
        queryKey: ["data", name, password],
        queryFn: () => getLockedPaste(name, password),
        retry: false,
        enabled: !isEmptyName
    });
    useEffect(() => {
        setErrorTimes(t => t + 1);
    }, [isError])

    const enterPassword = useCallback((_: FormData) => {
        setPassword(old => {
            if (old === passwordField) {
                setErrorTimes(t => t + 1);
                return old;
            }
            return passwordField;
        });
    }, [passwordField]);

    return (
        <div className={styles["detail-container"]}>
            {data && (
                <PatseModelDetail pasteModel={data}></PatseModelDetail>
            )}

            {(isPending || isError) && (
                <PatseModelDetailSkeleton></PatseModelDetailSkeleton>
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

// function PasteNameInput({
//     name = "",
//     onChange,
// }: PasteNameInputProps) {
//     const [currentName, setCurrentName] = useState(name)
//     return (
//         <div>
//             <form className={styles["request-paste-name"]} method="dialog">
//                 <MdElevation/>

//                 <MdOutlinedTextField
//                     label="剪切板名"
//                     placeholder="请输入剪切板名"
//                     required
//                     defaultValue={currentName}
//                     onChange={(target: any) => setCurrentName(target.target.value)}
//                     style={{
//                         width: "100%"
//                     }}
//                 ></MdOutlinedTextField>

//                 <div className={styles["request-paste-name-actions"]}>
//                     <MdFilledButton value="ok" onClick={() => onChange(currentName)}>确定</MdFilledButton>
//                 </div>
//             </form>
//         </div>
//     );
// }

// interface PasteNameInputProps {
//     name?: string,
//     onChange: (name: string) => void
// }