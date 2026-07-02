import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  Kanban,
  KanbanAddColumn,
  KanbanAddItem,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
} from "../../components-ui/kanban.js";

type Task = {
  id: string;
  title: string;
};

describe("kanban interaction", () => {
  it("adds a card through KanbanAddItem confirm flow", async () => {
    const user = setupUser();

    function Fixture() {
      const [columns, setColumns] = useState<Record<string, Task[]>>({
        todo: [],
      });

      return (
        <Kanban
          getItemValue={(item) => item.id}
          onValueChange={setColumns}
          value={columns}
        >
          <KanbanBoard>
            <KanbanColumn value="todo">
              <KanbanColumnContent value="todo">
                {(columns["todo"] ?? []).map((task) => (
                  <KanbanItem key={task.id} value={task.id}>
                    {task.title}
                  </KanbanItem>
                ))}
                <KanbanAddItem
                  onAdd={(title) => {
                    setColumns((prev) => ({
                      ...prev,
                      todo: [
                        ...(prev["todo"] ?? []),
                        { id: "new-task", title },
                      ],
                    }));
                  }}
                />
              </KanbanColumnContent>
            </KanbanColumn>
          </KanbanBoard>
        </Kanban>
      );
    }

    render(<Fixture />);

    await user.click(screen.getByRole("button", { name: /add new item/i }));
    await user.type(screen.getByPlaceholderText("Add Content..."), "New card");
    await user.click(screen.getByRole("button", { name: /add card/i }));

    expect(screen.getByText("New card")).toBeInTheDocument();
  });

  it("calls onAdd when add column flow completes", async () => {
    const user = setupUser();
    const onAdd = vi.fn();

    render(
      <Kanban
        getItemValue={() => "x"}
        onValueChange={() => {}}
        value={{ todo: [] }}
      >
        <KanbanBoard>
          <KanbanColumn value="todo">
            <KanbanColumnContent value="todo" />
          </KanbanColumn>
        </KanbanBoard>
        <KanbanAddColumn onAdd={onAdd} />
      </Kanban>
    );

    await user.click(screen.getByRole("button", { name: /add new column/i }));
    await user.type(
      screen.getByPlaceholderText("Add Column Title..."),
      "Review"
    );
    await user.click(screen.getByRole("button", { name: /^add$/i }));

    expect(onAdd).toHaveBeenCalledWith("Review");
  });

  it("supports custom onMove without automatic reorder side effects", async () => {
    const onMove = vi.fn();
    const onValueChange = vi.fn();

    render(
      <Kanban
        getItemValue={(item) => item.id}
        onMove={onMove}
        onValueChange={onValueChange}
        value={{
          todo: [{ id: "a", title: "A" }],
          done: [{ id: "b", title: "B" }],
        }}
      >
        <KanbanBoard>
          <KanbanColumn value="todo">
            <KanbanColumnContent value="todo">
              <KanbanItem value="a">A</KanbanItem>
            </KanbanColumnContent>
          </KanbanColumn>
          <KanbanColumn value="done">
            <KanbanColumnContent value="done">
              <KanbanItem value="b">B</KanbanItem>
            </KanbanColumnContent>
          </KanbanColumn>
        </KanbanBoard>
      </Kanban>
    );

    expect(onValueChange).not.toHaveBeenCalled();
    expect(onMove).not.toHaveBeenCalled();
  });

  it("exposes button triggers for add column and add item flows", () => {
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
      screen.getByRole("button", { name: /add new column/i })
    ).toHaveAttribute("type", "button");
    expect(
      screen.getByRole("button", { name: /add new item/i })
    ).toHaveAttribute("type", "button");
  });

  it("marks invalid column input with aria-invalid when validate fails", async () => {
    const user = setupUser();

    render(
      <Kanban
        getItemValue={() => "x"}
        onValueChange={() => {}}
        value={{ todo: [] }}
      >
        <KanbanBoard>
          <KanbanColumn value="todo">
            <KanbanColumnContent value="todo" />
          </KanbanColumn>
        </KanbanBoard>
        <KanbanAddColumn
          onAdd={() => {}}
          validate={(title) =>
            title.toLowerCase() === "duplicate" ? "Already exists." : undefined
          }
        />
      </Kanban>
    );

    await user.click(screen.getByRole("button", { name: /add new column/i }));
    const input = screen.getByPlaceholderText("Add Column Title...");
    await user.type(input, "duplicate");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Already exists.")).toBeInTheDocument();
  });

  it("decorates plus icons as aria-hidden in add triggers", () => {
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

    for (const icon of document.querySelectorAll("svg[aria-hidden='true']")) {
      expect(icon).toBeInTheDocument();
    }
  });
});
