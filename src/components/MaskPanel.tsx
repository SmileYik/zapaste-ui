import type { ReactNode } from "react";

export default function MaskPanel({
    children
}: MaskPanelProps) {
    return (
        <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
            width: "100%",
            height: "100%",
            margin: 0,
        }}>
            {children}
        </div>
    )
}

interface MaskPanelProps {
    children?: ReactNode
}