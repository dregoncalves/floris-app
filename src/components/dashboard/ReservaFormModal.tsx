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
import { ReservaEmergencia } from "@/types/dashboard";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { valorObjetivo: number }) => void;
  isSaving: boolean;
  initialData?: Partial<ReservaEmergencia>;
}

export function ReservaFormModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialData,
}: Props) {
  const [valorObjetivo, setValorObjetivo] = useState(0);

  useEffect(() => {
    if (isOpen && initialData?.valorObjetivo) {
      setValorObjetivo(initialData.valorObjetivo);
    } else if (!isOpen) {
      setValorObjetivo(0);
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    onSave({
      valorObjetivo: Number(valorObjetivo),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Editar Meta" : "Criar Reserva de Emergência"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="valorObjetivo">
              Qual o seu objetivo de reserva?
            </Label>
            <Input
              id="valorObjetivo"
              type="number"
              value={valorObjetivo}
              onChange={(e) => setValorObjetivo(Number(e.target.value))}
              placeholder="Ex: 30000"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isSaving || valorObjetivo <= 0}
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
