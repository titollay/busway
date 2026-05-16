import React from "react";
import { ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";

export function Breadcrumb({ crumbs }) {
  const current = crumbs[crumbs.length - 1]?.label || "Overview";

  return (
    <nav className="mb-6 flex flex-col gap-4 border-b border-gray-200/70 pb-5 dark:border-white/5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
          <LayoutDashboard size={18} />
        </span>
        <span className="text-base font-black text-gray-900 dark:text-white">{current}</span>
      </div>

      <div className="flex lg:justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-[0.58rem] font-black uppercase tracking-widest text-gray-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/50">
          {crumbs.map((crumb, index) => (
            <React.Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && <span className="text-gray-300 dark:text-white/20">›</span>}
              {crumb.href ? (
                <a href={crumb.href} className="text-gray-500 dark:text-white/45">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-blue-600 dark:text-blue-400">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="hidden lg:block" />
    </nav>
  );
}

export function MetricCard({ label, value, helper, icon: Icon, color = "blue" }) {
  return (
    <div className="busway-glow-card min-h-[150px]">
      <div className="busway-card-bg" />
      <div className={`busway-card-blob blob-${color}`} />
      <div className="relative z-[3] flex h-full min-h-[150px] flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[0.62rem] uppercase tracking-widest text-gray-500 dark:text-white/45">
            {label}
          </p>
          {Icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/60">
              <Icon size={16} />
            </span>
          )}
        </div>
        <div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{value}</p>
          {helper && <p className="mt-1 text-xs text-gray-400 dark:text-white/30">{helper}</p>}
        </div>
      </div>
    </div>
  );
}

export function ActionButton({ label, onClick, icon: Icon, tone = "neutral" }) {
  const toneClass =
    tone === "danger"
      ? "text-red-500 dark:text-red-400"
      : "text-gray-600 dark:text-white/60";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 ${toneClass} dark:border-white/10 dark:bg-white/5`}
    >
      <Icon size={13} />
    </button>
  );
}

export function Pagination({ page, totalPages, totalItems, startItem, endItem, onPageChange, itemLabel }) {
  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/50 px-4 py-4 dark:border-white/5 dark:bg-black/10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-[0.65rem] uppercase tracking-widest text-gray-400 dark:text-white/30">
        {totalItems === 0
          ? `0 ${itemLabel}`
          : `${startItem}-${endItem} sur ${totalItems} ${itemLabel}`}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
          aria-label="Page precedente"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="min-w-16 text-center text-xs font-bold text-gray-500 dark:text-white/45">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
          aria-label="Page suivante"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

export function getPagination(items, page, pageSize) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return {
    safePage,
    totalPages,
    totalItems,
    startItem: totalItems === 0 ? 0 : startIndex + 1,
    endItem: endIndex,
    rows: items.slice(startIndex, endIndex),
  };
}
