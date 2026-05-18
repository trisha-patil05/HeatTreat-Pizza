import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast-item toast-${toast.type}`}
                        onClick={() => removeToast(toast.id)}
                    >
                        <span className="toast-icon">
                            {toast.type === "success" && "✅"}
                            {toast.type === "error" && "❌"}
                            {toast.type === "info" && "ℹ️"}
                            {toast.type === "warning" && "⚠️"}
                        </span>
                        <span className="toast-msg">{toast.message}</span>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>✕</button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};