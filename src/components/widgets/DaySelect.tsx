import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils.ts"
import { Button } from "@/components/ui/button.tsx"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx"

const dayOptions = [
  { label: "Senin", value: "senin"},
  { label: "Selasa", value: "selasa"},
  { label: "Rabu", value: "rabu"},
  { label: "Kamis", value: "kamis"},
  { label: "Jumat", value: "jumat"},
  { label: "Sabtu", value: "sabtu"}
]


export function DaySelect() {
  const [open, setOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState("")

  const handleDaySelect = (currentValue: string) => {
    const newValue = currentValue === selectedDay ? "" : currentValue;
    setSelectedDay(newValue);
    setOpen(false);

    const event = new CustomEvent('daySelected', { detail: newValue });
    document.dispatchEvent(event);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-gray-500"
        >
          {selectedDay
            ? dayOptions.find((day) => day.value === selectedDay)?.label
            : "Pilih Hari..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Cari Hari..." />
          <CommandList>
            <CommandEmpty>Hari tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {dayOptions.map((day) => (
                <CommandItem
                  key={day.value}
                  value={day.value}
                  onSelect={handleDaySelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedDay === day.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {day.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
