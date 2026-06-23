import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutGridIcon,
  ListIcon,
  MinusIcon,
  PlusIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../button";
import { ButtonGroup, ButtonGroupText } from "../button-group";

export function SegmentedFilter({
  options,
  defaultValue,
}: {
  readonly options: readonly string[];
  readonly defaultValue: string;
}) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <ButtonGroup>
      {options.map((option) => (
        <Button
          emphasis={selected === option ? "outline" : "ghost"}
          intent={selected === option ? "primary" : "secondary"}
          key={option}
          onClick={() => setSelected(option)}
          size="sm"
        >
          {option}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export function QuantityStepper({
  initial = 1,
  min = 1,
  max = 99,
}: {
  readonly initial?: number;
  readonly min?: number;
  readonly max?: number;
}) {
  const [qty, setQty] = useState(initial);

  return (
    <ButtonGroup>
      <Button
        aria-label="Decrease quantity"
        disabled={qty <= min}
        emphasis="outline"
        intent="secondary"
        onClick={() => setQty((current) => Math.max(min, current - 1))}
        presentation="icon"
        size="sm"
      >
        <MinusIcon />
      </Button>
      <ButtonGroupText aria-live="polite">{qty}</ButtonGroupText>
      <Button
        aria-label="Increase quantity"
        disabled={qty >= max}
        emphasis="outline"
        intent="secondary"
        onClick={() => setQty((current) => Math.min(max, current + 1))}
        presentation="icon"
        size="sm"
      >
        <PlusIcon />
      </Button>
    </ButtonGroup>
  );
}

export function ZoomControl({ initial = 100 }: { readonly initial?: number }) {
  const [zoom, setZoom] = useState(initial);

  return (
    <ButtonGroup>
      <Button
        aria-label="Zoom out"
        disabled={zoom <= 50}
        emphasis="outline"
        intent="secondary"
        onClick={() => setZoom((current) => Math.max(50, current - 10))}
        presentation="icon"
        size="sm"
      >
        <ZoomOutIcon />
      </Button>
      <ButtonGroupText>{zoom}%</ButtonGroupText>
      <Button
        aria-label="Zoom in"
        disabled={zoom >= 200}
        emphasis="outline"
        intent="secondary"
        onClick={() => setZoom((current) => Math.min(200, current + 10))}
        presentation="icon"
        size="sm"
      >
        <ZoomInIcon />
      </Button>
    </ButtonGroup>
  );
}

export function InteractiveViewToggle() {
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <ButtonGroup aria-label="Record view mode">
      <Button
        aria-label="List view"
        aria-pressed={view === "list"}
        emphasis={view === "list" ? "outline" : "ghost"}
        intent={view === "list" ? "primary" : "secondary"}
        onClick={() => setView("list")}
        presentation="icon"
        size="sm"
      >
        <ListIcon />
      </Button>
      <Button
        aria-label="Grid view"
        aria-pressed={view === "grid"}
        emphasis={view === "grid" ? "outline" : "ghost"}
        intent={view === "grid" ? "primary" : "secondary"}
        onClick={() => setView("grid")}
        presentation="icon"
        size="sm"
      >
        <LayoutGridIcon />
      </Button>
    </ButtonGroup>
  );
}

export function InteractivePagination({
  page = 3,
  total = 12,
}: {
  readonly page?: number;
  readonly total?: number;
}) {
  const [current, setCurrent] = useState(page);

  return (
    <ButtonGroup>
      <Button
        aria-label="Previous page"
        disabled={current <= 1}
        emphasis="outline"
        intent="secondary"
        onClick={() => setCurrent((p) => Math.max(1, p - 1))}
        presentation="icon"
        size="sm"
      >
        <ChevronLeftIcon />
      </Button>
      <ButtonGroupText aria-live="polite">
        Page {current} of {total}
      </ButtonGroupText>
      <Button
        aria-label="Next page"
        disabled={current >= total}
        emphasis="outline"
        intent="secondary"
        onClick={() => setCurrent((p) => Math.min(total, p + 1))}
        presentation="icon"
        size="sm"
      >
        <ChevronRightIcon />
      </Button>
    </ButtonGroup>
  );
}
