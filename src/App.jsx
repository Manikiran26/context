import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MainLayout from "./layout/MainLayout";
import ContextLayout from "./layout/ContextLayout";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import ContextNotes from "./pages/ContextNotes";
import GraphView from "./pages/GraphView";
import Timeline from "./pages/Timeline";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import AllContextsPage from "./pages/AllContextsPage";
import ContextPage from "./pages/ContextPage";

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/search" element={<Search />} />

                    {/* New: All Contexts list */}
                    <Route path="/contexts" element={<AllContextsPage />} />

                    {/* New: Individual context page with items */}
                    <Route path="/context/:id" element={<ContextPage />} />

                    {/* Legacy: Context-specific pages (Notes/Graph/Timeline) */}
                    <Route path="/contexts/:id" element={<ContextLayout />}>
                        <Route index element={<Navigate to="notes" replace />} />
                        <Route path="notes" element={<ContextNotes />} />
                        <Route path="graph" element={<GraphView />} />
                        <Route path="timeline" element={<Timeline />} />
                    </Route>
                </Route>
            </Routes>
        </AnimatePresence>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AnimatedRoutes />
        </BrowserRouter>
    );
}
