import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import ContextLayout from "./layout/ContextLayout";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import ContextNotes from "./pages/ContextNotes";
import GraphView from "./pages/GraphView";
import Timeline from "./pages/Timeline";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/search" element={<Search />} />

                    {/* Nested Layout for Context-specific pages */}
                    <Route path="/contexts/:id" element={<ContextLayout />}>
                        <Route index element={<Navigate to="notes" replace />} />
                        <Route path="notes" element={<ContextNotes />} />
                        <Route path="graph" element={<GraphView />} />
                        <Route path="timeline" element={<Timeline />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
