import { useToast } from "@/lib/use-toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts } = useToast();

  return (
    <>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
        {toasts.map(function ({ id, title, description, variant = "default" }) {
          return (
            <div
              key={id}
              className={`relative mb-4 rounded-md border px-4 py-3 shadow-md transition-all ${
                variant === "destructive"
                  ? "border-destructive bg-destructive text-destructive-foreground"
                  : "border-border bg-card"
              }`}
            >
              {title && <div className="font-semibold">{title}</div>}
              {description && <div className="text-sm">{description}</div>}
            </div>
          );
        })}
      </div>
    </>
  );
}
