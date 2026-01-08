import { MdElevation } from "../Material";
import styles from "./float-panel.module.css"

export default function FloatPanel({
    className = "",
    children,
    disableFloat = false,
    style,
}: FloatPanelProps) {

    return (
        <div className={`${className} ${styles.panel}`} style={style}>
            {!disableFloat && <MdElevation/>}

            {children && children}
        </div>
    );
}

interface FloatPanelProps {
    className?: string;
    children?: React.ReactNode;
    disableFloat?: boolean;
    style?: React.CSSProperties
}