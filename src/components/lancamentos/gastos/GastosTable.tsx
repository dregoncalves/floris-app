"use client";

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
  IconLoader2,
  IconPackage,
} from "@tabler/icons-react";
import { ChevronDownIcon } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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

// -------------- DatePickerVencimento ------------------
function DatePickerVencimento({
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

// ---------------- Tipos e mocks -----------------------
type Gasto = {
  id: number;
  descricao: string;
  valor: number;
  valorMensal: number;
  tipo: "VARIAVEL" | "FIXO" | "PARCELADO";
  dataVencimento: string;
  numeroParcelaAtual: number | null;
  totalParcelas: number | null;
  gastoCartao: boolean;
  pago: boolean;
};

const MOCK_GASTOS: Gasto[] = [
  {
    id: 1,
    descricao: "Mercado",
    valor: 150.0,
    valorMensal: 150.0,
    tipo: "VARIAVEL",
    dataVencimento: "2025-06-15",
    numeroParcelaAtual: null,
    totalParcelas: null,
    gastoCartao: false,
    pago: true,
  },
  {
    id: 2,
    descricao: "Coxinha",
    valor: 12.0,
    valorMensal: 12.0,
    tipo: "VARIAVEL",
    dataVencimento: "2025-06-15",
    numeroParcelaAtual: null,
    totalParcelas: null,
    gastoCartao: false,
    pago: true,
  },
  {
    id: 3,
    descricao: "Computador",
    valor: 3000.0,
    valorMensal: 300.0,
    tipo: "PARCELADO",
    dataVencimento: "2025-06-15",
    numeroParcelaAtual: 1,
    totalParcelas: 10,
    gastoCartao: false,
    pago: false,
  },
  {
    id: 4,
    descricao: "Netflix",
    valor: 60.0,
    valorMensal: 60.0,
    tipo: "FIXO",
    dataVencimento: "2025-06-15",
    numeroParcelaAtual: null,
    totalParcelas: null,
    gastoCartao: false,
    pago: false,
  },
];

// Badge de status: pago ou não
function StatusBadge({ pago }: { pago: boolean }) {
  return (
    <>
      {/* Ícone só no mobile */}
      <span className="md:hidden flex items-center justify-center">
        {pago ? (
          <IconCalendarCheck className="text-[var(--success)]" size={18} />
        ) : (
          <IconLoader2 className="text-warning animate-spin" size={18} />
        )}
      </span>
      {/* Badge no desktop */}
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
            <IconCalendarCheck style={{ color: "var(--success)" }} size={15} />
            Pago
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="gap-1 px-2 py-1 text-xs rounded-md font-medium flex items-center border"
            style={{
              color: "var(--warning-foreground)",
              borderColor: "var(--warning)",
              background: "transparent",
            }}
          >
            <IconLoader2 className="animate-spin" size={15} />
            Pendente
          </Badge>
        )}
      </span>
    </>
  );
}

// Badge de tipo (ícone no mobile, badge no desktop)
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
      {/* Ícone só no mobile */}
      <span className="md:hidden flex items-center justify-center">{icon}</span>
      {/* Badge no desktop */}
      <span className="hidden md:inline-flex">
        <Badge
          variant="outline"
          className="text-xs px-2 py-1 rounded-md border-0 font-semibold flex items-center gap-1"
          style={{
            background: bg,
            color,
          }}
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
  });
}

// Modal centralizado com margin no mobile
function EditDrawerModal({
  open,
  onClose,
  gasto,
}: {
  open: boolean;
  onClose: () => void;
  gasto: Gasto | null;
}) {
  const [editData, setEditData] = React.useState({
    ...gasto,
    dataVencimento: gasto?.dataVencimento ?? "",
  });

  React.useEffect(() => {
    if (gasto)
      setEditData({
        ...gasto,
        dataVencimento: gasto.dataVencimento ?? "",
      });
  }, [gasto]);

  if (!open || !gasto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
      <div className="bg-background rounded-2xl w-full max-w-md sm:max-w-sm mx-auto p-6 shadow-2xl animate-in fade-in slide-in-from-top-10 border relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Editar gasto</h2>
          <button
            onClick={onClose}
            className="text-xl text-muted-foreground hover:text-foreground absolute top-3 right-4"
          >
            ×
          </button>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Gasto atualizado (mock)!");
            onClose();
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={editData.descricao}
              onChange={(e) =>
                setEditData((old) => ({ ...old, descricao: e.target.value }))
              }
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
              value={editData.valor}
              onChange={(e) =>
                setEditData((old) => ({
                  ...old,
                  valor: Number(e.target.value),
                }))
              }
              required
            />
          </div>
          <DatePickerVencimento
            value={editData.dataVencimento}
            onChange={(val) =>
              setEditData((old) => ({ ...old, dataVencimento: val }))
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={editData.tipo}
                onValueChange={(val) =>
                  setEditData((old) => ({ ...old, tipo: val as Gasto["tipo"] }))
                }
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
                  setEditData((old) => ({
                    ...old,
                    pago: val === "pago",
                  }))
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
          {/* Parcelas */}
          {editData.tipo === "PARCELADO" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="parcelas">Parcelas</Label>
              <div className="flex gap-2">
                <Input
                  id="numeroParcelaAtual"
                  type="number"
                  min={1}
                  value={editData.numeroParcelaAtual ?? ""}
                  onChange={(e) =>
                    setEditData((old) => ({
                      ...old,
                      numeroParcelaAtual: Number(e.target.value),
                    }))
                  }
                  placeholder="Atual"
                  className="w-20"
                />
                <span className="text-sm flex items-center">de</span>
                <Input
                  id="totalParcelas"
                  type="number"
                  min={1}
                  value={editData.totalParcelas ?? ""}
                  onChange={(e) =>
                    setEditData((old) => ({
                      ...old,
                      totalParcelas: Number(e.target.value),
                    }))
                  }
                  placeholder="Total"
                  className="w-20"
                />
              </div>
            </div>
          )}
          {/* Gasto cartão */}
          <div className="flex items-center gap-2">
            <Label htmlFor="gastoCartao">Cartão?</Label>
            <Select
              value={editData.gastoCartao ? "sim" : "nao"}
              onValueChange={(val) =>
                setEditData((old) => ({
                  ...old,
                  gastoCartao: val === "sim",
                }))
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
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
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

export default function GastosTable() {
  const [data, setData] = React.useState<Gasto[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalElements, setTotalElements] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [editing, setEditing] = React.useState<Gasto | null>(null);

  // MOCK do fetch
  const fetchGastos = React.useCallback(() => {
    setTimeout(() => {
      setData(
        MOCK_GASTOS.slice(
          pagination.pageIndex * pagination.pageSize,
          (pagination.pageIndex + 1) * pagination.pageSize
        )
      );
      setTotalElements(MOCK_GASTOS.length);
      setTotalPages(Math.ceil(MOCK_GASTOS.length / pagination.pageSize));
    }, 200);
  }, [pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    fetchGastos();
  }, [fetchGastos]);

  const filteredData = search
    ? data.filter((e) =>
        e.descricao.toLowerCase().includes(search.toLowerCase())
      )
    : data;

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
              onClick={() => handleDelete(row.original.id)}
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
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount: totalPages,
    manualPagination: true,
  });

  function handleDelete(id: number) {
    setData((prev) => prev.filter((e) => e.id !== id));
    toast.success("Gasto excluído!");
  }

  const total = filteredData.reduce((acc, e) => acc + e.valor, 0);

  return (
    <div className="w-full m-auto space-y-4">
      <EditDrawerModal
        open={!!editing}
        onClose={() => setEditing(null)}
        gasto={editing}
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
            onClick={() => setEditing({} as Gasto)}
            variant="default"
            size="default"
          >
            <IconPlus className="mr-2" size={16} /> Novo gasto
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
            {table.getRowModel().rows.length ? (
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
                  Nenhum gasto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Rodapé responsivo */}
      <div className="w-full px-4 pb-4 mt-1">
        {/* Mobile: Gastos por página + paginação na mesma linha, total exibido embaixo */}
        <div className="flex flex-col gap-1 md:hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Gastos por página</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
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
              {pagination.pageIndex + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={pagination.pageIndex === 0}
            >
              <span className="sr-only">Página anterior</span>
              {"<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={pagination.pageIndex + 1 >= totalPages}
            >
              <span className="sr-only">Próxima página</span>
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
        {/* Desktop: tudo em linha */}
        <div className="hidden md:flex w-full items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Gastos por página</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
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
              Página {pagination.pageIndex + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={pagination.pageIndex === 0}
            >
              <span className="sr-only">Página anterior</span>
              {"<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={pagination.pageIndex + 1 >= totalPages}
            >
              <span className="sr-only">Próxima página</span>
              {">"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
