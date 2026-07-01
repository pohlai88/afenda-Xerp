import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { DollarSignIcon } from "lucide-react";
import { describe, expect, it } from "vitest";
import LoginPage04 from "../../components-auth-shell/login-page-04/login-page-04.js";
import { AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE } from "../../meta-contracts/block-slot-dom-marker.contract.js";
import { BLOCK_METADATA_REGISTRY } from "../../meta-gates/block-metadata.registry.js";
import AccountSettings01 from "../account-settings-01/account-settings-01.js";
import DatatableInvoice from "../datatable-invoice.js";
import DatatableProduct from "../datatable-product.js";
import DatatableUser from "../datatable-user.js";
import ErrorPageShellBlock from "../error-page-shell.js";
import HeroSection01 from "../hero-section-01/hero-section-01.js";
import StatisticsCard01 from "../statistics-card-01.js";

function expectBlockSlotMarkers(blockId: string) {
  const metadata = BLOCK_METADATA_REGISTRY.find(
    (entry) => entry.blockId === blockId
  );

  expect(metadata).toBeDefined();

  for (const slotId of Object.values(metadata?.slots ?? {})) {
    expect(
      document.querySelector(`[${AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE}="${slotId}"]`)
    ).toBeInTheDocument();
  }
}

describe("metadata-bound blocks render", () => {
  it("renders login-page-04 with governed afenda slot markers", () => {
    render(<LoginPage04 />);
    expectBlockSlotMarkers("login-page-04");
  });

  it("renders hero-section-01 with governed afenda slot markers", () => {
    render(<HeroSection01 />);
    expectBlockSlotMarkers("hero-section-01");
  });

  it("renders statistics-card-01 with governed afenda slot markers", () => {
    render(
      <StatisticsCard01
        changePercentage="+12%"
        icon={<DollarSignIcon aria-hidden />}
        title="Total revenue"
        value="$24,780"
      />
    );
    expectBlockSlotMarkers("statistics-card-01");
  });

  it("renders account-settings-01 with governed afenda slot markers", () => {
    render(<AccountSettings01 />);
    expectBlockSlotMarkers("account-settings-01");
  });

  it("renders datatable-invoice with governed afenda slot markers", () => {
    render(
      <DatatableInvoice
        data={[
          {
            id: "inv-1",
            status: "paid",
            avatar: "",
            fallback: "AC",
            client: "Acme Corp",
            field: "Design",
            total: 1200,
            balance: 0,
            issuedDate: new Date("2026-01-15"),
          },
        ]}
      />
    );
    expectBlockSlotMarkers("datatable-invoice");
  });

  it("renders datatable-user with governed afenda slot markers", () => {
    render(
      <DatatableUser
        data={[
          {
            id: "usr-1",
            avatar: "",
            fallback: "JD",
            user: "Jane Doe",
            email: "jane@example.com",
            role: "admin",
            plan: "enterprise",
            billing: "auto-debit",
            status: "active",
          },
        ]}
      />
    );
    expectBlockSlotMarkers("datatable-user");
  });

  it("renders datatable-product with governed afenda slot markers", () => {
    render(
      <DatatableProduct
        data={[
          {
            id: "prd-1",
            productImage: "",
            product: "Studio Headphones",
            brand: "Acme Audio",
            category: "headphone",
            stock: "available",
            amount: 199,
            quantity: 42,
            status: "publish",
          },
        ]}
      />
    );
    expectBlockSlotMarkers("datatable-product");
  });

  it("renders error-page-shell with governed afenda slot markers", () => {
    render(<ErrorPageShellBlock />);
    expectBlockSlotMarkers("error-page-shell");
  });
});
