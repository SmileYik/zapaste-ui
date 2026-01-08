import { useEffect, useRef, useState } from "react"
import { chevron_line_up, setting, menu as menu_icon, stat_minus_2, stat_2 } from "../Icons"
import { MdFab, MdIcon } from "../Material"
import styles from "./float-menu.module.css"

export default function FloatMenu({
    menus = [
        {name: "setting", icon: setting},
        {name: "setting", icon: setting},
        {name: "setting", icon: setting},
        {name: "setting", icon: setting},
    ]
}: FloatMenuProps) {

    const [isOpen, setOpen] = useState(false);

    const [enableLift, setEnableLift] = useState(false);
    const [isScrollDown, setScrollDown] = useState(true);

    const scrolling = useRef(false);
    const lastScrollY = useRef(0);
    
    useEffect(() => {
        const handleScroll = () => {
            if (scrolling.current) return;

            const currentScrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const totalHeight = document.documentElement.scrollHeight;

            setEnableLift(totalHeight > windowHeight * 2);
            setScrollDown(currentScrollY > lastScrollY.current);
            
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollDownOrTop = (isTop: boolean) => {
        scrolling.current = true;
        setEnableLift(false);
        lastScrollY.current = isTop ? 1 : document.documentElement.scrollHeight - 1;
    
        const targetY = isTop ? 0 : document.documentElement.scrollHeight - window.innerHeight;
        const startY = window.scrollY;
        const distance = targetY - startY;
        const duration = 500;
        let startTime: number | null = null;
    
        const step = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;
            const percent = Math.min(progress / duration, 1);
            const ease = percent < 0.5 ? (2 * percent * percent) : (-1 + (4 - 2 * percent) * percent);
    
            window.scrollTo(0, startY + distance * ease);
    
            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else {
                scrolling.current = false;
            }
        };
        
        window.requestAnimationFrame(step);
    };

    return (
        <div className={styles["content-menu"]}>
            <div>
                <MdFab
                    onClick={() => setOpen(i => !i)}
                    variant={isOpen ? "secondary" : "primary"}
                    title={isOpen ? "关闭" : "设置"}
                >
                    <MdIcon slot="icon">{isOpen ? chevron_line_up : menu_icon}</MdIcon>
                </MdFab>
            </div>
            <div style={{
                    position: "relative"
                }}
            >
                <MdFab
                    className={`${styles["content-menu-item"]}  
                                ${styles["content-menu-item-" + ((!isOpen && enableLift) ? "open" : "close")]}`}
                    size="small"
                        title={isScrollDown ? "去底下" : "去顶上" }
                    onClick={() => scrollDownOrTop(!isScrollDown)}
                    style={{
                        transform: isOpen ? 'translateY(0)' : `translateY(-8px)`,
                        transitionDelay: isOpen ? `40ms` : '0ms'
                    }}
                >
                    <MdIcon slot="icon">{isScrollDown ? stat_minus_2 : stat_2}</MdIcon>
                </MdFab>

                {menus.map((menu, idx) => (
                    <MdFab 
                        className={`${styles["content-menu-item"]} ${styles["content-menu-item-" + (isOpen ? "open" : "close")]}`}
                        size="small"
                        title={menu.name}
                        onClick={() => menu.onClick && setOpen(menu.onClick() === true)}
                        style={{
                            transform: isOpen ? `translateY(-${(idx) * 52 + 8}px)` : 'translateY(0)',
                            transitionDelay: isOpen ? `${idx * 40}ms` : '0ms'
                        }}
                    >
                        <MdIcon slot="icon">{menu.icon}</MdIcon>
                    </MdFab>
                ))}
            </div>
        </div>
    )
}

interface FloatMenuProps {
    menus?: FloatMenuItem[]
}

interface FloatMenuItem {
    name: string,
    icon: React.ReactNode,
    onClick?: () => any | void
}