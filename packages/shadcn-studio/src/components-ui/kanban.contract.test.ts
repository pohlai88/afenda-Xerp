import { describe, expect, expectTypeOf, it } from "vitest";

import {
  KANBAN_PRIMITIVE_ID,
  KANBAN_SLOTS,
  kanbanBoardClassName,
  kanbanPrimitiveMetadata,
  kanbanRootDraggingClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./kanban.contract.js";
import type {
  KanbanBoardProps,
  KanbanRootProps,
  KanbanSlot,
} from "./kanban.js";

describe("kanban primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports KANBAN_PRIMITIVE_ID for metadata registries", () => {
    expect(KANBAN_PRIMITIVE_ID).toBe("shadcn-studio.ui.kanban");
  });

  it("exports KANBAN_SLOTS", () => {
    expect(KANBAN_SLOTS).toEqual({
      root: "kanban",
      board: "kanban-board",
      column: "kanban-column",
      columnHandle: "kanban-column-handle",
      columnContent: "kanban-column-content",
      item: "kanban-item",
      itemHandle: "kanban-item-handle",
      addColumn: "kanban-add-column",
      addItem: "kanban-add-item",
    });
  });

  it("exports governed class constants", () => {
    expect(kanbanBoardClassName).toContain("flex");
    expect(kanbanRootDraggingClassName).toBe("cursor-grabbing!");
  });

  it("kanbanPrimitiveMetadata is JSON-serializable", () => {
    const payload = kanbanPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("KanbanSlot is a governed slot literal union", () => {
    expectTypeOf<KanbanSlot>().toEqualTypeOf<
      | "kanban"
      | "kanban-board"
      | "kanban-column"
      | "kanban-column-handle"
      | "kanban-column-content"
      | "kanban-item"
      | "kanban-item-handle"
      | "kanban-add-column"
      | "kanban-add-item"
    >();
  });

  it("KanbanBoardProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof KanbanBoardProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("KanbanRootProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof KanbanRootProps<{
      id: string;
    }>
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
