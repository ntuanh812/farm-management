import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const AppLayout = () => {
    return (
        <div className="app">
            <aside className="app__sidebar">
                <Sidebar />
            </aside>
            <div className="app__main">
                <header className="app__header">
                    <Topbar />
                </header>
                <main className="app__content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}