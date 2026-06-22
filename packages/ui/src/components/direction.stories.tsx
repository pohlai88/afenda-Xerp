import type { Meta, StoryObj } from "@storybook/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  BuildingIcon,
  CheckIcon,
  GlobeIcon,
  SettingsIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import React, { Fragment, type ReactNode, useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { Button } from "./button";
import { DirectionProvider, useDirection } from "./direction";
import { Input } from "./input";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Separator } from "./separator";
import { Switch } from "./switch";

// ─── Helpers ───────────────────────────────────────────────────────────────

type DirectionValue = "ltr" | "rtl";

function DirectionReadout() {
  const direction = useDirection();

  return (
    <Badge emphasis="soft" size="sm" tone="info">
      dir: {direction}
    </Badge>
  );
}

function DirectionShell({
  children,
  dir = "ltr",
  footer,
  header,
  width = "md",
}: {
  readonly children: ReactNode;
  readonly dir?: DirectionValue;
  readonly footer?: ReactNode;
  readonly header?: ReactNode;
  readonly width?: "sm" | "md" | "lg" | "xl";
}) {
  return (
    <StoryFrame width={width}>
      <DirectionProvider dir={dir}>
        <StoryStack
          className="rounded-lg border border-border"
          gap="sm"
          padding="lg"
        >
          {header}
          {children}
          {footer}
        </StoryStack>
      </DirectionProvider>
    </StoryFrame>
  );
}

function DefinitionRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <StoryRow align="center" justify="between">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium text-sm">{value}</span>
    </StoryRow>
  );
}

function RtlBreadcrumbTrail({
  items,
}: {
  readonly items: readonly { readonly label: string; readonly href?: string }[];
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${String(index)}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function LocaleToggleDemo() {
  const [dir, setDir] = useState<DirectionValue>("ltr");

  return (
    <StoryFrame width="md">
      <DirectionProvider dir={dir}>
        <StoryStack
          className="rounded-lg border border-border"
          gap="sm"
          padding="lg"
        >
          <StoryRow align="center" justify="between" wrap>
            <StoryStack gap="xs">
              <span className="font-medium text-sm">
                {dir === "rtl" ? "لوحة التحكم" : "Operations Dashboard"}
              </span>
              <span className="text-muted-foreground text-xs">
                {dir === "rtl"
                  ? "تبديل اتجاه الواجهة للمعاينة"
                  : "Toggle interface direction for preview"}
              </span>
            </StoryStack>
            <DirectionReadout />
          </StoryRow>
          <Separator />
          <DefinitionRow
            label={dir === "rtl" ? "أوامر مفتوحة" : "Open Orders"}
            value="1,284"
          />
          <DefinitionRow
            label={dir === "rtl" ? "فواتير متأخرة" : "Overdue Invoices"}
            value="23"
          />
          <StoryRow gap="sm" justify="end">
            <Button
              emphasis="outline"
              intent="secondary"
              onClick={() =>
                setDir((value) => (value === "ltr" ? "rtl" : "ltr"))
              }
              size="sm"
            >
              <GlobeIcon aria-hidden="true" className="size-4" />
              {dir === "rtl" ? "Switch to English" : "Switch to Arabic"}
            </Button>
          </StoryRow>
        </StoryStack>
      </DirectionProvider>
    </StoryFrame>
  );
}

// ─── Direction ─────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Direction",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Governed Radix direction provider for ERP locale and RTL support. Wrap subtrees with `dir="ltr"` or `dir="rtl"` (alias: `direction`) so nested primitives inherit correct reading order, keyboard traversal, and mirrored layout semantics.',
      },
    },
  },
  argTypes: {
    dir: {
      control: "inline-radio",
      options: ["ltr", "rtl"],
      description: "Document text direction for nested content",
    },
    direction: {
      control: "inline-radio",
      options: ["ltr", "rtl"],
      description: "Alias for `dir`",
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic patterns ────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <DirectionShell
      dir="ltr"
      header={
        <StoryRow align="center" justify="between">
          <span className="font-medium text-sm">
            Purchase Order PO-2026-1184
          </span>
          <DirectionReadout />
        </StoryRow>
      }
    >
      <StoryStack gap="sm">
        <DefinitionRow label="Vendor" value="FastCo Industrial" />
        <DefinitionRow label="Total" value="$12,450.00" />
        <DefinitionRow label="Status" value="Pending Approval" />
      </StoryStack>
    </DirectionShell>
  ),
};

export const Rtl: Story = {
  name: "Direction — RTL",
  render: () => (
    <DirectionShell
      dir="rtl"
      header={
        <StoryRow align="center" justify="between">
          <span className="font-medium text-sm">أمر شراء PO-2026-1184</span>
          <DirectionReadout />
        </StoryRow>
      }
    >
      <StoryStack gap="sm">
        <DefinitionRow label="المورد" value="FastCo Industrial" />
        <DefinitionRow label="الإجمالي" value="$12,450.00" />
        <DefinitionRow label="الحالة" value="قيد الموافقة" />
      </StoryStack>
    </DirectionShell>
  ),
};

export const DirectionPropAlias: Story = {
  name: "Direction — `direction` Prop Alias",
  render: () => (
    <StoryFrame width="md">
      <DirectionProvider dir="ltr" direction="rtl">
        <StoryStack
          className="rounded-lg border border-border"
          gap="sm"
          padding="lg"
        >
          <StoryRow align="center" justify="between">
            <span className="font-medium text-sm">فاتورة INV-2026-0042</span>
            <DirectionReadout />
          </StoryRow>
          <StoryStack gap="sm">
            <span className="text-muted-foreground text-xs">
              `direction="rtl"` overrides `dir="ltr"` when both are supplied.
            </span>
            <DefinitionRow label="المبلغ" value="$4,850.00" />
            <DefinitionRow label="تاريخ الاستحقاق" value="15 يوليو 2026" />
            <DefinitionRow label="الحالة" value="بانتظار الموافقة" />
          </StoryStack>
        </StoryStack>
      </DirectionProvider>
    </StoryFrame>
  ),
};

export const UseDirectionHook: Story = {
  name: "Direction — useDirection Hook",
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <DirectionProvider dir="ltr">
          <StoryStack
            className="rounded-lg border border-border"
            gap="sm"
            padding="lg"
          >
            <StoryRow align="center" justify="between">
              <span className="font-medium text-sm">LTR subtree</span>
              <DirectionReadout />
            </StoryRow>
            <span className="text-muted-foreground text-sm">
              English content inherits left-to-right reading order.
            </span>
          </StoryStack>
        </DirectionProvider>
        <DirectionProvider dir="rtl">
          <StoryStack
            className="rounded-lg border border-border"
            gap="sm"
            padding="lg"
          >
            <StoryRow align="center" justify="between">
              <span className="font-medium text-sm">RTL subtree</span>
              <DirectionReadout />
            </StoryRow>
            <span className="text-muted-foreground text-sm">
              المحتوى العربي يرث اتجاه القراءة من اليمين إلى اليسار.
            </span>
          </StoryStack>
        </DirectionProvider>
      </StoryStack>
    </StoryFrame>
  ),
};

export const LocaleToggle: Story = {
  name: "Direction — Locale Toggle",
  render: () => <LocaleToggleDemo />,
};

export const SideBySideComparison: Story = {
  name: "Direction — LTR vs RTL",
  render: () => (
    <StoryFrame width="xl">
      <StoryRow align="start" gap="lg" wrap>
        <DirectionProvider dir="ltr">
          <StoryStack
            className="min-w-72 flex-1 rounded-lg border border-border"
            gap="sm"
            padding="lg"
          >
            <StoryRow align="center" justify="between">
              <span className="font-medium text-sm">Invoice Summary</span>
              <Badge emphasis="soft" size="sm" tone="neutral">
                LTR
              </Badge>
            </StoryRow>
            <DefinitionRow label="Invoice No." value="INV-2026-0042" />
            <DefinitionRow label="Amount" value="$4,850.00" />
            <StoryRow gap="sm" justify="end">
              <Button emphasis="outline" intent="secondary" size="sm">
                <ArrowLeftIcon aria-hidden="true" className="size-4" />
                Back
              </Button>
              <Button emphasis="solid" intent="primary" size="sm">
                Approve
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </Button>
            </StoryRow>
          </StoryStack>
        </DirectionProvider>
        <DirectionProvider dir="rtl">
          <StoryStack
            className="min-w-72 flex-1 rounded-lg border border-border"
            gap="sm"
            padding="lg"
          >
            <StoryRow align="center" justify="between">
              <span className="font-medium text-sm">ملخص الفاتورة</span>
              <Badge emphasis="soft" size="sm" tone="info">
                RTL
              </Badge>
            </StoryRow>
            <DefinitionRow label="رقم الفاتورة" value="INV-2026-0042" />
            <DefinitionRow label="المبلغ" value="$4,850.00" />
            <StoryRow gap="sm" justify="end">
              <Button emphasis="outline" intent="secondary" size="sm">
                <ArrowRightIcon aria-hidden="true" className="size-4" />
                رجوع
              </Button>
              <Button emphasis="solid" intent="primary" size="sm">
                موافقة
                <ArrowLeftIcon aria-hidden="true" className="size-4" />
              </Button>
            </StoryRow>
          </StoryStack>
        </DirectionProvider>
      </StoryRow>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const ArabicPurchaseOrderHeader: Story = {
  name: "ERP — Arabic Purchase Order Header",
  parameters: { layout: "padded" },
  render: () => (
    <DirectionShell
      dir="rtl"
      header={
        <StoryStack gap="xs">
          <RtlBreadcrumbTrail
            items={[
              { href: "#", label: "المشتريات" },
              { href: "#", label: "أوامر الشراء" },
              { label: "PO-2026-1184" },
            ]}
          />
          <StoryRow align="center" gap="sm">
            <h2 className="font-heading font-semibold text-lg">
              أمر شراء PO-2026-1184
            </h2>
            <Badge emphasis="soft" size="sm" tone="warning">
              قيد الموافقة
            </Badge>
          </StoryRow>
        </StoryStack>
      }
      width="lg"
    >
      <StoryStack gap="sm">
        <DefinitionRow label="المورد" value="FastCo Industrial" />
        <DefinitionRow label="طلب بواسطة" value="Jane Doe" />
        <DefinitionRow label="الإجمالي" value="$12,450.00" />
      </StoryStack>
    </DirectionShell>
  ),
};

export const RtlBreadcrumbNavigation: Story = {
  name: "ERP — RTL Breadcrumb Navigation",
  parameters: { layout: "padded" },
  render: () => (
    <DirectionShell dir="rtl" width="lg">
      <StoryStack gap="sm">
        <RtlBreadcrumbTrail
          items={[
            { href: "#", label: "الرئيسية" },
            { href: "#", label: "المالية" },
            { href: "#", label: "الذمم الدائنة" },
            { label: "INV-2026-0042" },
          ]}
        />
        <span className="text-muted-foreground text-sm">
          مسار التنقل يعكس ترتيب القراءة RTL داخل شجرة ERP.
        </span>
      </StoryStack>
    </DirectionShell>
  ),
};

export const ArabicInvoiceSummary: Story = {
  name: "ERP — Arabic Invoice Summary",
  parameters: { layout: "padded" },
  render: () => (
    <DirectionShell
      dir="rtl"
      footer={
        <StoryRow gap="sm" justify="between" wrap>
          <span className="font-semibold text-sm">الإجمالي: $4,850.00</span>
          <StoryRow gap="sm">
            <Button emphasis="outline" intent="secondary" size="sm">
              رفض
            </Button>
            <Button emphasis="solid" intent="primary" size="sm">
              <CheckIcon aria-hidden="true" className="size-4" />
              اعتماد
            </Button>
          </StoryRow>
        </StoryRow>
      }
      header={
        <StoryRow align="center" justify="between">
          <span className="font-medium text-sm">INV-2026-0042</span>
          <Badge emphasis="soft" size="sm" tone="warning">
            بانتظار الموافقة
          </Badge>
        </StoryRow>
      }
      width="md"
    >
      <StoryStack gap="sm">
        <DefinitionRow label="المورد" value="Acme Software Ltd." />
        <DefinitionRow label="تاريخ الإصدار" value="21 يونيو 2026" />
        <DefinitionRow label="تاريخ الاستحقاق" value="15 يوليو 2026" />
        <DefinitionRow label="المبلغ" value="$4,850.00" />
      </StoryStack>
    </DirectionShell>
  ),
};

export const RtlFormFields: Story = {
  name: "ERP — RTL Form Fields",
  parameters: { layout: "padded" },
  render: () => (
    <DirectionShell dir="rtl" width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <Label htmlFor="rtl-vendor">اسم المورد</Label>
          <Input defaultValue="FastCo Industrial" id="rtl-vendor" />
        </StoryStack>
        <StoryStack gap="xs">
          <Label htmlFor="rtl-amount">المبلغ</Label>
          <Input defaultValue="12450" id="rtl-amount" type="number" />
        </StoryStack>
        <StoryStack gap="xs">
          <Label>القسم</Label>
          <Select defaultValue="ops">
            <SelectTrigger>
              <SelectValue placeholder="اختر القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="finance">المالية</SelectItem>
              <SelectItem value="ops">العمليات</SelectItem>
              <SelectItem value="hr">الموارد البشرية</SelectItem>
            </SelectContent>
          </Select>
        </StoryStack>
        <StoryRow gap="sm" justify="end">
          <Button emphasis="ghost" intent="secondary" size="sm">
            إلغاء
          </Button>
          <Button emphasis="solid" intent="primary" size="sm">
            حفظ
          </Button>
        </StoryRow>
      </StoryStack>
    </DirectionShell>
  ),
};

export const ArabicEmployeeProfile: Story = {
  name: "ERP — Arabic Employee Profile",
  parameters: { layout: "padded" },
  render: () => (
    <DirectionShell
      dir="rtl"
      header={
        <StoryRow align="center" gap="sm">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <UserIcon
              aria-hidden="true"
              className="size-5 text-muted-foreground"
            />
          </div>
          <StoryStack gap="xs">
            <span className="font-medium text-sm">Jane Doe</span>
            <span className="text-muted-foreground text-xs">EMP-1042</span>
          </StoryStack>
        </StoryRow>
      }
      width="md"
    >
      <StoryStack gap="sm">
        <DefinitionRow label="القسم" value="المالية" />
        <DefinitionRow label="المسمى الوظيفي" value="مدير مالي" />
        <DefinitionRow label="البريد الإلكتروني" value="jane.doe@company.com" />
        <DefinitionRow label="الحالة" value="نشط" />
      </StoryStack>
    </DirectionShell>
  ),
};

export const RtlApprovalBar: Story = {
  name: "ERP — RTL Approval Actions",
  parameters: { layout: "padded" },
  render: () => (
    <DirectionShell dir="rtl" width="lg">
      <StoryStack gap="sm">
        <StoryRow align="center" justify="between" wrap>
          <StoryStack gap="xs">
            <span className="font-medium text-sm">PO-2026-1184</span>
            <span className="text-muted-foreground text-xs">
              مطلوب اعتمادك — $12,450.00
            </span>
          </StoryStack>
          <Badge emphasis="soft" size="sm" tone="warning">
            عاجل
          </Badge>
        </StoryRow>
        <StoryRow gap="sm" justify="start">
          <Button emphasis="solid" intent="primary" size="sm">
            <CheckIcon aria-hidden="true" className="size-4" />
            اعتماد
          </Button>
          <Button emphasis="outline" intent="secondary" size="sm">
            <XIcon aria-hidden="true" className="size-4" />
            رفض
          </Button>
          <Button emphasis="ghost" intent="secondary" size="sm">
            طلب توضيح
          </Button>
        </StoryRow>
      </StoryStack>
    </DirectionShell>
  ),
};

export const LocaleSettingsPanel: Story = {
  name: "ERP — Locale Settings",
  parameters: { layout: "padded" },
  render: () => (
    <DirectionShell
      header={
        <StoryRow align="center" gap="sm">
          <SettingsIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          <span className="font-medium text-sm">Language & Region</span>
        </StoryRow>
      }
      width="md"
    >
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <Label>Interface language</Label>
          <Select defaultValue="en">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English (LTR)</SelectItem>
              <SelectItem value="ar">Arabic (RTL)</SelectItem>
            </SelectContent>
          </Select>
        </StoryStack>
        <StoryRow align="center" justify="between">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">Right-to-left layout</span>
            <span className="text-muted-foreground text-xs">
              Mirror navigation and form layout for RTL locales
            </span>
          </StoryStack>
          <Switch defaultChecked id="rtl-layout" />
        </StoryRow>
        <Separator />
        <DirectionProvider dir="rtl">
          <StoryStack
            className="rounded-md border border-border"
            gap="xs"
            padding="sm"
          >
            <StoryRow align="center" justify="between">
              <span className="text-sm">معاينة RTL</span>
              <DirectionReadout />
            </StoryRow>
            <span className="text-muted-foreground text-xs">
              تظهر المعاينة بالاتجاه المحدد دون إعادة تحميل الصفحة.
            </span>
          </StoryStack>
        </DirectionProvider>
      </StoryStack>
    </DirectionShell>
  ),
};

export const ArabicVendorCard: Story = {
  name: "ERP — Arabic Vendor Card",
  parameters: { layout: "padded" },
  render: () => (
    <DirectionShell
      dir="rtl"
      footer={
        <Button emphasis="outline" intent="secondary" size="sm">
          <BuildingIcon aria-hidden="true" className="size-4" />
          عرض الملف
        </Button>
      }
      header={
        <StoryRow align="center" justify="between">
          <span className="font-medium text-sm">FastCo Industrial</span>
          <Badge emphasis="soft" size="sm" tone="success">
            مُفضّل
          </Badge>
        </StoryRow>
      }
      width="md"
    >
      <StoryStack gap="sm">
        <DefinitionRow label="رقم المورد" value="VND-001" />
        <DefinitionRow label="الفئة" value="التصنيع" />
        <DefinitionRow label="شروط الدفع" value="Net 30" />
      </StoryStack>
    </DirectionShell>
  ),
};

export const RtlDashboardMetrics: Story = {
  name: "ERP — RTL Dashboard Metrics",
  parameters: { layout: "padded" },
  render: () => (
    <DirectionShell dir="rtl" width="lg">
      <StoryStack gap="sm">
        <span className="font-medium text-sm">لوحة التحكم التنفيذية</span>
        <StoryRow gap="sm" wrap>
          {[
            { label: "الإيرادات", value: "$842,500" },
            { label: "أوامر مفتوحة", value: "1,284" },
            { label: "تنبيهات المخزون", value: "47" },
          ].map((metric) => (
            <StoryStack
              className="min-w-40 flex-1 rounded-md border border-border"
              gap="xs"
              key={metric.label}
              padding="md"
            >
              <span className="text-muted-foreground text-xs">
                {metric.label}
              </span>
              <span className="font-semibold text-lg tabular-nums">
                {metric.value}
              </span>
            </StoryStack>
          ))}
        </StoryRow>
      </StoryStack>
    </DirectionShell>
  ),
};

export const RtlNotificationList: Story = {
  name: "ERP — RTL Notification List",
  parameters: { layout: "padded" },
  render: () => (
    <DirectionShell
      dir="rtl"
      header={
        <StoryRow align="center" gap="sm">
          <BellIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          <span className="font-medium text-sm">الإشعارات</span>
        </StoryRow>
      }
      width="md"
    >
      <StoryStack gap="sm">
        {[
          {
            id: "n1",
            title: "تمت الموافقة على أمر الشراء",
            body: "PO-2026-1184 — Jane Doe",
            time: "منذ 5 دقائق",
          },
          {
            id: "n2",
            title: "فاتورة مستحقة غداً",
            body: "INV-2026-0042 — $4,850.00",
            time: "منذ 1 ساعة",
          },
        ].map((item) => (
          <StoryStack
            className="rounded-md border border-border"
            gap="xs"
            key={item.id}
            padding="sm"
          >
            <StoryRow align="center" justify="between">
              <span className="font-medium text-sm">{item.title}</span>
              <span className="text-muted-foreground text-xs">{item.time}</span>
            </StoryRow>
            <span className="text-muted-foreground text-sm">{item.body}</span>
          </StoryStack>
        ))}
      </StoryStack>
    </DirectionShell>
  ),
};

export const NestedDirectionScope: Story = {
  name: "ERP — Nested Direction Scope",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <DirectionProvider dir="ltr">
        <StoryStack
          className="rounded-lg border border-border"
          gap="md"
          padding="lg"
        >
          <StoryStack gap="xs">
            <span className="font-medium text-sm">Global Report — English</span>
            <span className="text-muted-foreground text-sm">
              Parent scope remains LTR for shared ERP chrome and navigation.
            </span>
          </StoryStack>
          <DirectionProvider dir="rtl">
            <StoryStack
              className="rounded-md border border-border bg-muted/20"
              gap="sm"
              padding="md"
            >
              <StoryRow align="center" justify="between">
                <span className="font-medium text-sm">ملاحظة المورد (RTL)</span>
                <DirectionReadout />
              </StoryRow>
              <span className="text-muted-foreground text-sm">
                تم تأكيد شروط الشحن الجديدة. يرجى مراجعة أمر الشراء قبل الاعتماد
                النهائي.
              </span>
            </StoryStack>
          </DirectionProvider>
        </StoryStack>
      </DirectionProvider>
    </StoryFrame>
  ),
};

export const MixedNumericContent: Story = {
  name: "ERP — RTL with Latin Numbers",
  parameters: { layout: "padded" },
  render: () => (
    <DirectionShell dir="rtl" width="md">
      <StoryStack gap="sm">
        <span className="font-medium text-sm">تفاصيل الدفع</span>
        <DefinitionRow label="PO-2026-1184" value="$12,450.00" />
        <DefinitionRow label="SKU-4412" value="500 units" />
        <DefinitionRow label="VAT 15%" value="$1,867.50" />
        <span className="text-muted-foreground text-xs">
          Latin identifiers and numerals remain readable inside RTL paragraphs.
        </span>
      </StoryStack>
    </DirectionShell>
  ),
};
