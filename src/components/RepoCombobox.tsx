import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, ChevronsUpDown, Loader2, Lock, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { RepoInfo } from "@/lib/github.functions";

export type RepoComboboxProps = {
  id?: string;
  repos: RepoInfo[];
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  placeholder?: string;
  emptyText?: string;
};

function split(fullName: string): { owner: string; name: string } {
  const i = fullName.lastIndexOf("/");
  if (i === -1) return { owner: "", name: fullName };
  return { owner: fullName.slice(0, i), name: fullName.slice(i + 1) };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
}

function RepoList({
  repos,
  value,
  emptyText,
  onPick,
  listClassName,
}: {
  repos: RepoInfo[];
  value: string;
  emptyText: string;
  onPick: (v: string) => void;
  listClassName?: string;
}) {
  return (
    <Command
      className="h-full"
      filter={(itemValue, search) =>
        itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
      }
    >
      <div className="shrink-0 border-b bg-popover">
        {/* text-base (16px) prevents iOS auto-zoom on focus, which made the screen jump */}
        <CommandInput
          placeholder="ابحث باسم المستودع أو الحساب…"
          dir="ltr"
          className="h-12 text-base sm:text-sm"
        />
      </div>
      <CommandList
        className={cn("max-h-none overscroll-contain [overflow-anchor:none]", listClassName)}
      >
        <CommandEmpty>{emptyText}</CommandEmpty>
        <div className="divide-y divide-border">
          {repos.map((repo, index) => {
            const { owner, name } = split(repo.fullName);
            const isSelected = value === repo.fullName;
            const date = formatDate(repo.createdAt);
            return (
              <CommandItem
                key={repo.fullName}
                value={`${repo.fullName} ${repo.description ?? ""}`}
                onSelect={() => onPick(repo.fullName)}
                className={cn(
                  "items-start gap-3 rounded-none px-4 py-3.5",
                  "even:bg-muted/40",
                  "data-[selected=true]:bg-accent",
                  isSelected &&
                    "bg-primary/10 even:bg-primary/10 shadow-[inset_-4px_0_0_0_var(--color-primary)]",
                )}
              >
                <span
                  className={cn(
                    "mono mt-0.5 flex h-6 min-w-6 shrink-0 items-center justify-center rounded-md border px-1 text-[11px] text-muted-foreground",
                    isSelected && "border-primary bg-primary text-primary-foreground",
                  )}
                >
                  {isSelected ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span className="grid min-w-0 flex-1 gap-1">
                  {/* Full name, wrapped — never cut, so similar names stay distinguishable */}
                  <span
                    className="break-all text-[15px] font-semibold leading-snug sm:text-sm"
                    dir="ltr"
                  >
                    {name}
                  </span>
                  {repo.description && (
                    <span className="line-clamp-1 text-xs text-muted-foreground" dir="auto">
                      {repo.description}
                    </span>
                  )}
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                    <span className="mono break-all" dir="ltr">
                      {owner}
                    </span>
                    {date && <span>· {date}</span>}
                    {repo.isPrivate && (
                      <span className="inline-flex items-center gap-1 rounded-full border px-1.5 py-px">
                        <Lock className="h-3 w-3" />
                        خاص
                      </span>
                    )}
                  </span>
                </span>
              </CommandItem>
            );
          })}
        </div>
      </CommandList>
    </Command>
  );
}

export function RepoCombobox({
  id,
  repos,
  value,
  onChange,
  loading = false,
  disabled = false,
  error = null,
  onRefresh,
  placeholder = "اختر مستودعًا…",
  emptyText = "لا توجد مستودعات مطابقة.",
}: RepoComboboxProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const selected = value ? split(value) : null;

  const pick = (v: string) => {
    onChange(v === value ? "" : v);
    setOpen(false);
  };

  const trigger = (
    <Button
      id={id}
      type="button"
      variant="outline"
      role="combobox"
      aria-expanded={open}
      disabled={disabled || loading}
      onClick={isMobile ? () => setOpen(true) : undefined}
      className="h-auto min-h-14 min-w-0 w-full justify-between gap-3 rounded-xl px-4 py-2.5"
    >
      <span className="grid min-w-0 gap-0.5 text-start">
        <span
          className={cn(
            "break-all text-sm font-semibold leading-snug whitespace-normal",
            !selected && "font-normal text-muted-foreground",
          )}
          dir={selected ? "ltr" : "auto"}
        >
          {selected ? selected.name : placeholder}
        </span>
        {selected && (
          <span className="mono truncate text-xs text-muted-foreground" dir="ltr">
            {selected.owner}
          </span>
        )}
      </span>
      {loading ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin opacity-60" />
      ) : (
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-60" />
      )}
    </Button>
  );

  return (
    <div className="min-w-0 flex flex-col gap-2">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-stretch gap-2">
        {isMobile ? (
          <>
            {trigger}
            <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
              <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background" />
                <DialogPrimitive.Content
                  // Fixed full-screen sheet: nothing repositions when the keyboard opens.
                  // Don't auto-focus search so the keyboard doesn't pop up on open.
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  className="fixed inset-0 z-50 flex h-[100dvh] flex-col bg-popover text-popover-foreground outline-none"
                >
                  <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
                    <DialogPrimitive.Title className="text-base font-semibold">
                      اختر المستودع
                      <span className="ms-2 text-xs font-normal text-muted-foreground">
                        ({repos.length})
                      </span>
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Close asChild>
                      <Button type="button" variant="ghost" size="icon" aria-label="إغلاق">
                        <X className="h-5 w-5" />
                      </Button>
                    </DialogPrimitive.Close>
                  </div>
                  <DialogPrimitive.Description className="sr-only">
                    قائمة المستودعات المتاحة للاختيار
                  </DialogPrimitive.Description>
                  <div className="min-h-0 flex-1">
                    <RepoList
                      repos={repos}
                      value={value}
                      emptyText={emptyText}
                      onPick={pick}
                      listClassName="flex-1 pb-[env(safe-area-inset-bottom)]"
                    />
                  </div>
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
          </>
        ) : (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] min-w-80 overflow-hidden p-0"
              align="start"
              sideOffset={8}
              avoidCollisions={false}
            >
              <RepoList
                repos={repos}
                value={value}
                emptyText={emptyText}
                onPick={pick}
                listClassName="max-h-[420px]"
              />
            </PopoverContent>
          </Popover>
        )}

        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={disabled || loading}
            aria-label="تحديث قائمة المستودعات"
            className="h-auto min-h-14 shrink-0 rounded-xl"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        )}
      </div>

      {error && (
        <p className="text-xs text-destructive" dir="auto">
          {error}
        </p>
      )}
      {!error && !loading && !disabled && repos.length === 0 && (
        <p className="text-xs text-muted-foreground">لا توجد مستودعات في هذا الحساب.</p>
      )}
    </div>
  );
}
