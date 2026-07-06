import type { ColumnDef } from "@tanstack/react-table";

import type { ProcurementPurchaseOrderTableRow } from "./procurement-purchase-order-table-row";

export const procurementPurchaseOrderTableColumnDefs: ColumnDef<
  ProcurementPurchaseOrderTableRow,
  unknown
>[] = [
  {
    accessorKey: "id",
    cell: ({ row }) => row.original.id,
    header: "PO #",
    id: "id",
  },
  {
    accessorKey: "vendor",
    cell: ({ row }) => row.original.vendor,
    header: "Vendor",
    id: "vendor",
  },
  {
    accessorKey: "status",
    cell: ({ row }) => row.original.status,
    header: "Status",
    id: "status",
  },
  {
    accessorKey: "total",
    cell: ({ row }) => row.original.total,
    header: "Total",
    id: "total",
  },
  {
    accessorKey: "orderDate",
    cell: ({ row }) => row.original.orderDate,
    header: "Ordered",
    id: "orderDate",
  },
  {
    accessorKey: "deliveryDate",
    cell: ({ row }) => row.original.deliveryDate,
    header: "Delivery",
    id: "deliveryDate",
  },
];
