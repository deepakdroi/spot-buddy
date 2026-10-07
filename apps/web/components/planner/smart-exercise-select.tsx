"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search exercises"
              value={query}
              onInput={(e) => setQuery(e.currentTarget.value)}
            />
          </div>
          <CommandEmpty>No exercises found.</CommandEmpty>
          <div className="max-h-[280px] overflow-auto">
            <CommandGroup heading="Your Regulars">
              {filteredRegulars.length > 0 ? (
                filteredRegulars.map((exercise) => (
                  <CommandItem
                    key={exercise}
                    onSelect={() => toggleExercise(exercise)}
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
                    key={exercise}
                    onSelect={() => toggleExercise(exercise)}
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
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
