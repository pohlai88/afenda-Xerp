import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import {
  Kanban,
  KanbanAddColumn,
  KanbanAddItem,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
} from "./kanban.js";

type Task = {
  id: string;
  title: string;
};

const initialColumns: Record<string, Task[]> = {
  backlog: [
    { id: "task-1", title: "Review purchase order" },
    { id: "task-2", title: "Update inventory forecast" },
  ],
  progress: [{ id: "task-3", title: "Approve vendor quote" }],
  done: [{ id: "task-4", title: "Close month-end batch" }],
};

function KanbanLabFixture() {
  const [columns, setColumns] = useState(initialColumns);
  const [columnTitles, setColumnTitles] = useState({
    backlog: "Backlog",
    progress: "In Progress",
    done: "Done",
  });

  return (
    <Kanban
      className="w-full max-w-5xl"
      getItemValue={(item) => item.id}
      onValueChange={setColumns}
      value={columns}
    >
      <KanbanBoard>
        {Object.keys(columns).map((columnId) => (
          <KanbanColumn
            className="w-72 shrink-0"
            key={columnId}
            value={columnId}
          >
            <div className="mb-2 px-2 font-medium text-sm">
              {columnTitles[columnId as keyof typeof columnTitles] ?? columnId}
            </div>
            <KanbanColumnContent
              className="flex flex-col gap-2 px-2"
              value={columnId}
            >
              {(columns[columnId] ?? []).map((task) => (
                <KanbanItem
                  className="rounded-md border bg-card p-3 text-sm shadow-xs"
                  key={task.id}
                  value={task.id}
                >
                  {task.title}
                </KanbanItem>
              ))}
              <KanbanAddItem
                onAdd={(title) => {
                  setColumns((prev) => ({
                    ...prev,
                    [columnId]: [
                      ...(prev[columnId] ?? []),
                      { id: `task-${Date.now()}`, title },
                    ],
                  }));
                }}
              />
            </KanbanColumnContent>
          </KanbanColumn>
        ))}
      </KanbanBoard>
      <KanbanAddColumn
        onAdd={(title) => {
          const id = title.toLowerCase().replace(/\s+/g, "-");
          setColumnTitles((prev) => ({ ...prev, [id]: title }));
          setColumns((prev) => ({ ...prev, [id]: [] }));
        }}
      />
    </Kanban>
  );
}

const meta = {
  component: KanbanLabFixture,
  tags: ["autodocs", "colocated"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof KanbanLabFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
