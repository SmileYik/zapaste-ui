import { useCallback, useState } from "react";
import FloatPanel from "../../components/float-panel/float-panel";
import { MdDialog, MdFilledButton, MdFilledTonalButton, MdOutlinedButton, MdOutlinedTextField} from "../../components/Material";
import styles from "./setting.module.css"
import { auth } from "../../api";

export default function Setting() {

    const [basicAuth, setBasicAuth] = useState({username: "", password: ""});
    const [message, setMessage] = useState("");
    const [count, setCount] = useState(0);

    const saveBasicAuth = useCallback(() => {
        const encode = window.btoa(`${basicAuth.username}:${basicAuth.password}`);
        auth.storeAuth({
            type: "basic",
            auth: `Basic ${encode}`
        });
        setMessage("保存成功!");
    }, [basicAuth]);

    const cleanMessage = () => {
        setMessage("");
    }

    return (
        <FloatPanel style={{minHeight: "600px"}}>
            <SubSetting text="Basic 验证器设置" maxHeight="400px">
                <FloatPanel style={{
                    width: "80%",
                    backgroundColor: "var(--md-sys-color-surface-container-high, #f7f2fa)"
                }}>
                    <span>设置 Basic 验证器信息, 所有信息将保存到浏览器本地中.</span>

                    <form 
                        action={saveBasicAuth}
                        method="dialog"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "column",
                            gap: 24,
                            width: "80%",
                            margin: "8px"
                        }}
                    >
                        <MdOutlinedTextField
                            label="用户名"
                            placeholder="请输入用户名"
                            required
                            value={basicAuth.username}
                            onChange={(e: any) => setBasicAuth({...basicAuth, username: e.target.value})}
                        ></MdOutlinedTextField>
                        <MdOutlinedTextField
                            label="密码"
                            placeholder="请输入密码"
                            required
                            type="password"
                            value={basicAuth.password}
                            onChange={(e: any) => setBasicAuth({...basicAuth, password: e.target.value})}
                        ></MdOutlinedTextField>
                        
                        <MdOutlinedButton>保存</MdOutlinedButton>
                    </form>
                </FloatPanel>
            </SubSetting>
            <SubSetting text="验证器信息">
                <FloatPanel style={{
                    width: "80%",
                    backgroundColor: "var(--md-sys-color-surface-container-high, #f7f2fa)"
                }}>
                    <h1 key={`auth-info-${count}`}>当前使用验证器为: {auth.getAuth()?.type || "无验证器"}</h1>
                    <MdOutlinedButton 
                        style={{width: "80%"}} 
                        onClick={() => { auth.storeAuth(null); setCount(c => c + 1); }}
                    >清除验证器信息</MdOutlinedButton>
                </FloatPanel>
            </SubSetting>

            <MdDialog open={message !== ""} onClose={cleanMessage} onCancel={cleanMessage}>
                <div slot="headline">提示</div>
                <div slot="content">{message}</div>
                <div slot="actions">
                    <MdFilledButton onClick={cleanMessage}>确定</MdFilledButton>
                </div>
            </MdDialog>
        </FloatPanel>
    );
};

function SubSetting({
    text,
    children,
    maxHeight,
}: SubSettingProps) {
    const [isOpen, setOpen] = useState(false);

    const Button = isOpen ? MdFilledTonalButton : MdFilledButton;

    return (
        <div style={{width: "100%"}}>
            <Button style={{width: "100%"}} onClick={() => setOpen(t => !t)}>{text}</Button>
            <div className={`${styles["subsetting"]} ${styles["subsetting-" + (isOpen ? "open" : "close")]}`}
                style={{maxHeight: isOpen ? maxHeight : "0px"}}
            >
                {children && children}
            </div>
        </div>
    );
}

interface SubSettingProps {
    text: string;
    children?: React.ReactNode;
    maxHeight?: string
}