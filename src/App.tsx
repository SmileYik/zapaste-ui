import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import HeadTabLine from "./components/HeadTabLine/HeadTabLine";
import { menu, menus } from "./Menu";
import { Outlet, useMatches, useNavigate, type UIMatch } from "react-router";
import "./App.css";

const queryClient = new QueryClient()

function getAttachMenuItem(current: UIMatch) {
  switch (current.id || "") {
    case "view-paste":
      return {name: current.id, label: current.params?.name || ""}
  }
  return undefined;
}

function App() {
  const navigate = useNavigate()
  console.log(useMatches());
  const maches = useMatches();
  const current = maches[maches.length - 1];
  
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HeadTabLine defaultSelect={menu.currentId()} items={menus} onChange={item => navigate(item.path || "#")} attach={getAttachMenuItem(current)}></HeadTabLine>
        <div className="content">
          <Outlet/>
        </div>
      </QueryClientProvider>
    </>
  )
}

export default App
