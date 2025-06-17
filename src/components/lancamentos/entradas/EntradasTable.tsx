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
  IconCircleCheckFilled,
  IconClock,
  IconCoins,
  IconBriefcase,
  IconBulb,
  IconQuestionMark,
  IconLoader, // Adicionado para o estado de loading
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
import { useEntradas, useEntradaMutations } from "@/hooks/useEntradas";
import {
  Entrada,
  EntradaCreatePayload,
  TipoEntrada,
} from "@/types/lancamentos";
// --- FIM DA INTEGRAÇÃO ---

// ============================================================================
// SEUS COMPONENTES INTERNOS E HELPERS - NENHUMA ALTERAÇÃO
// ============================================================================

function DatePickerRecebimento({
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

function StatusBadge({ recorrente }: { recorrente: boolean }) {
  return (
    <>
      <span className="md:hidden flex items-center justify-center">
        {recorrente ? (
          <IconCircleCheckFilled className="text-[var(--primary)]" size={18} />
        ) : (
          <IconClock className="text-muted-foreground" size={18} />
        )}
      </span>
      <span className="hidden md:inline-flex">
        {recorrente ? (
          <Badge
            variant="outline"
            className="gap-1 px-2 py-1 text-xs rounded-md font-medium flex items-center border"
            style={{
              color: "var(--primary)",
              borderColor: "var(--primary)",
              background: "transparent",
            }}
          >
            <IconCircleCheckFilled
              style={{ fill: "var(--primary)" }}
              size={15}
            />{" "}
            Recorrente
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="gap-1 px-2 py-1 text-xs rounded-md font-medium flex items-center border text-muted-foreground"
            style={{
              color: "var(--muted-foreground)",
              borderColor: "var(--muted)",
            }}
          >
            <IconClock className="text-muted-foreground" size={15} /> Única vez
          </Badge>
        )}
      </span>
    </>
  );
}

function TipoBadge({ tipo }: { tipo: string }) {
  let icon = <IconQuestionMark size={24} />;
  let bg = "var(--muted)";
  let color = "var(--muted-foreground)";
  let label = tipo;

  if (tipo === "SALARIO") {
    icon = <IconCoins size={24} style={{ color: "var(--success)" }} />;
    bg = "var(--success)";
    color = "var(--success-foreground)";
    label = "Salário";
  } else if (tipo === "FREELA") {
    icon = <IconBriefcase size={24} style={{ color: "var(--success)" }} />;
    bg = "var(--info)";
    color = "var(--info-foreground)";
    label = "Freela";
  } else if (tipo === "RENDA_EXTRA") {
    icon = <IconBulb size={24} style={{ color: "var(--success)" }} />;
    bg = "var(--warning)";
    color = "var(--warning-foreground)";
    label = "Renda Extra";
  } else if (tipo === "OUTROS") {
    icon = <IconQuestionMark size={24} style={{ color: "var(--success)" }} />;
    bg = "var(--muted)";
    color = "var(--muted-foreground)";
    label = "Outros";
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
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  entrada,
  onSave,
  isSaving,
}: {
  open: boolean;
  onClose: () => void;
  entrada: Partial<Entrada> | null;
  onSave: (data: EntradaCreatePayload, id?: number) => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = React.useState<Partial<Entrada> | null>(null);

  React.useEffect(() => {
    setEditData(entrada ? { ...entrada } : {});
  }, [entrada]);

  if (!open || editData === null) return null;

  const handleFieldChange = (field: keyof Entrada, value: any) => {
    setEditData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editData.descricao ||
      !editData.valor ||
      !editData.dataRecebimento ||
      !editData.tipo
    ) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    const payload: EntradaCreatePayload = {
      descricao: editData.descricao,
      valor: Number(editData.valor),
      dataRecebimento: editData.dataRecebimento,
      tipo: editData.tipo as TipoEntrada,
      recorrente: !!editData.recorrente,
    };
    onSave(payload, editData.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
      <div className="bg-background rounded-2xl w-full max-w-md sm:max-w-sm mx-auto p-6 shadow-2xl animate-in fade-in slide-in-from-top-10 border relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">
            {editData.id ? "Editar Entrada" : "Nova Entrada"}
          </h2>
          <button
            onClick={onClose}
            className="text-xl text-muted-foreground hover:text-foreground absolute top-3 right-4"
          >
            ×
          </button>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
          <DatePickerRecebimento
            value={editData.dataRecebimento}
            onChange={(val) => handleFieldChange("dataRecebimento", val)}
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
                  <SelectItem value="SALARIO">Salário</SelectItem>
                  <SelectItem value="FREELA">Freela</SelectItem>
                  <SelectItem value="RENDA_EXTRA">Renda Extra</SelectItem>
                  <SelectItem value="OUTROS">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-start flex-col gap-2">
              <Label htmlFor="recorrente">Status</Label>
              <Select
                value={editData.recorrente ? "recorrente" : "unico"}
                onValueChange={(val) =>
                  handleFieldChange("recorrente", val === "recorrente")
                }
              >
                <SelectTrigger id="recorrente" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recorrente">Recorrente</SelectItem>
                  <SelectItem value="unico">Única vez</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
// TABELA PRINCIPAL - AGORA USANDO OS HOOKS
// ============================================================================
export default function EntradasTable() {
  const [search, setSearch] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [editing, setEditing] = React.useState<Partial<Entrada> | null>(null);

  // Lógica de dados abstraída pelos hooks
  const { data: pageData, isLoading } = useEntradas(pagination);
  const {
    createEntrada,
    updateEntrada,
    deleteEntrada,
    isCreating,
    isUpdating,
  } = useEntradaMutations();

  // Função que o modal chama ao salvar
  const handleSave = (payload: EntradaCreatePayload, id?: number) => {
    const onSettled = () => {
      if (!createMutation.isError && !updateMutation.isError) {
        setEditing(null);
      }
    };

    if (id) {
      updateEntrada({ id, payload }, { onSuccess: () => setEditing(null) });
    } else {
      createEntrada(payload, { onSuccess: () => setEditing(null) });
    }
  };

  const tableData = React.useMemo(() => pageData?.content ?? [], [pageData]);
  const filteredData = search
    ? tableData.filter((e) =>
        e.descricao.toLowerCase().includes(search.toLowerCase())
      )
    : tableData;

  const columns: ColumnDef<Entrada>[] = [
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge recorrente={row.original.recorrente} />,
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
      accessorKey: "dataRecebimento",
      header: "Recebido em",
      cell: ({ row }) => (
        <span className="font-mono text-xs hidden md:inline">
          {formatDate(row.original.dataRecebimento)}
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
              onClick={() => deleteEntrada(row.original.id)}
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
    pageCount: pageData?.totalPages ?? -1,
    manualPagination: true,
  });

  const total = React.useMemo(
    () => filteredData.reduce((acc, e) => acc + e.valor, 0),
    [filteredData]
  );

  return (
    <div className="w-full m-auto space-y-4">
      <EditDrawerModal
        open={!!editing}
        onClose={() => setEditing(null)}
        entrada={editing}
        onSave={handleSave}
        isSaving={isCreating || isUpdating}
      />

      {/* Cabeçalho */}
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
            <IconPlus className="mr-2" size={16} /> Nova entrada
          </Button>
        </div>
      </div>

      {/* Tabela */}
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
                    {" "}
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}{" "}
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
                items={filteredData.map((e) => e.id)}
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
                  Nenhuma entrada encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Rodapé responsivo */}
      <div className="w-full px-4 pb-4 mt-1">
        <div className="flex flex-col gap-1 md:hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Entradas por página</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-16">
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
            <span className="text-sm font-medium ml-2">
              {table.getState().pagination.pageIndex + 1} de{" "}
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
          <div className="text-sm text-muted-foreground font-semibold mt-0.5">
            Total exibido:{" "}
            <span style={{ color: "var(--primary)" }}>
              {total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </div>
        <div className="hidden md:flex w-full items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Entradas por página</span>
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
