import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  onHomeClick?: () => void;
  className?: string;
}

export function Breadcrumbs({
  items,
  showHome = true,
  onHomeClick,
  className,
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={cn(
        "flex items-center text-xs text-slate-500 overflow-x-auto py-1 font-sans",
        className
      )}
    >
      <ol className="inline-flex items-center space-x-1.5 whitespace-nowrap">
        {showHome && (
          <li className="inline-flex items-center">
            <button
              type="button"
              onClick={onHomeClick}
              className="inline-flex items-center text-slate-500 hover:text-[#112A4A] cursor-pointer transition-colors"
              title="National Overview"
            >
              <Home className="w-3.5 h-3.5 mr-1" />
              <span>National</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1 shrink-0" />
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="inline-flex items-center">
              {isLast || item.active ? (
                <span
                  className="font-bold text-[#0A1C30] cursor-default"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-[#112A4A] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              )}

              {!isLast && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1 shrink-0" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
