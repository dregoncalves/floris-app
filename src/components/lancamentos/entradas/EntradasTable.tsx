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
  IconCircleCheckFilled,
  IconClock,
  IconCoins,
  IconBriefcase,
  IconBulb,
  IconQuestionMark,
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

// -------------- DatePickerRecebimento ------------------
function DatePickerRecebimento({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (date: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  // Parse value string to Date object
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
                // Converte para "YYYY-MM-DD"
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
type Entrada = {
  id: number;
  descricao: string;
  valor: number;
  dataRecebimento: string;
  tipo: string;
  recorrente: boolean;
};

const MOCK_ENTRADAS: Entrada[] = [
  {
    id: 1,
    descricao: "Salário",
    valor: 1490,
    dataRecebimento: "2025-06-10",
    tipo: "SALARIO",
    recorrente: true,
  },
  {
    id: 2,
    descricao: "Freelance",
    valor: 400,
    dataRecebimento: "2025-06-15",
    tipo: "FREELA",
    recorrente: false,
  },
  {
    id: 3,
    descricao: "Dividendos",
    valor: 120,
    dataRecebimento: "2025-06-20",
    tipo: "RENDA_EXTRA",
    recorrente: false,
  },
  {
    id: 4,
    descricao: "Reembolso",
    valor: 75.9,
    dataRecebimento: "2025-06-25",
    tipo: "OUTROS",
    recorrente: false,
  },
];

// Badge de status (ícone no mobile, badge no desktop)
function StatusBadge({ recorrente }: { recorrente: boolean }) {
  return (
    <>
      {/* Ícone só no mobile */}
      <span className="md:hidden flex items-center justify-center">
        {recorrente ? (
          <IconCircleCheckFilled className="text-[var(--primary)]" size={18} />
        ) : (
          <IconClock className="text-muted-foreground" size={18} />
        )}
      </span>
      {/* Badge no desktop */}
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
            />
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
            <IconClock className="text-muted-foreground" size={15} />
            Única vez
          </Badge>
        )}
      </span>
    </>
  );
}

// Badge de tipo (ícone no mobile, badge no desktop)
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
  entrada,
}: {
  open: boolean;
  onClose: () => void;
  entrada: Entrada | null;
}) {
  // Controle local para os campos (inclui data controlada)
  const [editData, setEditData] = React.useState({
    ...entrada,
    dataRecebimento: entrada?.dataRecebimento ?? "",
  });

  // Atualiza quando abrir um novo item
  React.useEffect(() => {
    if (entrada)
      setEditData({
        ...entrada,
        dataRecebimento: entrada.dataRecebimento ?? "",
      });
  }, [entrada]);

  if (!open || !entrada) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
      <div className="bg-background rounded-2xl w-full max-w-md sm:max-w-sm mx-auto p-6 shadow-2xl animate-in fade-in slide-in-from-top-10 border relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Editar entrada</h2>
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
            toast.success("Entrada atualizada (mock)!");
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
          <DatePickerRecebimento
            value={editData.dataRecebimento}
            onChange={(val) =>
              setEditData((old) => ({ ...old, dataRecebimento: val }))
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={editData.tipo}
                onValueChange={(val) =>
                  setEditData((old) => ({ ...old, tipo: val }))
                }
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
                  setEditData((old) => ({
                    ...old,
                    recorrente: val === "recorrente",
                  }))
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

// ----------- Tabela principal --------------------------
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

export default function EntradasTable() {
  const [data, setData] = React.useState<Entrada[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalElements, setTotalElements] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Drawer/modal state
  const [editing, setEditing] = React.useState<Entrada | null>(null);

  // MOCK do fetch
  const fetchEntradas = React.useCallback(() => {
    setTimeout(() => {
      setData(
        MOCK_ENTRADAS.slice(
          pagination.pageIndex * pagination.pageSize,
          (pagination.pageIndex + 1) * pagination.pageSize
        )
      );
      setTotalElements(MOCK_ENTRADAS.length);
      setTotalPages(Math.ceil(MOCK_ENTRADAS.length / pagination.pageSize));
    }, 200);
  }, [pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    fetchEntradas();
  }, [fetchEntradas]);

  const filteredData = search
    ? data.filter((e) =>
        e.descricao.toLowerCase().includes(search.toLowerCase())
      )
    : data;

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
    toast.success("Entrada excluída!");
  }

  const total = filteredData.reduce((acc, e) => acc + e.valor, 0);

  return (
    <div className="w-full m-auto space-y-4">
      <EditDrawerModal
        open={!!editing}
        onClose={() => setEditing(null)}
        entrada={editing}
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
            onClick={() => setEditing({} as Entrada)}
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
                  Nenhuma entrada encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Rodapé responsivo */}
      <div className="w-full px-4 pb-4 mt-1">
        {/* Mobile: Entradas por página + paginação na mesma linha, total exibido embaixo */}
        <div className="flex flex-col gap-1 md:hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Entradas por página</span>
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
            {/* Paginação no mobile */}
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
            <span className="text-sm font-medium">Entradas por página</span>
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
