import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AppLayout from "./layout/AppLayout";
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

// Guard: redirect to /login if no token
function ProtectedRoute({ children }) {
    const token = sessionStorage.getItem("token");
    if (!token) return <Navigate to="/login" replace />;
    return children;
}

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/contexts" element={<AllContextsPage />} />
                    <Route path="/context/:id" element={<ContextPage />} />

                    {/* Legacy context routes */}
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
