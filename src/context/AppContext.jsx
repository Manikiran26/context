import { createContext, useContext, useState } from "react";
import { MOCK_CONTEXTS } from "../lib/mockData";

const AppContext = createContext(null);

// Seed contexts from mock data, adding an items[] array to each
const seedContexts = () =>
    MOCK_CONTEXTS.map((ctx) => ({
        ...ctx,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        items: [
            ...ctx.notes.map((n) => ({ id: n.id, type: "text", content: n.content, title: n.title })),
            ...ctx.tasks.map((t) => ({ id: t.id, type: "task", content: t.title, completed: t.status === "completed" })),
            ...ctx.files.map((f) => ({ id: f.id, type: "file", name: f.title, size: null })),
        ],
    }));

export function AppProvider({ children }) {
    const [user, setUserState] = useState(() => {
        const saved = localStorage.getItem("ctx_user");
        return saved ? JSON.parse(saved) : { email: "", username: "" };
    });
    const [contexts, setContexts] = useState(seedContexts);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const openCreateModal = () => setCreateModalOpen(true);
    const closeCreateModal = () => setCreateModalOpen(false);

    // Store user in localStorage so it survives dev HMR
    const setUser = (email) => {
        const username = email.split("@")[0];
        const userObj = { email, username };
        setUserState(userObj);
        localStorage.setItem("ctx_user", JSON.stringify(userObj));
    };

    const addContext = (name) => {
        const id = Date.now();
        const newCtx = {
            id,
            name,
            tag: "Active",
            icon: "Zap",
            score: 0,
            status: "New",
            statusDesc: "Just created",
            metrics: { completeness: 0, connections: 0, freshness: 100 },
            time: "Just now",
            members: [],
            tags: [],
            activity: [],
            notes: [],
            tasks: [],
            files: [],
            deadlines: [],
            createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            items: [],
        };
        setContexts((prev) => [newCtx, ...prev]);
        return id;
    };

    const deleteContext = (id) => {
        setContexts((prev) => prev.filter((c) => c.id !== id));
    };

    const setDeadline = (contextId, date) => {
        setContexts((prev) =>
            prev.map((ctx) =>
                ctx.id === contextId ? { ...ctx, deadline: date } : ctx
            )
        );
    };

    const addItem = (contextId, item) => {
        setContexts((prev) =>
            prev.map((ctx) => {
                if (ctx.id !== contextId) return ctx;
                const newItem = { ...item, id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
                return { ...ctx, items: [...ctx.items, newItem] };
            })
        );
    };

    const updateItem = (contextId, itemId, updates) => {
        setContexts((prev) =>
            prev.map((ctx) => {
                if (ctx.id !== contextId) return ctx;
                return {
                    ...ctx,
                    items: ctx.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
                };
            })
        );
    };

    const removeItem = (contextId, itemId) => {
        setContexts((prev) =>
            prev.map((ctx) => {
                if (ctx.id !== contextId) return ctx;
                return { ...ctx, items: ctx.items.filter((item) => item.id !== itemId) };
            })
        );
    };

    const toggleTask = (contextId, itemId) => {
        setContexts((prev) =>
            prev.map((ctx) => {
                if (ctx.id !== contextId) return ctx;
                return {
                    ...ctx,
                    items: ctx.items.map((item) =>
                        item.id === itemId && item.type === "task"
                            ? { ...item, completed: !item.completed }
                            : item
                    ),
                };
            })
        );
    };

    return (
        <AppContext.Provider value={{ user, setUser, contexts, addContext, deleteContext, setDeadline, addItem, updateItem, removeItem, toggleTask, createModalOpen, openCreateModal, closeCreateModal }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}
