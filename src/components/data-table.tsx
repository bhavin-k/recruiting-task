"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Schema } from "../../static-data/schema";
import { DataTablePagination } from "./data-table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/Table-Wrapper";

export const tagsColor = {
  science: {
    badge:
      "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20 hover:bg-[#10b981]/10",
    dot: "bg-[#10b981]",
  },
  math: {
    badge:
      "text-[#0ea5e9] bg-[#0ea5e9]/10 border-[#0ea5e9]/20 hover:bg-[#0ea5e9]/10",
    dot: "bg-[#0ea5e9]",
  },
  literature: {
    badge:
      "text-[#ec4899] bg-[#ec4899]/10 border-[#ec4899]/20 hover:bg-[#ec4899]/10",
    dot: "bg-[#ec4899]",
  },
  history: {
    badge:
      "text-[#eab308] bg-[#eab308]/10 border-[#eab308]/20 hover:bg-[#eab308]/10",
    dot: "bg-[#eab308]",
  },
} as Record<string, Record<"badge" | "dot", string>>;

export const columns: ColumnDef<Schema>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "regions",
    header: "Regions",
    cell: ({ row }) => (
      <div className="flex">
        {(row.getValue("regions") as string[]).map(
          (region: string, index: number) => (
            <div key={region}>
              {region}
              {index + 1 === (row.getValue("regions") as string[]).length
                ? " "
                : ","}{" "}
            </div>
          )
        )}
      </div>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div>
        {(row.getValue("tags") as string[]).map((tag: string) => {
          // Define default styles for the badge and dot
          let badgeStyle = "badge p-2 m-2 rounded-full";
          let dotStyle = "";

          // Check if the tag exists in tagsColor object
          if (tagsColor[tag]) {
            badgeStyle += ` ${tagsColor[tag].badge}`;
            dotStyle = tagsColor[tag].dot;
          }

          return (
            <span key={tag} className={badgeStyle}>
              <span className={dotStyle}></span>
              {tag}
            </span>
          );
        })}
      </div>
    ),
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => (
      <div>
        {row.getValue("active") ? (
          <span style={{ color: "black", fontWeight: "bold" }}> ✓</span>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    accessorKey: "public",
    header: "Public",
    cell: ({ row }) => (
      <div>
        {row.getValue("public") ? (
          <span style={{ color: "black", fontWeight: "bold" }}> ✓</span>
        ) : (
          "-"
        )}
      </div>
    ),
  },
];

interface DataTableProps {
  tableData: Schema[];
}

export function DataTable({ tableData }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full ml-3">
      <div className="flex items-center py-4">
        {/* Only filter by name */}
        <Input
          placeholder="Filter by Name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
