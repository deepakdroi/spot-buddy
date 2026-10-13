"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import {
  Command,
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SmartExerciseSelectProps {
  recentExercises: string[];
  otherExercises: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function SmartExerciseSelect({
  recentExercises,
  otherExercises,
  value,
  onChange,
}: SmartExerciseSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredRegulars = useMemo(() => {
    const normalized = query.toLowerCase();
    return recentExercises.filter((exercise) =>
      exercise.toLowerCase().includes(normalized),
    );
  }, [query, recentExercises]);

  const filteredAll = useMemo(() => {
    const normalized = query.toLowerCase();
    return otherExercises.filter((exercise) =>
      exercise.toLowerCase().includes(normalized),
    );
  }, [query, otherExercises]);

  const toggleExercise = (exercise: string) => {
    const nextValue = value.includes(exercise)
      ? value.filter((entry) => entry !== exercise)
      : [...value, exercise];
    onChange(nextValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value.length > 0 ? `${value.length} selected` : "Select exercises"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command {...({ shouldFilter: false } as any)}>
          <div className="flex items-center justify-between border-b px-3">
            <div className="flex flex-1 items-center">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search exercises"
                value={query}
                onInput={(e) => setQuery(e.currentTarget.value)}
                className="border-none outline-none focus:ring-0"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs font-semibold text-primary hover:bg-primary/10"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
              }}
            >
              Done
            </Button>
          </div>
          <CommandList
            className="max-h-[280px] overflow-y-auto overscroll-contain"
            onWheel={(e) => e.stopPropagation()}
            style={{ pointerEvents: "auto" }}
          >
            {filteredRegulars.length === 0 && filteredAll.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No exercises found.
              </div>
            )}
            <CommandGroup heading="Your Regulars">
              {filteredRegulars.length > 0 ? (
                filteredRegulars.map((exercise) => (
                  <CommandItem
                    key={`regular-${exercise}`}
                    {...({ value: `regular-${exercise.toLowerCase()}` } as any)}
                    onSelect={() => toggleExercise(exercise)}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevents the search bar from losing focus
                      e.stopPropagation();
                    }}
                    onClick={() => toggleExercise(exercise)}
                    style={{ pointerEvents: "auto" }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(exercise) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {exercise}
                  </CommandItem>
                ))
              ) : (
                <div className="px-2 py-3 text-sm text-muted-foreground">
                  No regular exercises match.
                </div>
              )}
            </CommandGroup>
            <CommandGroup heading="All Exercises">
              {filteredAll.length > 0 ? (
                filteredAll.map((exercise) => (
                  <CommandItem
                    key={`all-${exercise}`}
                    {...({ value: `all-${exercise.toLowerCase()}` } as any)}
                    onSelect={() => toggleExercise(exercise)}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevents the search bar from losing focus
                      e.stopPropagation();
                    }}
                    onClick={() => toggleExercise(exercise)}
                    style={{ pointerEvents: "auto" }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(exercise) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {exercise}
                  </CommandItem>
                ))
              ) : (
                <div className="px-2 py-3 text-sm text-muted-foreground">
                  No other exercises match.
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
