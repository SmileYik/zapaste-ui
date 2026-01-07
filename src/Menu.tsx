export const menus = ([
    {
        name: "index",
        label: "首页",
        path: "/index"
    },
    {
        name: "list-paste",
        label: "公开列表",
        path: "/paste/list"
    },
    {
        name: "new-paste",
        label: "新剪切板",
        path: "/paste/new"
    },
    {
        name: "choose-paste",
        label: "查看剪切板",
        path: "/paste/view"
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