import { createHashRouter, Navigate, Outlet } from "react-router";
import Index from "../pages/index";
import PasteList from "../pages/paste-list/paste-list";
import App from "../App";
import ChoosePaste from "../pages/choose-paste/choose-paste";
import PatseDetail from "../pages/paste-detail/paste-detail";
import NewPaste from "../pages/new-paste/new-paste";

export const router = createHashRouter([
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
                        Component: NewPaste
                    },
                    {
                        id: "choose-paste",
                        path: "view",
                        Component: ChoosePaste,
                    },
                    {
                        id: "view-paste",
                        path: "view/:name",
                        Component: PatseDetail,
                    }
                ]
            },
        ]
    }
], {
    
})