import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerRecebimento({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (date: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const dateObj = value ? new Date(value) : undefined;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="dataRecebimento" className="px-1">
        Data de recebimento
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dataRecebimento"
            className="w-full justify-between font-normal"
          >
            {dateObj ? dateObj.toLocaleDateString("pt-BR") : "Selecionar data"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={dateObj}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (date) {
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                onChange(`${yyyy}-${mm}-${dd}`);
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
