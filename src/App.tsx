import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import HeadTabLine from "./components/HeadTabLine/HeadTabLine";
import { menu, menus } from "./Menu";
import { Outlet, useMatches, useNavigate, type UIMatch } from "react-router";
import styles from "./App.module.css";
import FloatMenu from "./components/float-menu/float-menu";
import { setting } from "./components/Icons";
const queryClient = new QueryClient()

function getAttachMenuItem(current: UIMatch) {
  switch (current.id || "") {
    case "view-paste":
      return {name: current.id, label: current.params?.name || ""}
    case "setting":
      return {name: current.id, label: "设置", icon: setting}
  }
  return undefined;
}

function App() {
  const navigate = useNavigate()
  const maches = useMatches();
  const current = maches[maches.length - 1];

  const floatMenu = [
    {name: "设置", icon: setting, onClick: () => navigate("/setting")}
  ];
  
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HeadTabLine defaultSelect={menu.currentId()} items={menus} onChange={item => navigate(item.path || "#")} attach={getAttachMenuItem(current)}></HeadTabLine>
        <div className={styles["content"]}>
          <Outlet/>
          <FloatMenu menus={floatMenu}></FloatMenu>
        </div>
      </QueryClientProvider>
    </>
  )
}

export default App
