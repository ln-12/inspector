import React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  onInputChange: (value: string) => void;
  options: string[];
  onRemoveOption?: (value: string) => void;
  onConfirmInput?: (value: string) => void;
  onClose?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  id?: string;
}

export function Combobox({
  value,
  onChange,
  onInputChange,
  options = [],
  onRemoveOption,
  onConfirmInput,
  onClose,
  placeholder = "Select...",
  emptyMessage = "No results found.",
  id,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);

  const handleSelect = React.useCallback(
    (option: string) => {
      onChange(option);
      setOpen(false);
    },
    [onChange],
  );

  const handleInputChange = React.useCallback(
    (val: string) => {
      setInputValue(val);
      onInputChange(val);
    },
    [onInputChange],
  );

  const handleOpenChange = React.useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (isOpen) {
        setInputValue("");
      } else {
        if (onClose) {
          onClose(value);
        }
        setInputValue(value);
      }
    },
    [value, onClose],
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls={id}
          id={id}
          className="w-full justify-between overflow-hidden min-w-0"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="min-w-0 w-[--radix-popper-anchor-width] max-w-full p-0"
        align="start"
      >
        <Command shouldFilter={false} id={id}>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (inputValue && inputValue.trim().length > 0) {
                  onChange(inputValue);
                  if (onConfirmInput) {
                    onConfirmInput(inputValue);
                  }
                  setOpen(false);
                }
              }
            }}
          />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option}
                value={option}
                onSelect={() => handleSelect(option)}
              >
                <div className="w-full flex items-center min-w-0">
                  {onRemoveOption && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2 h-6 w-6"
                      aria-label={`Remove ${option}`}
                      title={`Remove ${option}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveOption(option);
                      }}
                    >
                      <X className="h-3 w-3 text-white" />
                    </Button>
                  )}
                  <span className="truncate flex-1 pr-2 min-w-0">{option}</span>
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0",
                    )}
                  />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
