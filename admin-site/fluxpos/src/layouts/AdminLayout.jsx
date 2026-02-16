import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex w-screen h-screen bg-[#020617] overflow-hidden">
      <Sidebar />

      <main className="flex-1 h-full overflow-hidden relative bg-[#020617]">
        <Outlet />
      </main>
    </div>
  );
}
