/**
 * PAS-001B B81–B105 — catalog-only module vocabulary specs for governed scaffold.
 */
export interface ErpDomainVocabularySpec {
  readonly auditActions: readonly string[];
  readonly brandedIds: readonly string[];
  readonly businessReferenceNote: string;
  readonly permissions: Readonly<
    Record<string, readonly ("read" | "create" | "manage" | "approve" | "cancel" | "submit" | "close" | "send")[]>
  >;
  readonly prohibitedSurfaces: readonly string[];
  readonly rule: string;
  readonly slice: string;
  readonly slug: string;
  readonly vocabs: readonly {
    readonly file: string;
    readonly type: string;
    readonly values: readonly string[];
  }[];
  readonly wireDefaultField: string;
  readonly wireDefaultType: string;
}

export const ERP_DOMAIN_VOCABULARY_MODULE_SPECS = [
  {
    slug: "controlling",
    slice: "B81",
    rule: "Kernel may describe controlling words. It must not execute cost posting or allocation runtime.",
    businessReferenceNote:
      "CostCenterId and ProductId remain on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["CostAllocationRunId", "ActivityTypeId", "ProfitCenterReportId"],
    vocabs: [
      {
        file: "cost-element-category",
        type: "CostElementCategory",
        values: ["primary", "secondary", "revenue", "statistical"],
      },
      {
        file: "allocation-method",
        type: "AllocationMethod",
        values: ["direct", "step_down", "reciprocal", "activity_based"],
      },
      {
        file: "controlling-document-type",
        type: "ControllingDocumentType",
        values: ["plan", "actual", "forecast", "variance"],
      },
      {
        file: "variance-category",
        type: "VarianceCategory",
        values: ["price", "quantity", "mix", "rate"],
      },
    ],
    permissions: {
      costElement: ["read", "manage"],
      allocation: ["read", "create", "approve"],
      variance: ["read", "manage"],
    },
    auditActions: [
      "allocation.drafted",
      "allocation.posted",
      "variance.calculated",
      "plan.updated",
    ],
    prohibitedSurfaces: ["cost-posting-service", "allocation-engine", "controlling-database-runtime"],
    wireDefaultField: "defaultAllocationMethod",
    wireDefaultType: "AllocationMethod",
  },
  {
    slug: "treasury",
    slice: "B82",
    rule: "Kernel may describe treasury words. It must not execute payment or cash management runtime.",
    businessReferenceNote:
      "BankAccountId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["CashPositionSnapshotId", "PaymentRunId", "BankStatementImportId"],
    vocabs: [
      {
        file: "treasury-instrument-type",
        type: "TreasuryInstrumentType",
        values: ["cash", "deposit", "bond", "derivative"],
      },
      {
        file: "liquidity-status",
        type: "LiquidityStatus",
        values: ["surplus", "balanced", "deficit", "blocked"],
      },
      {
        file: "payment-run-status",
        type: "PaymentRunStatus",
        values: ["draft", "scheduled", "sent", "reconciled", "cancelled"],
      },
      {
        file: "hedge-accounting-method",
        type: "HedgeAccountingMethod",
        values: ["none", "cash_flow", "fair_value"],
      },
    ],
    permissions: {
      cashPosition: ["read", "manage"],
      paymentRun: ["read", "create", "approve", "cancel"],
      hedge: ["read", "manage"],
    },
    auditActions: ["payment.scheduled", "payment.sent", "cash.position_updated", "statement.imported"],
    prohibitedSurfaces: ["payment-posting-service", "treasury-database-runtime", "hedge-valuation-engine"],
    wireDefaultField: "defaultHedgeAccountingMethod",
    wireDefaultType: "HedgeAccountingMethod",
  },
  {
    slug: "tax",
    slice: "B83",
    rule: "Kernel may describe tax words. It must not execute tax filing or determination runtime.",
    businessReferenceNote:
      "TaxJurisdictionId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["TaxDeclarationId", "TaxDeterminationContextId", "WithholdingRunId"],
    vocabs: [
      {
        file: "tax-jurisdiction-scope",
        type: "TaxJurisdictionScope",
        values: ["domestic", "interstate", "cross_border", "local"],
      },
      {
        file: "tax-calculation-method",
        type: "TaxCalculationMethod",
        values: ["standard", "reverse_charge", "exempt", "zero_rated"],
      },
      {
        file: "tax-document-status",
        type: "TaxDocumentStatus",
        values: ["draft", "filed", "accepted", "rejected", "amended"],
      },
      {
        file: "withholding-type",
        type: "WithholdingType",
        values: ["income", "vat", "payroll", "contractor"],
      },
    ],
    permissions: {
      declaration: ["read", "create", "submit", "approve"],
      withholding: ["read", "manage"],
      determination: ["read", "manage"],
    },
    auditActions: ["declaration.filed", "declaration.accepted", "withholding.calculated", "rate.updated"],
    prohibitedSurfaces: ["tax-filing-service", "tax-database-runtime", "withholding-posting-engine"],
    wireDefaultField: "defaultTaxCalculationMethod",
    wireDefaultType: "TaxCalculationMethod",
  },
  {
    slug: "consolidation",
    slice: "B84",
    rule: "Kernel may describe consolidation words. It must not execute group reporting runtime.",
    businessReferenceNote:
      "LegalEntityId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["ConsolidationRunId", "EliminationEntryId", "ReportingUnitId"],
    vocabs: [
      {
        file: "consolidation-scope",
        type: "ConsolidationScope",
        values: ["legal", "management", "tax", "segment"],
      },
      {
        file: "elimination-type",
        type: "EliminationType",
        values: ["investment", "intercompany", "unrealized", "dividend"],
      },
      {
        file: "reporting-currency-method",
        type: "ReportingCurrencyMethod",
        values: ["closing", "average", "historical"],
      },
      {
        file: "consolidation-run-status",
        type: "ConsolidationRunStatus",
        values: ["draft", "in_progress", "posted", "locked"],
      },
    ],
    permissions: {
      consolidationRun: ["read", "create", "approve", "close"],
      elimination: ["read", "manage"],
      reportingUnit: ["read", "manage"],
    },
    auditActions: ["run.started", "run.posted", "elimination.recorded", "run.locked"],
    prohibitedSurfaces: ["consolidation-posting-service", "group-reporting-engine", "consolidation-database-runtime"],
    wireDefaultField: "defaultReportingCurrencyMethod",
    wireDefaultType: "ReportingCurrencyMethod",
  },
  {
    slug: "intercompany",
    slice: "B85",
    rule: "Kernel may describe intercompany words. It must not execute IC matching or settlement runtime.",
    businessReferenceNote:
      "SupplierId and CustomerId remain on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["IntercompanyAgreementId", "IcMatchingRunId", "IcSettlementId"],
    vocabs: [
      {
        file: "ic-transaction-type",
        type: "IcTransactionType",
        values: ["sale", "service", "loan", "dividend"],
      },
      {
        file: "ic-matching-status",
        type: "IcMatchingStatus",
        values: ["open", "matched", "disputed", "settled"],
      },
      {
        file: "ic-settlement-method",
        type: "IcSettlementMethod",
        values: ["netting", "gross", "central_treasury"],
      },
      {
        file: "ic-billing-direction",
        type: "IcBillingDirection",
        values: ["outbound", "inbound", "bilateral"],
      },
    ],
    permissions: {
      agreement: ["read", "manage"],
      matching: ["read", "create", "approve"],
      settlement: ["read", "create", "close"],
    },
    auditActions: ["matching.started", "matching.settled", "agreement.created", "dispute.opened"],
    prohibitedSurfaces: ["ic-matching-engine", "ic-settlement-service", "intercompany-database-runtime"],
    wireDefaultField: "defaultIcSettlementMethod",
    wireDefaultType: "IcSettlementMethod",
  },
  {
    slug: "manufacturing",
    slice: "B86",
    rule: "Kernel may describe manufacturing words. It must not execute production posting runtime.",
    businessReferenceNote:
      "ProductId and WarehouseId remain on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["ProductionOrderId", "RoutingId", "ProductionRunId"],
    vocabs: [
      {
        file: "production-order-status",
        type: "ProductionOrderStatus",
        values: ["planned", "released", "in_progress", "completed", "closed", "cancelled"],
      },
      {
        file: "manufacturing-order-type",
        type: "ManufacturingOrderType",
        values: ["standard", "rework", "prototype", "disassembly"],
      },
      {
        file: "capacity-planning-method",
        type: "CapacityPlanningMethod",
        values: ["finite", "infinite", "hybrid"],
      },
      {
        file: "shop-floor-event-type",
        type: "ShopFloorEventType",
        values: ["start", "pause", "scrap", "yield", "complete"],
      },
    ],
    permissions: {
      productionOrder: ["read", "create", "approve", "cancel"],
      routing: ["read", "manage"],
      shopFloor: ["read", "create", "close"],
    },
    auditActions: ["order.released", "order.completed", "scrap.recorded", "yield.recorded"],
    prohibitedSurfaces: ["production-posting-service", "mrp-engine", "manufacturing-database-runtime"],
    wireDefaultField: "defaultCapacityPlanningMethod",
    wireDefaultType: "CapacityPlanningMethod",
  },
  {
    slug: "quality",
    slice: "B87",
    rule: "Kernel may describe quality words. It must not execute inspection posting runtime.",
    businessReferenceNote:
      "ProductId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["QualityInspectionId", "QualityNotificationId", "SampleLotId"],
    vocabs: [
      {
        file: "inspection-result-status",
        type: "InspectionResultStatus",
        values: ["pending", "pass", "fail", "conditional"],
      },
      {
        file: "quality-notification-priority",
        type: "QualityNotificationPriority",
        values: ["low", "medium", "high", "critical"],
      },
      {
        file: "inspection-type",
        type: "InspectionType",
        values: ["incoming", "in_process", "final", "audit"],
      },
      {
        file: "disposition-code",
        type: "DispositionCode",
        values: ["accept", "reject", "rework", "scrap", "use_as_is"],
      },
    ],
    permissions: {
      inspection: ["read", "create", "approve", "cancel"],
      notification: ["read", "manage"],
      sampleLot: ["read", "manage"],
    },
    auditActions: ["inspection.completed", "notification.opened", "disposition.applied", "lot.sampled"],
    prohibitedSurfaces: ["quality-posting-service", "inspection-engine", "quality-database-runtime"],
    wireDefaultField: "defaultInspectionType",
    wireDefaultType: "InspectionType",
  },
  {
    slug: "maintenance",
    slice: "B88",
    rule: "Kernel may describe maintenance words. It must not execute work order posting runtime.",
    businessReferenceNote:
      "EquipmentId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["MaintenanceOrderId", "WorkRequestId", "EquipmentDowntimeId"],
    vocabs: [
      {
        file: "maintenance-order-status",
        type: "MaintenanceOrderStatus",
        values: ["draft", "scheduled", "in_progress", "completed", "cancelled"],
      },
      {
        file: "maintenance-order-type",
        type: "MaintenanceOrderType",
        values: ["corrective", "preventive", "predictive", "emergency"],
      },
      {
        file: "downtime-category",
        type: "DowntimeCategory",
        values: ["planned", "unplanned", "setup", "breakdown"],
      },
      {
        file: "maintenance-priority",
        type: "MaintenancePriority",
        values: ["routine", "urgent", "critical", "shutdown"],
      },
    ],
    permissions: {
      maintenanceOrder: ["read", "create", "approve", "close"],
      workRequest: ["read", "create", "cancel"],
      downtime: ["read", "manage"],
    },
    auditActions: ["order.scheduled", "order.completed", "downtime.recorded", "request.created"],
    prohibitedSurfaces: ["maintenance-posting-service", "pm-scheduling-engine", "maintenance-database-runtime"],
    wireDefaultField: "defaultMaintenancePriority",
    wireDefaultType: "MaintenancePriority",
  },
  {
    slug: "supply-chain",
    slice: "B89",
    rule: "Kernel may describe supply-chain orchestration words. It must not subsume inventory or procurement runtime.",
    businessReferenceNote:
      "WarehouseId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["ShipmentId", "DeliveryRunId", "TransportLegId"],
    vocabs: [
      {
        file: "shipment-status",
        type: "ShipmentStatus",
        values: ["draft", "picked", "in_transit", "delivered", "exception"],
      },
      {
        file: "delivery-priority",
        type: "DeliveryPriority",
        values: ["standard", "express", "same_day", "deferred"],
      },
      {
        file: "transport-mode",
        type: "TransportMode",
        values: ["road", "rail", "air", "sea", "parcel"],
      },
      {
        file: "fulfillment-event-type",
        type: "FulfillmentEventType",
        values: ["pick", "pack", "ship", "deliver", "return"],
      },
    ],
    permissions: {
      shipment: ["read", "create", "send", "cancel"],
      deliveryRun: ["read", "manage"],
      transport: ["read", "manage"],
    },
    auditActions: ["shipment.dispatched", "shipment.delivered", "leg.started", "exception.recorded"],
    prohibitedSurfaces: ["fulfillment-posting-service", "tms-routing-engine", "supply-chain-database-runtime"],
    wireDefaultField: "defaultTransportMode",
    wireDefaultType: "TransportMode",
  },
  {
    slug: "sales",
    slice: "B90",
    rule: "Kernel may describe sales words. It must not execute order fulfillment runtime.",
    businessReferenceNote:
      "CustomerId and ProductId remain on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["SalesOrderId", "QuoteId", "DeliveryScheduleId"],
    vocabs: [
      {
        file: "order-status",
        type: "OrderStatus",
        values: ["draft", "confirmed", "partially_shipped", "fulfilled", "cancelled"],
      },
      {
        file: "quote-status",
        type: "QuoteStatus",
        values: ["draft", "sent", "accepted", "rejected", "expired"],
      },
      {
        file: "sales-document-type",
        type: "SalesDocumentType",
        values: ["quote", "order", "contract", "return"],
      },
      {
        file: "pricing-context",
        type: "PricingContext",
        values: ["list", "customer", "campaign", "contract"],
      },
    ],
    permissions: {
      salesOrder: ["read", "create", "approve", "cancel"],
      quote: ["read", "create", "send"],
      schedule: ["read", "manage"],
    },
    auditActions: ["order.confirmed", "quote.sent", "quote.accepted", "order.fulfilled"],
    prohibitedSurfaces: ["sales-posting-service", "order-allocation-engine", "sales-database-runtime"],
    wireDefaultField: "defaultPricingContext",
    wireDefaultType: "PricingContext",
  },
  {
    slug: "crm",
    slice: "B91",
    rule: "Kernel may describe CRM words. It must not execute marketing automation runtime.",
    businessReferenceNote:
      "CustomerId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["LeadId", "OpportunityId", "CampaignTouchpointId"],
    vocabs: [
      {
        file: "lead-status",
        type: "LeadStatus",
        values: ["new", "qualified", "disqualified", "converted"],
      },
      {
        file: "opportunity-stage",
        type: "OpportunityStage",
        values: ["prospect", "proposal", "negotiation", "won", "lost"],
      },
      {
        file: "activity-type",
        type: "ActivityType",
        values: ["call", "email", "meeting", "demo"],
      },
      {
        file: "account-tier",
        type: "AccountTier",
        values: ["standard", "key", "strategic"],
      },
    ],
    permissions: {
      lead: ["read", "create", "manage"],
      opportunity: ["read", "create", "close"],
      activity: ["read", "create"],
    },
    auditActions: ["lead.converted", "opportunity.won", "opportunity.lost", "activity.logged"],
    prohibitedSurfaces: ["crm-sync-service", "lead-scoring-engine", "crm-database-runtime"],
    wireDefaultField: "defaultAccountTier",
    wireDefaultType: "AccountTier",
  },
  {
    slug: "pricing",
    slice: "B92",
    rule: "Kernel may describe pricing words. It must not execute price calculation runtime.",
    businessReferenceNote:
      "ProductId and CustomerId remain on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["PriceListId", "PriceRuleSetId", "DiscountApprovalId"],
    vocabs: [
      {
        file: "price-list-status",
        type: "PriceListStatus",
        values: ["draft", "active", "expired", "archived"],
      },
      {
        file: "pricing-method",
        type: "PricingMethod",
        values: ["cost_plus", "market", "tiered", "dynamic"],
      },
      {
        file: "discount-type",
        type: "DiscountType",
        values: ["percent", "amount", "bundle", "volume"],
      },
      {
        file: "price-approval-status",
        type: "PriceApprovalStatus",
        values: ["pending", "approved", "rejected"],
      },
    ],
    permissions: {
      priceList: ["read", "manage"],
      priceRule: ["read", "create", "approve"],
      discount: ["read", "approve"],
    },
    auditActions: ["price_list.activated", "discount.approved", "rule.updated", "approval.rejected"],
    prohibitedSurfaces: ["pricing-engine", "dynamic-pricing-service", "pricing-database-runtime"],
    wireDefaultField: "defaultPricingMethod",
    wireDefaultType: "PricingMethod",
  },
  {
    slug: "subscription",
    slice: "B93",
    rule: "Kernel may describe subscription words. It must not execute billing runtime.",
    businessReferenceNote:
      "CustomerId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["SubscriptionId", "BillingCycleRunId", "RenewalOfferId"],
    vocabs: [
      {
        file: "subscription-status",
        type: "SubscriptionStatus",
        values: ["trial", "active", "paused", "cancelled", "expired"],
      },
      {
        file: "billing-cycle",
        type: "BillingCycle",
        values: ["monthly", "quarterly", "annual", "usage"],
      },
      {
        file: "renewal-intent",
        type: "RenewalIntent",
        values: ["auto", "manual", "opt_out"],
      },
      {
        file: "subscription-event-type",
        type: "SubscriptionEventType",
        values: ["activate", "renew", "upgrade", "downgrade", "cancel"],
      },
    ],
    permissions: {
      subscription: ["read", "create", "cancel"],
      billingCycle: ["read", "manage"],
      renewal: ["read", "manage"],
    },
    auditActions: ["subscription.activated", "subscription.cancelled", "renewal.offered", "cycle.billed"],
    prohibitedSurfaces: ["subscription-billing-service", "renewal-engine", "subscription-database-runtime"],
    wireDefaultField: "defaultBillingCycle",
    wireDefaultType: "BillingCycle",
  },
  {
    slug: "ecommerce",
    slice: "B94",
    rule: "Kernel may describe ecommerce words. It must not execute checkout payment runtime.",
    businessReferenceNote:
      "CustomerId and ProductId remain on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["WebCartId", "CheckoutSessionId", "WebOrderId"],
    vocabs: [
      {
        file: "cart-status",
        type: "CartStatus",
        values: ["active", "abandoned", "converted", "merged"],
      },
      {
        file: "checkout-step",
        type: "CheckoutStep",
        values: ["cart", "shipping", "payment", "review", "complete"],
      },
      {
        file: "web-order-status",
        type: "WebOrderStatus",
        values: ["pending", "paid", "fulfilled", "refunded"],
      },
      {
        file: "channel-type",
        type: "ChannelType",
        values: ["web", "mobile", "marketplace", "social"],
      },
    ],
    permissions: {
      cart: ["read", "manage"],
      checkout: ["read", "create"],
      webOrder: ["read", "manage", "cancel"],
    },
    auditActions: ["cart.converted", "checkout.completed", "order.paid", "order.refunded"],
    prohibitedSurfaces: ["checkout-payment-service", "cart-merge-engine", "ecommerce-database-runtime"],
    wireDefaultField: "defaultChannelType",
    wireDefaultType: "ChannelType",
  },
  {
    slug: "pos",
    slice: "B95",
    rule: "Kernel may describe POS words. It must not execute tender capture runtime.",
    businessReferenceNote:
      "ProductId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["PosSessionId", "PosTransactionId", "CashDrawerShiftId"],
    vocabs: [
      {
        file: "pos-session-status",
        type: "PosSessionStatus",
        values: ["open", "suspended", "closed", "reconciled"],
      },
      {
        file: "tender-type",
        type: "TenderType",
        values: ["cash", "card", "wallet", "voucher"],
      },
      {
        file: "transaction-type",
        type: "TransactionType",
        values: ["sale", "return", "void", "no_sale"],
      },
      {
        file: "shift-status",
        type: "ShiftStatus",
        values: ["open", "closing", "closed"],
      },
    ],
    permissions: {
      session: ["read", "create", "close"],
      transaction: ["read", "create", "cancel"],
      shift: ["read", "manage"],
    },
    auditActions: ["session.opened", "session.closed", "transaction.voided", "shift.reconciled"],
    prohibitedSurfaces: ["pos-tender-service", "drawer-reconciliation-engine", "pos-database-runtime"],
    wireDefaultField: "defaultTenderType",
    wireDefaultType: "TenderType",
  },
  {
    slug: "service",
    slice: "B96",
    rule: "Kernel may describe service case words. It must not execute field dispatch runtime.",
    businessReferenceNote:
      "CustomerId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["ServiceCaseId", "ServiceContractId", "ServiceVisitId"],
    vocabs: [
      {
        file: "case-status",
        type: "CaseStatus",
        values: ["new", "in_progress", "waiting", "resolved", "closed"],
      },
      {
        file: "case-priority",
        type: "CasePriority",
        values: ["low", "medium", "high", "urgent"],
      },
      {
        file: "service-level",
        type: "ServiceLevel",
        values: ["basic", "standard", "premium"],
      },
      {
        file: "resolution-type",
        type: "ResolutionType",
        values: ["fixed", "workaround", "duplicate", "not_reproducible"],
      },
    ],
    permissions: {
      case: ["read", "create", "close"],
      contract: ["read", "manage"],
      visit: ["read", "create"],
    },
    auditActions: ["case.opened", "case.resolved", "case.closed", "visit.completed"],
    prohibitedSurfaces: ["service-dispatch-service", "sla-engine", "service-database-runtime"],
    wireDefaultField: "defaultServiceLevel",
    wireDefaultType: "ServiceLevel",
  },
  {
    slug: "field-service",
    slice: "B97",
    rule: "Kernel may describe field service words. It must not execute technician dispatch runtime.",
    businessReferenceNote:
      "EmployeeId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["FieldWorkOrderId", "DispatchRunId", "TechnicianRouteId"],
    vocabs: [
      {
        file: "work-order-status",
        type: "WorkOrderStatus",
        values: ["scheduled", "dispatched", "on_site", "completed", "cancelled"],
      },
      {
        file: "dispatch-priority",
        type: "DispatchPriority",
        values: ["routine", "same_day", "emergency"],
      },
      {
        file: "visit-outcome",
        type: "VisitOutcome",
        values: ["completed", "rescheduled", "no_access", "parts_required"],
      },
      {
        file: "route-status",
        type: "RouteStatus",
        values: ["planned", "active", "completed"],
      },
    ],
    permissions: {
      workOrder: ["read", "create", "close"],
      dispatch: ["read", "manage"],
      route: ["read", "manage"],
    },
    auditActions: ["work_order.dispatched", "visit.completed", "route.started", "visit.rescheduled"],
    prohibitedSurfaces: ["dispatch-routing-service", "technician-tracking-engine", "field-service-database-runtime"],
    wireDefaultField: "defaultDispatchPriority",
    wireDefaultType: "DispatchPriority",
  },
  {
    slug: "marketing",
    slice: "B98",
    rule: "Kernel may describe marketing words. It must not execute campaign delivery runtime.",
    businessReferenceNote:
      "CustomerId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["MarketingCampaignId", "AudienceSegmentId", "ContentVariantId"],
    vocabs: [
      {
        file: "campaign-status",
        type: "CampaignStatus",
        values: ["draft", "scheduled", "active", "paused", "completed"],
      },
      {
        file: "campaign-channel",
        type: "CampaignChannel",
        values: ["email", "sms", "social", "ads", "event"],
      },
      {
        file: "segment-type",
        type: "SegmentType",
        values: ["static", "dynamic", "lookalike"],
      },
      {
        file: "attribution-model",
        type: "AttributionModel",
        values: ["first_touch", "last_touch", "linear", "u_shaped"],
      },
    ],
    permissions: {
      campaign: ["read", "create", "manage"],
      segment: ["read", "manage"],
      content: ["read", "manage"],
    },
    auditActions: ["campaign.launched", "campaign.paused", "segment.updated", "variant.published"],
    prohibitedSurfaces: ["campaign-delivery-service", "attribution-engine", "marketing-database-runtime"],
    wireDefaultField: "defaultAttributionModel",
    wireDefaultType: "AttributionModel",
  },
  {
    slug: "hcm",
    slice: "B99",
    rule: "Kernel may describe HCM words. It must not execute payroll or HR runtime.",
    businessReferenceNote:
      "EmployeeId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["JobRequisitionId", "OnboardingCaseId", "PerformanceReviewId"],
    vocabs: [
      {
        file: "requisition-status",
        type: "RequisitionStatus",
        values: ["draft", "open", "on_hold", "filled", "cancelled"],
      },
      {
        file: "employment-type",
        type: "EmploymentType",
        values: ["full_time", "part_time", "contractor", "intern"],
      },
      {
        file: "review-cycle-status",
        type: "ReviewCycleStatus",
        values: ["planned", "in_progress", "calibration", "closed"],
      },
      {
        file: "onboarding-step",
        type: "OnboardingStep",
        values: ["offer", "paperwork", "provisioning", "orientation", "complete"],
      },
    ],
    permissions: {
      requisition: ["read", "create", "approve", "cancel"],
      onboarding: ["read", "manage"],
      review: ["read", "create", "close"],
    },
    auditActions: ["requisition.opened", "requisition.filled", "review.closed", "onboarding.completed"],
    prohibitedSurfaces: ["hcm-posting-service", "payroll-bridge", "hcm-database-runtime"],
    wireDefaultField: "defaultEmploymentType",
    wireDefaultType: "EmploymentType",
  },
  {
    slug: "payroll",
    slice: "B100",
    rule: "Kernel may describe payroll words. It must not execute pay calculation runtime.",
    businessReferenceNote:
      "EmployeeId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["PayrollRunId", "PayslipId", "TaxWithholdingAdjustmentId"],
    vocabs: [
      {
        file: "payroll-run-status",
        type: "PayrollRunStatus",
        values: ["draft", "calculated", "approved", "paid", "reversed"],
      },
      {
        file: "pay-frequency",
        type: "PayFrequency",
        values: ["weekly", "biweekly", "semimonthly", "monthly"],
      },
      {
        file: "earnings-type",
        type: "EarningsType",
        values: ["regular", "overtime", "bonus", "allowance"],
      },
      {
        file: "deduction-type",
        type: "DeductionType",
        values: ["tax", "benefit", "garnishment", "voluntary"],
      },
    ],
    permissions: {
      payrollRun: ["read", "create", "approve", "cancel"],
      payslip: ["read", "manage"],
      adjustment: ["read", "manage"],
    },
    auditActions: ["run.calculated", "run.approved", "run.paid", "adjustment.applied"],
    prohibitedSurfaces: ["payroll-calculation-service", "tax-withholding-engine", "payroll-database-runtime"],
    wireDefaultField: "defaultPayFrequency",
    wireDefaultType: "PayFrequency",
  },
  {
    slug: "project",
    slice: "B101",
    rule: "Kernel may describe project words. It must not execute billing or timesheet posting runtime.",
    businessReferenceNote:
      "EmployeeId and CustomerId remain on kernel business-reference authority (PAS-001B Rule 2). ProjectId here is domain-scoped.",
    brandedIds: ["ProjectId", "ProjectTaskId", "TimesheetPeriodId"],
    vocabs: [
      {
        file: "project-status",
        type: "ProjectStatus",
        values: ["planning", "active", "on_hold", "completed", "cancelled"],
      },
      {
        file: "task-status",
        type: "TaskStatus",
        values: ["todo", "in_progress", "blocked", "done"],
      },
      {
        file: "billing-method",
        type: "BillingMethod",
        values: ["fixed", "time_and_materials", "milestone", "retainer"],
      },
      {
        file: "timesheet-status",
        type: "TimesheetStatus",
        values: ["draft", "submitted", "approved", "rejected"],
      },
    ],
    permissions: {
      project: ["read", "create", "close"],
      task: ["read", "create", "manage"],
      timesheet: ["read", "submit", "approve"],
    },
    auditActions: ["project.started", "project.completed", "timesheet.approved", "task.completed"],
    prohibitedSurfaces: ["project-billing-service", "timesheet-posting-engine", "project-database-runtime"],
    wireDefaultField: "defaultBillingMethod",
    wireDefaultType: "BillingMethod",
  },
  {
    slug: "assets",
    slice: "B102",
    rule: "Kernel may describe fixed asset words. It must not execute depreciation posting runtime.",
    businessReferenceNote:
      "AssetLocationId remains on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["FixedAssetId", "DepreciationRunId", "AssetTransferId"],
    vocabs: [
      {
        file: "asset-status",
        type: "AssetStatus",
        values: ["active", "idle", "disposed", "under_construction"],
      },
      {
        file: "depreciation-method",
        type: "DepreciationMethod",
        values: ["straight_line", "declining_balance", "units_of_production"],
      },
      {
        file: "asset-class",
        type: "AssetClass",
        values: ["tangible", "intangible", "financial", "low_value"],
      },
      {
        file: "transfer-type",
        type: "TransferType",
        values: ["internal", "external", "reclass"],
      },
    ],
    permissions: {
      asset: ["read", "create", "manage"],
      depreciation: ["read", "create", "approve"],
      transfer: ["read", "create", "approve"],
    },
    auditActions: ["asset.capitalized", "depreciation.run", "asset.transferred", "asset.disposed"],
    prohibitedSurfaces: ["depreciation-posting-service", "asset-valuation-engine", "assets-database-runtime"],
    wireDefaultField: "defaultDepreciationMethod",
    wireDefaultType: "DepreciationMethod",
  },
  {
    slug: "document",
    slice: "B103",
    rule: "Kernel may describe ERP business document words. Not platform CMS or storage runtime.",
    businessReferenceNote:
      "Business partner IDs remain on kernel business-reference authority (PAS-001B Rule 2).",
    brandedIds: ["BusinessDocumentId", "DocumentRetentionCaseId", "FiscalAttachmentId"],
    vocabs: [
      {
        file: "document-class",
        type: "DocumentClass",
        values: ["invoice", "receipt", "contract", "certificate"],
      },
      {
        file: "retention-policy",
        type: "RetentionPolicy",
        values: ["standard", "extended", "legal_hold", "destroy"],
      },
      {
        file: "document-lifecycle-status",
        type: "DocumentLifecycleStatus",
        values: ["draft", "active", "archived", "purged"],
      },
      {
        file: "attachment-role",
        type: "AttachmentRole",
        values: ["supporting", "primary", "signature"],
      },
    ],
    permissions: {
      document: ["read", "create", "manage"],
      retention: ["read", "manage"],
      attachment: ["read", "create"],
    },
    auditActions: ["document.archived", "document.purged", "retention.applied", "attachment.linked"],
    prohibitedSurfaces: ["document-storage-service", "cms-bridge", "document-database-runtime"],
    wireDefaultField: "defaultRetentionPolicy",
    wireDefaultType: "RetentionPolicy",
  },
  {
    slug: "workflow",
    slice: "B104",
    rule: "Kernel may describe workflow words. It must not execute BPM engine runtime.",
    businessReferenceNote:
      "UserId remains on kernel identity authority (PAS-001B Rule 2).",
    brandedIds: ["WorkflowInstanceId", "ApprovalTaskId", "EscalationCaseId"],
    vocabs: [
      {
        file: "workflow-status",
        type: "WorkflowStatus",
        values: ["running", "waiting", "completed", "failed", "cancelled"],
      },
      {
        file: "approval-decision",
        type: "ApprovalDecision",
        values: ["pending", "approved", "rejected", "delegated"],
      },
      {
        file: "task-priority",
        type: "TaskPriority",
        values: ["low", "normal", "high", "critical"],
      },
      {
        file: "escalation-reason",
        type: "EscalationReason",
        values: ["timeout", "rejection", "policy", "manual"],
      },
    ],
    permissions: {
      workflow: ["read", "create", "cancel"],
      approval: ["read", "approve"],
      escalation: ["read", "manage"],
    },
    auditActions: ["workflow.started", "workflow.completed", "approval.granted", "escalation.triggered"],
    prohibitedSurfaces: ["bpm-engine", "workflow-database-runtime", "approval-routing-service"],
    wireDefaultField: "defaultTaskPriority",
    wireDefaultType: "TaskPriority",
  },
  {
    slug: "analytics",
    slice: "B105",
    rule: "Kernel may describe analytics words. It must not execute query engine runtime.",
    businessReferenceNote:
      "Tenant-scoped entity IDs remain on kernel authority (PAS-001B Rule 2).",
    brandedIds: ["AnalyticsQueryId", "DashboardDefinitionId", "MetricSnapshotId"],
    vocabs: [
      {
        file: "query-status",
        type: "QueryStatus",
        values: ["draft", "validated", "scheduled", "failed"],
      },
      {
        file: "aggregation-grain",
        type: "AggregationGrain",
        values: ["hour", "day", "week", "month", "quarter"],
      },
      {
        file: "metric-category",
        type: "MetricCategory",
        values: ["financial", "operational", "customer", "compliance"],
      },
      {
        file: "dashboard-visibility",
        type: "DashboardVisibility",
        values: ["private", "team", "org", "public"],
      },
    ],
    permissions: {
      query: ["read", "create", "manage"],
      dashboard: ["read", "manage"],
      metric: ["read", "manage"],
    },
    auditActions: ["query.validated", "dashboard.published", "metric.snapshot_created", "query.failed"],
    prohibitedSurfaces: ["analytics-query-engine", "metric-compute-service", "analytics-database-runtime"],
    wireDefaultField: "defaultAggregationGrain",
    wireDefaultType: "AggregationGrain",
  },
] as const satisfies readonly ErpDomainVocabularySpec[];
