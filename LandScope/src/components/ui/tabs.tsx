import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

interface TabsContextType {
  value: string;
  onValueChange: (val: string) => void;
  variant?: "underline" | "pills" | "enclosed";
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps {
  value: string;
  onValueChange: (val: string) => void;
  variant?: "underline" | "pills" | "enclosed";
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  value,
  onValueChange,
  variant = "underline",
  children,
  className,
}: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange, variant }}>
      <div className={cn("w-full flex flex-col", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  const variant = ctx?.variant || "underline";

  const variantStyles = {
    underline: "flex items-center gap-2 border-b border-slate-200 overflow-x-auto",
    pills: "inline-flex items-center gap-1 p-1 bg-slate-100 rounded-sm border border-slate-200",
    enclosed: "flex items-center border-b border-slate-200 overflow-x-auto",
  };

  return <div className={cn(variantStyles[variant], className)}>{children}</div>;
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  badge?: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  badge,
  icon,
  disabled,
  className,
}: TabsTriggerProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs");

  const isSelected = ctx.value === value;
  const variant = ctx.variant || "underline";

  const getVariantStyles = () => {
    switch (variant) {
      case "pills":
        return cn(
          "px-3 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer select-none",
          isSelected
            ? "bg-[#112A4A] text-white shadow-2xs"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
        );
      case "enclosed":
        return cn(
          "px-4 py-2 text-xs font-semibold border-t-2 border-x transition-all -mb-[1px] cursor-pointer select-none rounded-t-sm",
          isSelected
            ? "bg-white border-t-[#D35E0E] border-x-slate-200 border-b-transparent text-[#0A1C30]"
            : "bg-slate-50 border-t-transparent border-x-transparent text-slate-500 hover:text-slate-800"
        );
      case "underline":
      default:
        return cn(
          "px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer select-none whitespace-nowrap",
          isSelected
            ? "border-[#112A4A] text-[#112A4A]"
            : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
        );
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        "inline-flex items-center gap-1.5 focus:outline-none disabled:opacity-40 disabled:pointer-events-none",
        getVariantStyles(),
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "px-1.5 py-0.2 rounded-full text-[10px] font-bold font-tabular",
            isSelected
              ? variant === "pills"
                ? "bg-white/20 text-white"
                : "bg-[#E5EEF8] text-[#112A4A]"
              : "bg-slate-200 text-slate-600"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used within Tabs");

  if (ctx.value !== value) return null;

  return <div className={cn("pt-4 focus:outline-none", className)}>{children}</div>;
}
