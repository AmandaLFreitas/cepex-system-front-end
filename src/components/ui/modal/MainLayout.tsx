import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" />
      <main className="flex-1 p-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
}
