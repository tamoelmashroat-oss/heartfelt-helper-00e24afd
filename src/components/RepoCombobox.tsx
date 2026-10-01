import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Loader2, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  const selected = value ? split(value) : null;

  return (
    <div className="min-w-0 flex flex-col gap-2">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-stretch gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled || loading}
              className="h-auto min-h-14 min-w-0 w-full justify-between gap-3 rounded-xl px-4 py-2.5"
            >
              <span className="grid min-w-0 gap-0.5 text-start">
                <span
                  className={cn(
                    "truncate text-sm font-medium",
                    !selected && "font-normal text-muted-foreground",
                  )}
                  dir="ltr"
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
          </PopoverTrigger>
          <PopoverContent
            className="w-[calc(100vw-2rem)] max-w-[var(--radix-popover-trigger-width)] p-0 sm:w-[var(--radix-popover-trigger-width)]"
            align="start"
            sideOffset={8}
          >
            <Command
              filter={(itemValue, search) =>
                itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
              }
            >
              <div cmdk-input-wrapper="" className="sticky top-0 z-10 border-b bg-popover">
                <CommandInput placeholder="ابحث باسم المستودع أو الحساب…" dir="ltr" />
              </div>
              <CommandList className="max-h-[min(60vh,420px)] overscroll-contain">
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup className="p-1.5">
                  {repos.map((repo) => {
                    const { owner, name } = split(repo.fullName);
                    const isSelected = value === repo.fullName;
                    return (
                      <CommandItem
                        key={repo.fullName}
                        value={repo.fullName}
                        onSelect={(selectedValue) => {
                          onChange(selectedValue === value ? "" : selectedValue);
                          setOpen(false);
                        }}
                        className={cn(
                          "gap-3 rounded-lg px-3 py-3",
                          "data-[selected=true]:bg-accent",
                          isSelected && "bg-primary/10",
                        )}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isSelected ? "opacity-100 text-primary" : "opacity-0",
                          )}
                        />
                        <span className="grid min-w-0 flex-1 gap-0.5">
                          <span
                            className="truncate text-sm font-medium leading-tight"
                            dir="ltr"
                          >
                            {name}
                          </span>
                          <span
                            className="mono truncate text-xs leading-tight text-muted-foreground"
                            dir="ltr"
                          >
                            {owner}
                          </span>
                        </span>
                        {repo.isPrivate && (
                          <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

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
