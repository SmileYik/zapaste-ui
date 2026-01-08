import { add_notes, home, list_alt, table_eye } from "./components/Icons";

export const menus = ([
    {
        name: "index",
        label: "首页",
        path: "/index",
        icon: home
    },
    {
        name: "list-paste",
        label: "公开列表",
        path: "/paste/list",
        icon: list_alt
    },
    {
        name: "new-paste",
        label: "新建便条",
        path: "/paste/new",
        icon: add_notes
    },
    {
        name: "choose-paste",
        label: "查看便条",
        path: "/paste/view",
        icon: table_eye
    }
]) as Menu[];

export const menu = {
    record(id?: string | null) {
        if (id) localStorage.setItem("current-menu-id", id)
        else localStorage.removeItem("current-menu-id")
    },
    currentId() {
        return localStorage.getItem("current-menu-id") || undefined
    },
    currentUrl() {
        const id = this.currentId();
        for (const m of menus) {
            if (m.name === id) {
                return m.path;
            }
        }
        return undefined;
    }
}

interface Menu {
    name: string,
    label: string,
    icon?: React.ReactNode,
    node?: React.ReactNode,
    path: string
}