import React from "react";
import { Bell, AlertTriangle, CheckCircle, Info, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  type: "announcement" | "alert" | "sync" | "policy";
  title: string;
  message: string;
  timestamp: string;
  stateOrAgency?: string;
  isRead?: boolean;
  priority?: "high" | "normal" | "urgent";
}

export interface NotificationPanelProps {
  notifications: NotificationItem[];
  onMarkAsRead?: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function NotificationPanel({
  notifications,
  onMarkAsRead,
  onClearAll,
  className,
}: NotificationPanelProps) {
  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case "sync":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "policy":
        return <Info className="w-4 h-4 text-[#112A4A]" />;
      case "announcement":
      default:
        return <Bell className="w-4 h-4 text-[#D35E0E]" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col font-sans text-xs",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <Bell className="w-3.5 h-3.5 text-[#112A4A]" />
          <span className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
            National Land Intelligence Feed
          </span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 bg-[#D35E0E] text-white text-[10px] rounded-full font-bold font-tabular">
              {unreadCount}
            </span>
          )}
        </div>

        {onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => onMarkAsRead?.(n.id)}
            className={cn(
              "p-3 flex items-start gap-2.5 transition-colors cursor-pointer",
              !n.isRead ? "bg-amber-50/30 hover:bg-amber-50/50" : "hover:bg-slate-50"
            )}
          >
            <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>

            <div className="flex-1 space-y-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={cn(
                    "text-xs font-semibold leading-tight",
                    !n.isRead ? "text-[#0A1C30]" : "text-slate-700"
                  )}
                >
                  {n.title}
                </span>
                <span className="text-[10px] text-slate-400 shrink-0 font-tabular font-medium">
                  {n.timestamp}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                {n.message}
              </p>

              {n.stateOrAgency && (
                <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-0.5">
                  <span className="font-semibold text-slate-700">{n.stateOrAgency}</span>
                  {n.priority === "urgent" && (
                    <span className="text-red-700 bg-red-100 px-1 rounded font-bold">
                      URGENT
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
