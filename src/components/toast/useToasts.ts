import { useCallback, useState } from "react";

export type ToastKind = "error" | "warning" | "info";

export interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  message: string;
}


let _nextId = 0;



export function useToasts() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const push = useCallback((
        kind: ToastKind,
        title: string,
        message: string,
    ): string => {
        const id = String(++_nextId);
        setToasts((prev) => [...prev, { id, kind, title, message }]);
        return id;
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return { toasts, push, dismiss };
}