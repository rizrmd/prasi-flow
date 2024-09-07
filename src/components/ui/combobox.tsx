"use client";

import { Check } from "lucide-react";
import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function Combobox({
  options,
  children,
  onChange,
  defaultValue,
  className,
}: {
  className?: string;
  options: (
    | { value: string; label: string; el?: React.ReactElement }
    | string
  )[];
  onChange: (value: string) => void;
  defaultValue: string;
  children: (opt: { setOpen: (open: boolean) => void }) => React.ReactElement;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const _options = options.map((e) => {
    if (typeof e === "string") return { label: e, value: e };
    return e;
  });
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children({ setOpen })}</PopoverTrigger>
      <PopoverContent className={cx("w-[200px] p-0", className)}>
        <Command>
          <CommandInput
            placeholder="Search..."
            className={cx(
              "text-sm",
              css`
                padding: 0px;
                height: 35px;
              `
            )}
          />
          <CommandList>
            <CommandEmpty>No Option found.</CommandEmpty>
            <CommandGroup>
              {_options.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  className="text-sm"
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);

                    onChange(currentValue);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.el || item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
