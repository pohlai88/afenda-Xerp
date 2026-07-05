import type {
  AdminUsersPageData,
  LabPromotionNote,
  LabRouteLoader,
} from "./contracts";

export const adminUsersPromotionNote = {
  futureErpPath: "apps/erp/src/lib/system-admin/load-users-page.server.ts",
  futureDataSource: "internal-bff",
  notes:
    "Promote this list surface into ERP once the governed internal user directory contract exists under api/internal/v1.",
} satisfies LabPromotionNote;

const demoAdminUsersPageData = {
  title: "User directory review surface",
  description:
    "List-style route proving table density and operator controls without building a fake sandbox API.",
  promotionSummary:
    "The current table rows are plain fixtures shaped like future ERP records. No mock transport layer is introduced here.",
  promotion: adminUsersPromotionNote,
  users: [
    {
      id: "user-001",
      avatar: "https://i.pravatar.cc/128?img=1",
      fallback: "AL",
      user: "Aisyah Lim",
      email: "aisyah.lim@afenda.dev",
      role: "admin",
      plan: "enterprise",
      billing: "auto-debit",
      status: "active",
    },
    {
      id: "user-002",
      avatar: "https://i.pravatar.cc/128?img=5",
      fallback: "SN",
      user: "Suresh Nadar",
      email: "suresh.nadar@afenda.dev",
      role: "maintainer",
      plan: "team",
      billing: "manual-cash",
      status: "active",
    },
    {
      id: "user-003",
      avatar: "https://i.pravatar.cc/128?img=8",
      fallback: "MC",
      user: "Maya Chan",
      email: "maya.chan@afenda.dev",
      role: "editor",
      plan: "company",
      billing: "manual-paypal",
      status: "pending",
    },
    {
      id: "user-004",
      avatar: "https://i.pravatar.cc/128?img=11",
      fallback: "JK",
      user: "Jon Kerr",
      email: "jon.kerr@afenda.dev",
      role: "author",
      plan: "basic",
      billing: "auto-debit",
      status: "inactive",
    },
    {
      id: "user-005",
      avatar: "https://i.pravatar.cc/128?img=15",
      fallback: "RF",
      user: "Rina Farid",
      email: "rina.farid@afenda.dev",
      role: "subscriber",
      plan: "team",
      billing: "manual-cash",
      status: "active",
    },
    {
      id: "user-006",
      avatar: "https://i.pravatar.cc/128?img=20",
      fallback: "DL",
      user: "Daniel Lee",
      email: "daniel.lee@afenda.dev",
      role: "editor",
      plan: "company",
      billing: "auto-debit",
      status: "pending",
    },
  ],
} satisfies AdminUsersPageData;

export const loadAdminUsersPage: LabRouteLoader<
  AdminUsersPageData
> = async () => demoAdminUsersPageData;
