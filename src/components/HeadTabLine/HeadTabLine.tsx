import { SecondaryTab } from "@material/web/tabs/internal/secondary-tab";
import { MdDivider, MdElevatedButton, MdElevation, MdFilledButton, MdFilledTonalButton, MdIcon, MdPrimaryTab, MdSecondaryTab, MdTabs, MdTextButton } from "../Material";
import styles from "./HeadTabLine.module.css"
import { useCallback, useEffect, useRef, useState, type MouseEventHandler } from "react";
import { lock } from "../Icons";

export default function HeadTabLine({
    items = ([] as HeadTabItem[]),
    defaultSelect = items[0]?.name || "",
    onChange = undefined
}: HeadTabLineProps) {
    if (items.length == 0) return <></>

    const [selected, setSelected] = useState(defaultSelect);
    const [isSticky, setIsSticky] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [isAnimationTriggered, setAnimationTriggered] = useState(false);

    useEffect(() => {
        setAnimationTriggered(true);
        const timer = setTimeout(() => {
            setAnimationTriggered(false);
        }, 500 + 80 * items.length); 
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
            },
            { threshold: [0] }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const switchItem = useCallback((item: HeadTabItem) => {
        if (selected === item.name || isAnimationTriggered) return;
        setSelected(item.name);
        if (onChange) {
            onChange(item);
        }
    }, [onChange, selected, isAnimationTriggered])

    return (
        <>
            <div ref={sentinelRef} style={{ height: '1px', marginBottom: '-1px' }} />
            <div className={styles["sticky-panel"]}>
                <div className={`${styles["panel"]} ${isSticky ? styles["is-sticky"] : ""}`} style={{position: "relative"}}>
                    <MdElevation/>
                    {items.map((item, index) => (
                        <MenuTab
                            key={item.name}
                            style={{
                                flex: 1,
                                animationDelay: isAnimationTriggered ? `${index * 0.08}s` : '0s'
                            }}
                            active={selected === item.name}
                            onClick={() => switchItem(item)}
                            className={isAnimationTriggered ? styles["animated-button"] : ""}
                        >
                            {item.icon && <MdIcon slot="icon">{item.icon}</MdIcon>}
                            {item.label}
                        </MenuTab>
                    ))}
                </div>
            </div>
        </>
    )
}

interface HeadTabLineProps {
    items?: HeadTabItem[],
    defaultSelect?: string,
    onChange?: (item: HeadTabItem) => {},
};

function MenuTab({
    active = false,
    children,
    style,
    onClick,
    className,
}: MenuTabProps) {
    const ButtonOption = active ? MdFilledTonalButton : MdTextButton;
    return (
        <ButtonOption className={`${styles["panel-button"]} ${className || ""}`} style={style} onClick={onClick}>
            {children}
        </ButtonOption>
    )
}

interface MenuTabProps {
    active?: boolean,
    style?: React.CSSProperties,
    children: React.ReactNode,
    onClick?: MouseEventHandler<any> | undefined,
    className?: string
};

export interface HeadTabItem {
    name: string,
    label: string,
    icon?: React.ReactNode
}