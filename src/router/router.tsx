import { createBrowserRouter, Navigate, Outlet } from "react-router";
import Index from "../pages/index";
import PasteList from "../pages/paste-list/paste-list";
import App from "../App";

export const router = createBrowserRouter([
    {
        id: "root",
        path: "/",
        Component: App,
        
        children: [
            {
                index: true,
                element: <Navigate to="/index" replace />
            },
            {
                id: "index",
                path: "index",
                Component: Index
            },
            {
                path: "paste",
                element: <Outlet/>,
                children: [
                    {
                        id: "list-paste",
                        path: "list",
                        Component: PasteList
                    },
                    {
                        id: "new-paste",
                        path: "new",
                        Component: PasteList
                    },
                    {
                        id: "view-paste",
                        path: "view/:name",
                        Component: PasteList
                    }
                ]
            },
        ]
    }
])