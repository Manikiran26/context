import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
    apiLogin, apiRegister, apiHeartbeat,
    apiGetContexts, apiCreateContext, apiDeleteContext,
    apiGetNotifications, apiMarkNotificationRead,
    apiApproveRequest, apiRejectRequest, apiGetMembers,
} from "../lib/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [user, setUserState] = useState(() => {
        const saved = sessionStorage.getItem("ctx_user");
        return saved ? JSON.parse(saved) : null;
    });
    const [contexts, setContexts] = useState([]);
    const [contextsLoading, setContextsLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const openCreateModal = () => setCreateModalOpen(true);
    const closeCreateModal = () => setCreateModalOpen(false);

    // ── Auth ─────────────────────────────────────────────────────
    const login = useCallback(async (email, password) => {
        const data = await apiLogin(email, password);
        const userObj = {
            id: data.user?.id,
            email: data.user?.email || email,
            username: (data.user?.email || email).split("@")[0],
        };
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("ctx_user", JSON.stringify(userObj));
        setUserState(userObj);
        return userObj;
    }, []);

    const register = useCallback(async (email, password) => {
        const data = await apiRegister(email, password);
        const userObj = {
            id: data.user?.id,
            email: data.user?.email || email,
            username: (data.user?.email || email).split("@")[0],
        };
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("ctx_user", JSON.stringify(userObj));
        setUserState(userObj);
        return userObj;
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("ctx_user");
        setUserState(null);
        setContexts([]);
        setNotifications([]);
    }, []);

    // Heartbeat: keep session alive
    const heartbeat = useCallback(async () => {
        if (!sessionStorage.getItem("token")) return;
        try {
            const data = await apiHeartbeat();
            if (data.user) {
                const userObj = {
                    id: data.user.id,
                    email: data.user.email,
                    username: data.user.email.split("@")[0],
                };
                // Only update if changed
                if (JSON.stringify(user) !== JSON.stringify(userObj)) {
                    setUserState(userObj);
                    sessionStorage.setItem("ctx_user", JSON.stringify(userObj));
                }
            }
        } catch {
            // token expired – logout
            logout();
        }
    }, [logout, user]);

    // Periodically update last_seen
    useEffect(() => {
        if (!user) return;
        heartbeat(); // Initial
        const timer = setInterval(heartbeat, 60000);
        return () => clearInterval(timer);
    }, [user, heartbeat]);

    // ── Contexts ─────────────────────────────────────────────────
    const fetchContexts = useCallback(async () => {
        if (!sessionStorage.getItem("token")) return;
        setContextsLoading(true);
        try {
            const data = await apiGetContexts();
            setContexts(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("fetchContexts:", e.message);
        } finally {
            setContextsLoading(false);
        }
    }, []);

    const fetchMembers = useCallback(async (contextId) => {
        if (!contextId) return [];
        try {
            return await apiGetMembers(contextId);
        } catch (e) {
            console.error("fetchMembers:", e.message);
            return [];
        }
    }, []);

    // ── Notifications ─────────────────────────────────────────────
    const fetchNotifications = useCallback(async () => {
        if (!sessionStorage.getItem("token")) return;
        try {
            const data = await apiGetNotifications();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("fetchNotifications:", e.message);
        }
    }, []);

    const markAsRead = useCallback(async (notificationId) => {
        try {
            await apiMarkNotificationRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            );
        } catch (e) {
            console.error("markAsRead:", e.message);
        }
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const refreshAll = useCallback(async (contextId) => {
        if (contextId) {
            await fetchMembers(contextId);
        }
        await fetchContexts();
        await fetchNotifications();
    }, [fetchMembers, fetchContexts, fetchNotifications]);

    // Load contexts once authenticated
    useEffect(() => {
        if (user) fetchContexts();
    }, [user?.id]);

    const addContext = useCallback(async (name, icon, tag) => {
        const newCtx = await apiCreateContext(name, icon, tag);
        setContexts(prev => [newCtx, ...prev]);
        return newCtx.id;
    }, []);

    const deleteContext = useCallback(async (id) => {
        await apiDeleteContext(id);
        setContexts(prev => prev.filter(c => c.id !== id));
    }, []);

    // Optimistic local item management (real writes happen per-page via api.js)
    const addItem = useCallback((contextId, item) => {
        setContexts(prev =>
            prev.map(ctx => {
                if (ctx.id !== contextId) return ctx;
                const newItem = { ...item, id: item.id || `tmp-${Date.now()}` };
                return { ...ctx, items: [...(ctx.items || []), newItem] };
            })
        );
    }, []);

    const updateItem = useCallback((contextId, itemId, updates) => {
        setContexts(prev =>
            prev.map(ctx => {
                if (ctx.id !== contextId) return ctx;
                return {
                    ...ctx,
                    items: (ctx.items || []).map(item =>
                        item.id === itemId ? { ...item, ...updates } : item
                    ),
                };
            })
        );
    }, []);

    const removeItem = useCallback((contextId, itemId) => {
        setContexts(prev =>
            prev.map(ctx => {
                if (ctx.id !== contextId) return ctx;
                return { ...ctx, items: (ctx.items || []).filter(item => item.id !== itemId) };
            })
        );
    }, []);

    const toggleTask = useCallback((contextId, itemId) => {
        setContexts(prev =>
            prev.map(ctx => {
                if (ctx.id !== contextId) return ctx;
                return {
                    ...ctx,
                    items: (ctx.items || []).map(item =>
                        item.id === itemId && item.type === "task"
                            ? { ...item, completed: !item.completed }
                            : item
                    ),
                };
            })
        );
    }, []);

    const setDeadline = useCallback((contextId, date) => {
        setContexts(prev =>
            prev.map(ctx => ctx.id === contextId ? { ...ctx, deadline: date } : ctx)
        );
    }, []);


    // ── Member Requests ──────────────────────────────────────────
    const handleRequestAction = useCallback(async (requestId, notificationId, action) => {
        try {
            if (action === "approve") {
                await apiApproveRequest(requestId);
            } else {
                await apiRejectRequest(requestId);
            }
            // Mark related notification read
            if (notificationId) {
                await apiMarkNotificationRead(notificationId);
            }
            // Sequential refresh
            await refreshAll();
        } catch (e) {
            console.error("handleRequestAction:", e.message);
        }
    }, [refreshAll]);

    return (
        <AppContext.Provider value={{
            user, login, register, logout, heartbeat,
            contexts, contextsLoading, fetchContexts,
            addContext, deleteContext,
            addItem, updateItem, removeItem, toggleTask, setDeadline,
            notifications, fetchNotifications, markAsRead, unreadCount, handleRequestAction,
            refreshAll, fetchMembers,
            createModalOpen, openCreateModal, closeCreateModal,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}
