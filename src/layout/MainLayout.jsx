import { Outlet } from "react-router-dom";
import LeftSidebar from "../components/LeftSidebar";

export default function MainLayout() {
    return (
        <div className="flex h-screen w-screen bg-background text-slate-200 overflow-hidden relative font-sans">
            {/* Subtle extremely slow radial gradient background animation */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background animate-gradient-radial" />

            {/* Left Sidebar Fixed Container */}
            <div className="z-20 h-full">
                <LeftSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 h-full z-10 relative overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
}

