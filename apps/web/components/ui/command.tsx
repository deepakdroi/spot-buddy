"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";

type CommandProps = React.ComponentPropsWithoutRef<"div">;
type CommandInputProps = React.InputHTMLAttributes<HTMLInputElement>;
type CommandListProps = React.ComponentPropsWithoutRef<"div">;
type CommandEmptyProps = React.ComponentPropsWithoutRef<"div">;
type CommandGroupProps = React.ComponentPropsWithoutRef<"div"> & {
  heading?: string;
};
type CommandItemProps = React.ComponentPropsWithoutRef<"div"> & {
  onSelect?: () => void;
};

function Command({ className, ...props }: CommandProps) {
  return (
    <CommandPrimitive
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        className,
      )}
      {...(props as any)}
    />
  );
}

function CommandInput({ className, ...props }: CommandInputProps) {
  return (
    <CommandPrimitive.Input
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...(props as any)}
    />
  );
}

function CommandList({ className, ...props }: CommandListProps) {
  return (
    <CommandPrimitive.List
      className={cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden",
        className,
      )}
      {...(props as any)}
    />
  );
}

function CommandEmpty({ className, ...props }: CommandEmptyProps) {
  return (
    <CommandPrimitive.Empty
      className={cn("py-6 text-center text-sm", className)}
      {...(props as any)}
    />
  );
}

function CommandGroup({ className, heading, ...props }: CommandGroupProps) {
  return (
    <CommandPrimitive.Group
      heading={heading}
      className={cn("overflow-hidden p-1 text-foreground", className)}
      {...(props as any)}
    />
  );
}

function CommandItem({ className, ...props }: CommandItemProps) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...(props as any)}
    />
  );
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
};
