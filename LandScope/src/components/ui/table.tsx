import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Table({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto border border-[#3b82f6]/15 rounded-md bg-[#060e1a]/70 backdrop-blur-md">
      <table
        className={cn(
          "w-full caption-bottom text-xs text-left text-[#94a3b8] border-collapse font-sans",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "bg-[#030712]/90 border-b border-[#3b82f6]/15 text-[#94a3b8] font-semibold text-[10px] uppercase tracking-wider font-mono",
        className
      )}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("divide-y divide-[#3b82f6]/10 bg-transparent", className)}
      {...props}
    />
  );
}

export function TableRow({
  className,
  isHeader,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { isHeader?: boolean }) {
  return (
    <tr
      className={cn(
        "transition-colors",
        !isHeader && "hover:bg-[#0b1c38]/30 data-[state=selected]:bg-[#0b1c38]/50",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  sortable,
  onSort,
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & {
  sortable?: boolean;
  onSort?: () => void;
}) {
  return (
    <th
      className={cn(
        "h-9 px-3.5 text-left align-middle font-bold text-white select-none whitespace-nowrap",
        sortable && "cursor-pointer hover:bg-white/5 hover:text-[#3b82f6]",
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        <span>{children}</span>
        {sortable && <ArrowUpDown className="w-3 h-3 text-[#3b82f6]/60" />}
      </div>
    </th>
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "p-3.5 align-middle font-normal whitespace-nowrap text-[#f8fafc]",
        className
      )}
      {...props}
    />
  );
}

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2.5 bg-[#030712]/80 border-t border-[#3b82f6]/15 text-xs text-[#94a3b8] font-mono",
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-[11px]">
        <span>Showing</span>
        <span className="font-semibold text-white font-tabular">{startItem}</span>
        <span>to</span>
        <span className="font-semibold text-white font-tabular">{endItem}</span>
        <span>of</span>
        <span className="font-semibold text-[#3b82f6] font-tabular">{totalItems}</span>
        <span>records</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="p-1 rounded border border-[#3b82f6]/20 bg-[#060e1a] text-[#94a3b8] hover:text-white hover:border-[#3b82f6]/50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          title="First Page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1 rounded border border-[#3b82f6]/20 bg-[#060e1a] text-[#94a3b8] hover:text-white hover:border-[#3b82f6]/50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <span className="px-2.5 py-0.5 text-xs font-semibold text-white bg-[#060e1a] border border-[#3b82f6]/30 rounded">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1 rounded border border-[#3b82f6]/20 bg-[#060e1a] text-[#94a3b8] hover:text-white hover:border-[#3b82f6]/50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="p-1 rounded border border-[#3b82f6]/20 bg-[#060e1a] text-[#94a3b8] hover:text-white hover:border-[#3b82f6]/50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          title="Last Page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
