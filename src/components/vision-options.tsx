import { forwardRef, useEffect, useId, useRef, useState, type InputHTMLAttributes } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";
import { distanceVisionOptions, nearVisionOptions } from "@/lib/clinical-options";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue"> & {
  near?: boolean;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: (value: string) => void;
};
export const VisionInput = forwardRef<HTMLInputElement, Props>(function VisionInput(
  {
    near = false,
    value,
    defaultValue = "",
    onValueChange,
    onChange,
    onFocus,
    onKeyDown,
    className = "field-control",
    ...props
  },
  ref,
) {
  const [localValue, setLocalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(-1);
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const current = value ?? localValue;
  const options = (near ? nearVisionOptions.map((v) => [v, v]) : distanceVisionOptions).filter(
    ([code, label]) => `${code} ${label}`.toLowerCase().includes(search.toLowerCase()),
  );
  useEffect(() => {
    if (open && active >= 0)
      listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active, open]);
  const choose = (next: string) => {
    setLocalValue(next);
    onValueChange?.(next);
    setOpen(false);
    setActive(-1);
  };
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Anchor asChild>
        <span className="relative block">
          <input
            {...props}
            ref={ref}
            className={`${className} pr-10`}
            value={current}
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
            onFocus={(event) => {
              setSearch("");
              setActive(-1);
              setOpen(true);
              onFocus?.(event);
            }}
            onClick={() => {
              setSearch("");
              setActive(-1);
              setOpen(true);
            }}
            onChange={(event) => {
              setLocalValue(event.target.value);
              onValueChange?.(event.target.value);
              setSearch(event.target.value);
              setActive(-1);
              setOpen(true);
              onChange?.(event);
            }}
            onKeyDown={(event) => {
              onKeyDown?.(event);
              if (event.defaultPrevented) return;
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                setOpen(true);
                setActive((index) =>
                  options.length
                    ? (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) %
                      options.length
                    : -1,
                );
              } else if (event.key === "Enter" && open) {
                event.preventDefault();
                const selected = options[active]?.[0];
                if (selected) choose(selected);
                else setOpen(false);
              } else if (event.key === "Escape" && open) {
                event.preventDefault();
                event.stopPropagation();
                setOpen(false);
              } else if (event.key === "Tab") setOpen(false);
            }}
          />
          <ChevronDown
            aria-hidden="true"
            size={16}
            className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="start"
          collisionPadding={12}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            if (
              event.target instanceof Element &&
              event.target.closest(`[aria-controls="${listId}"]`)
            )
              event.preventDefault();
          }}
          className="vision-menu z-50 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg"
        >
          <div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
            {near ? "Near vision" : "Distance vision"} · Select or type a value
          </div>
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={near ? "Near vision readings" : "Distance vision readings"}
            className="vision-menu-options p-1"
          >
            {options.map(([code, label], index) => (
              <div
                key={code}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={current === code}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm ${active === index ? "bg-accent text-accent-foreground" : "hover:bg-accent/60"}`}
                onPointerMove={() => setActive(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => choose(code!)}
              >
                <span className="min-w-12 font-semibold">{code}</span>
                {label !== code && (
                  <span className="flex-1 text-xs text-muted-foreground">{label}</span>
                )}
                {current === code && <Check size={15} className="ml-auto shrink-0 text-primary" />}
              </div>
            ))}
            {!options.length && (
              <p className="px-3 py-3 text-sm text-muted-foreground">
                No matching option. Your typed value will be saved.
              </p>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});
