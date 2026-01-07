import { MdElevation, MdFilledButton, MdIcon, MdOutlinedButton } from "../../components/Material";
import styles from "./index.module.css"
import AUTHOR_AVATAR from "../../asserts/author-avatar.png";
import { add, code } from "../../components/Icons";
import { useNavigate } from "react-router";

export default function Index() {

    const navigate = useNavigate();

    return (
        <div className={styles["panel"]}>
            <MdElevation/>

            {/* 头像区域：增加悬停效果 */}
            <div className={styles["author-avatar"]}>
                <img src={AUTHOR_AVATAR} alt="SmileYik Avatar" />
            </div>

            <div className={styles["project-info"]}>
                <h1 className={styles["project-name"]}>Zapaste UI</h1>
                <p className={styles["project-bio"]}>
                    解锁 <a href="https://github.com/SmileYik/zapaste"><strong>Zapaste</strong></a> 的无限可能。一个基于 <strong>Material Design 3</strong> 风格构建的轻量级、响应式剪切板交互界面。
                </p>
            </div>

            <div className={styles["actions"]}>
                <MdFilledButton onClick={() => navigate("/paste/new")}>
                    <MdIcon slot="icon">{add}</MdIcon>
                    立即创建
                </MdFilledButton>
                <MdOutlinedButton onClick={() => window.open('https://github.com/SmileYik/zapaste-ui')}>
                    <MdIcon slot="icon">{code}</MdIcon>
                    查看源代码
                </MdOutlinedButton>
            </div>
        </div>
    );
}