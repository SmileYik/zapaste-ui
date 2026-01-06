export const menus = ([
    {
        name: "index",
        label: "首页",
        path: "/index"
    },
    {
        name: "list",
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
    record(id: string) {
        localStorage.setItem("current-menu-id", id)
    },
    currentId() {
        return localStorage.getItem("current-menu-id") || undefined
    }
}

interface Menu {
    name: string,
    label: string,
    icon?: React.ReactNode,
    node?: React.ReactNode,
    path: string
}