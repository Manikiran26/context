import { Outlet } from "react-router-dom";
import TopNav from "../components/TopNav";
import RightSidebar from "../components/RightSidebar";
import { AnimatePresence, motion } from "framer-motion";

export default function ContextLayout() {
    return (
        <div className="flex flex-col h-full w-full">
            {/* Top Navigation Spans the central area */}
            <div className="shrink-0 h-[72px] border-b border-border/50 bg-background/80 backdrop-blur-md px-8">
                <TopNav />
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area (Notes, Graph, Timeline) */}
                <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full w-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Fixed Right Intelligence Sidebar */}
                <div className="w-[320px] shrink-0 border-l border-border/50 bg-surface/30 backdrop-blur-xl hidden lg:block overflow-y-auto custom-scrollbar">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
}
