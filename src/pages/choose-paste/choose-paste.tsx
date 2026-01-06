import { useCallback, useState } from "react";
import styles from "./choose-paste.module.css"
import { MdElevation, MdFilledButton, MdOutlinedTextField } from "../../components/Material";
import { generatePath, useNavigate } from "react-router";

export default function ChoosePaste() {
    const [currentName, setCurrentName] = useState("")
    const navigate = useNavigate();
    const goto = useCallback((name: string) => {
        const url = generatePath("/paste/view/:name", { name: name })
        navigate(url)
    }, []);
    return (
        <div>
            <form className={styles["panel"]} method="dialog">
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
                    <MdFilledButton value="ok" onClick={() => goto(currentName)}>确定</MdFilledButton>
                </div>
            </form>
        </div>
    );
}