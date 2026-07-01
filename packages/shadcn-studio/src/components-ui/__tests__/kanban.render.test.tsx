import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { KANBAN_SLOTS } from "../kanban.contract.js";
import {
  Kanban,
  KanbanAddColumn,
  KanbanAddItem,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
} from "../kanban.js";

type Task = {
  id: string;
  title: string;
};

const seedColumns: Record<string, Task[]> = {
  todo: [{ id: "a", title: "Task A" }],
  done: [{ id: "b", title: "Task B" }],
};

function KanbanRenderFixture({
  initial = seedColumns,
}: {
  initial?: Record<string, Task[]>;
}) {
  const [columns, setColumns] = useState(initial);

  return (
    <Kanban
      getItemValue={(item) => item.id}
      onValueChange={setColumns}
      value={columns}
    >
      <KanbanBoard>
        {Object.keys(columns).map((columnId) => (
          <KanbanColumn key={columnId} value={columnId}>
            <KanbanColumnContent value={columnId}>
              {(columns[columnId] ?? []).map((task) => (
                <KanbanItem key={task.id} value={task.id}>
                  {task.title}
                </KanbanItem>
              ))}
            </KanbanColumnContent>
          </KanbanColumn>
        ))}
      </KanbanBoard>
    </Kanban>
  );
}

describe("kanban render", () => {
  it("renders governed root, board, column, content, and item slots", () => {
    render(<KanbanRenderFixture />);

    expect(
      document.querySelector(`[data-slot="${KANBAN_SLOTS.root}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${KANBAN_SLOTS.board}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll(`[data-slot="${KANBAN_SLOTS.column}"]`)
    ).toHaveLength(2);
    expect(
      document.querySelectorAll(`[data-slot="${KANBAN_SLOTS.columnContent}"]`)
    ).toHaveLength(2);
    expect(
      document.querySelectorAll(`[data-slot="${KANBAN_SLOTS.item}"]`)
    ).toHaveLength(2);
  });

  it("uses getItemValue for item identity", () => {
    render(<KanbanRenderFixture />);

    expect(
      document.querySelector('[data-slot="kanban-item"][data-value="a"]')
    ).toHaveTextContent("Task A");
    expect(
      document.querySelector('[data-slot="kanban-item"][data-value="b"]')
    ).toHaveTextContent("Task B");
  });

  it("does not render app-store or zustand-specific markers", () => {
    const { container } = render(<KanbanRenderFixture />);

    expect(container.innerHTML).not.toContain("useKanbanStore");
    expect(container.innerHTML).not.toContain("fake-db");
  });
});

describe("kanban add controls render", () => {
  it("renders add column and add item trigger slots", () => {
    render(
      <Kanban
        getItemValue={() => "x"}
        onValueChange={() => {}}
        value={{ todo: [] }}
      >
        <KanbanBoard>
          <KanbanColumn value="todo">
            <KanbanColumnContent value="todo">
              <KanbanAddItem onAdd={() => {}} />
            </KanbanColumnContent>
          </KanbanColumn>
        </KanbanBoard>
        <KanbanAddColumn onAdd={() => {}} />
      </Kanban>
    );

    expect(
      document.querySelectorAll(`[data-slot="${KANBAN_SLOTS.addItem}"]`)
    ).toHaveLength(1);
    expect(
      document.querySelectorAll(`[data-slot="${KANBAN_SLOTS.addColumn}"]`)
    ).toHaveLength(1);
  });
});
