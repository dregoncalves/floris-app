import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { valor: number }) => void;
  isSaving: boolean;
}

export function AporteFormModal({ isOpen, onClose, onSave, isSaving }: Props) {
  const [valor, setValor] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setValor(0);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSave({ valor: Number(valor) });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Realizar Aporte</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="aporteValor">Valor do Aporte</Label>
            <Input
              id="aporteValor"
              type="number"
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSaving || valor <= 0}>
            {isSaving ? "Aportando..." : "Aportar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
