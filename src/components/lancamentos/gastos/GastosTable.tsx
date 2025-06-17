"use client";

// Seus imports de UI e bibliotecas - 100% MANTIDOS
import * as React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconPlus,
  IconCreditCard,
  IconRepeat,
  IconShoppingCart,
  IconCalendarCheck,
  IconLoader, // Usando o IconLoader que já existe
  IconPackage,
  IconClock,
} from "@tabler/icons-react";
import { ChevronDownIcon } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

// --- INTEGRAÇÃO COM A API VIA HOOKS CUSTOMIZADOS ---
import { useGastos, useGastoMutations } from "@/hooks/useGastos";
import { Gasto, GastoCreatePayload, TipoGasto } from "@/types/lancamentos";
// --- FIM DA INTEGRAÇÃO ---

// ============================================================================
// SEUS COMPONENTES INTERNOS E HELPERS - NENHUMA ALTERAÇÃO
// ============================================================================

function DatePickerVencimento({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (date: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const dateObj = value ? new Date(`${value}T00:00:00`) : undefined;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="dataVencimento" className="px-1">
        Data de vencimento
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dataVencimento"
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
                const isoDate = date.toISOString().split("T")[0];
                onChange(isoDate);
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function StatusBadge({ pago }: { pago: boolean }) {
  return (
    <>
      <span className="md:hidden flex items-center justify-center">
        {pago ? (
          <IconCalendarCheck className="text-[var(--success)]" size={18} />
        ) : (
          <IconClock className="text-warning" size={18} />
        )}
      </span>
      <span className="hidden md:inline-flex">
        {pago ? (
          <Badge
            variant="outline"
            className="gap-1 px-2 py-1 text-xs rounded-md font-medium flex items-center border"
            style={{
              color: "var(--success)",
              borderColor: "var(--success)",
              background: "transparent",
            }}
          >
            <IconCalendarCheck style={{ color: "var(--success)" }} size={15} />{" "}
            Pago
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="gap-1 px-2 py-1 text-xs rounded-md font-medium flex items-center border"
            style={{
              color: "text-muted",
              borderColor: "text-muted",
              background: "transparent",
            }}
          >
            <IconClock size={15} /> Pendente
          </Badge>
        )}
      </span>
    </>
  );
}

function TipoBadge({ tipo }: { tipo: Gasto["tipo"] }) {
  let icon = <IconPackage size={18} />;
  let bg = "var(--muted)";
  let color = "var(--muted-foreground)";
  let label = tipo;

  if (tipo === "VARIAVEL") {
    icon = <IconShoppingCart size={18} style={{ color: "var(--info)" }} />;
    bg = "var(--info)";
    color = "var(--info-foreground)";
    label = "Variável";
  } else if (tipo === "FIXO") {
    icon = <IconRepeat size={18} style={{ color: "var(--success)" }} />;
    bg = "var(--success)";
    color = "var(--success-foreground)";
    label = "Fixo";
  } else if (tipo === "PARCELADO") {
    icon = <IconCreditCard size={18} style={{ color: "var(--warning)" }} />;
    bg = "var(--warning)";
    color = "var(--warning-foreground)";
    label = "Parcelado";
  }

  return (
    <>
      <span className="md:hidden flex items-center justify-center">{icon}</span>
      <span className="hidden md:inline-flex">
        <Badge
          variant="outline"
          className="text-xs px-2 py-1 rounded-md border-0 font-semibold flex items-center gap-1"
          style={{ background: bg, color }}
        >
          {label}
        </Badge>
      </span>
    </>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function DraggableRow({ row }: { row: any }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });
  return (
    <TableRow
      data-dragging={isDragging}
      ref={setNodeRef}
      className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b-2 transition-colors"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell: any) => (
        <TableCell
          key={cell.id}
          className={cell.column.columnDef.meta?.className}
        >
          {" "}
          {flexRender(cell.column.columnDef.cell, cell.getContext())}{" "}
        </TableCell>
      ))}
    </TableRow>
  );
}

// ============================================================================
// SEU MODAL DE EDIÇÃO - CONECTADO AOS HOOKS
// ============================================================================
function EditDrawerModal({
  open,
  onClose,
  gasto,
  onSave,
  isSaving,
}: {
  open: boolean;
  onClose: () => void;
  gasto: Partial<Gasto> | null;
  onSave: (data: GastoCreatePayload, id?: number) => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = React.useState<Partial<Gasto> | null>(null);

  React.useEffect(() => {
    setEditData(gasto ? { ...gasto } : {});
  }, [gasto]);

  if (!open || editData === null) return null;

  const handleFieldChange = (field: keyof Gasto, value: any) => {
    setEditData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editData.descricao ||
      !editData.valor ||
      !editData.dataVencimento ||
      !editData.tipo
    ) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    const payload: GastoCreatePayload = {
      descricao: editData.descricao,
      valor: Number(editData.valor),
      tipo: editData.tipo as TipoGasto,
      dataVencimento: editData.dataVencimento,
      numeroParcelaAtual:
        editData.tipo === "PARCELADO"
          ? Number(editData.numeroParcelaAtual) || null
          : null,
      totalParcelas:
        editData.tipo === "PARCELADO"
          ? Number(editData.totalParcelas) || null
          : null,
      gastoCartao: !!editData.gastoCartao,
      pago: !!editData.pago,
    };
    onSave(payload, editData.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 mb-0">
      <div className="bg-background rounded-2xl w-full max-w-md sm:max-w-sm mx-auto p-6 shadow-2xl animate-in fade-in slide-in-from-top-10 border relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">
            {editData.id ? "Editar Gasto" : "Novo Gasto"}
          </h2>
          <button
            onClick={onClose}
            className="text-xl text-muted-foreground hover:text-foreground absolute top-3 right-4"
          >
            ×
          </button>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* SEUS INPUTS E SELECTS - MANTIDOS */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={editData.descricao || ""}
              onChange={(e) => handleFieldChange("descricao", e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              type="number"
              min={0}
              step={0.01}
              value={editData.valor || ""}
              onChange={(e) => handleFieldChange("valor", e.target.value)}
              required
            />
          </div>
          <DatePickerVencimento
            value={editData.dataVencimento}
            onChange={(val) => handleFieldChange("dataVencimento", val)}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={editData.tipo}
                onValueChange={(val) => handleFieldChange("tipo", val)}
              >
                <SelectTrigger id="tipo" className="w-full">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VARIAVEL">Variável</SelectItem>
                  <SelectItem value="FIXO">Fixo</SelectItem>
                  <SelectItem value="PARCELADO">Parcelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-start flex-col gap-2">
              <Label htmlFor="pago">Status</Label>
              <Select
                value={editData.pago ? "pago" : "pendente"}
                onValueChange={(val) =>
                  handleFieldChange("pago", val === "pago")
                }
              >
                <SelectTrigger id="pago" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {editData.tipo === "PARCELADO" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="parcelas">Parcelas</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="numeroParcelaAtual"
                  type="number"
                  min={1}
                  value={editData.numeroParcelaAtual ?? ""}
                  onChange={(e) =>
                    handleFieldChange("numeroParcelaAtual", e.target.value)
                  }
                  placeholder="Atual"
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground">de</span>
                <Input
                  id="totalParcelas"
                  type="number"
                  min={1}
                  value={editData.totalParcelas ?? ""}
                  onChange={(e) =>
                    handleFieldChange("totalParcelas", e.target.value)
                  }
                  placeholder="Total"
                  className="w-full"
                />
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Label htmlFor="gastoCartao">Gasto no cartão?</Label>
            <Select
              value={editData.gastoCartao ? "sim" : "nao"}
              onValueChange={(val) =>
                handleFieldChange("gastoCartao", val === "sim")
              }
            >
              <SelectTrigger id="gastoCartao" className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// TABELA PRINCIPAL - USANDO OS NOVOS HOOKS DE GASTOS
// ============================================================================
export default function GastosTable() {
  const [search, setSearch] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [editing, setEditing] = React.useState<Partial<Gasto> | null>(null);

  const { data: pageData, isLoading } = useGastos(pagination);
  const { createGasto, updateGasto, deleteGasto, isCreating, isUpdating } =
    useGastoMutations();

  const handleSave = (payload: GastoCreatePayload, id?: number) => {
    if (id) {
      updateGasto({ id, payload }, { onSuccess: () => setEditing(null) });
    } else {
      createGasto(payload, { onSuccess: () => setEditing(null) });
    }
  };

  const tableData = React.useMemo(() => pageData?.content ?? [], [pageData]);
  const filteredData = search
    ? tableData.filter((g) =>
        g.descricao.toLowerCase().includes(search.toLowerCase())
      )
    : tableData;

  const columns: ColumnDef<Gasto>[] = [
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge pago={row.original.pago} />,
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: ({ row }) => row.original.descricao,
    },
    {
      accessorKey: "valor",
      header: "Valor",
      cell: ({ row }) => (
        <span className="font-medium" style={{ color: "var(--primary)" }}>
          {row.original.valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      ),
    },
    {
      accessorKey: "dataVencimento",
      header: "Vencimento",
      cell: ({ row }) => (
        <span className="font-mono text-xs hidden md:inline">
          {formatDate(row.original.dataVencimento)}
        </span>
      ),
      meta: { className: "hidden md:table-cell" },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => <TipoBadge tipo={row.original.tipo} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex size-8" size="icon">
              <IconDotsVertical />
              <span className="sr-only">Ações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => setEditing(row.original)}>
              <IconEdit className="mr-2" size={16} /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => deleteGasto(row.original.id)}
            >
              <IconTrash className="mr-2" size={16} /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    pageCount: pageData?.totalPages ?? 0,
    manualPagination: true,
  });

  const total = React.useMemo(
    () => filteredData.reduce((acc, g) => acc + g.valor, 0),
    [filteredData]
  );

  return (
    <div className="w-full m-auto space-y-4">
      <EditDrawerModal
        open={!!editing}
        onClose={() => setEditing(null)}
        gasto={editing}
        onSave={handleSave}
        isSaving={isCreating || isUpdating}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Buscar por descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button
            onClick={() => setEditing({})}
            variant="default"
            size="default"
          >
            <IconPlus className="mr-2" size={16} /> Novo gasto
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-background">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.columnDef.meta?.className}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center">
                    <IconLoader className="animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              <SortableContext
                items={filteredData.map((g) => g.id)}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} row={row} />
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum gasto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="w-full px-4 pb-4 mt-1">
        <div className="hidden md:flex w-full items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Gastos por página</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-20">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground font-semibold ml-2">
              Total exibido:{" "}
              <span style={{ color: "var(--primary)" }}>
                {total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
