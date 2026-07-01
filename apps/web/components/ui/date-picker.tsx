"use client";

import * as React from "react";
import { format } from "date-fns";
import { Input } from "./input";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

export function DatePicker({ value, onChange, disabled }: DatePickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      onChange(date);
    }
  };

  const formattedDate = value ? format(value, "yyyy-MM-dd") : "";

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="date"
        value={formattedDate}
        onChange={handleDateChange}
        disabled={disabled}
        className="cursor-pointer"
      />
    </div>
  );
}
