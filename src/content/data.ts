export const architectureDoc = `
# Architecture Document: Modular Monolith Retail POS

## 1. Executive Summary
This document outlines the architecture for a modern, cloud-agnostic, multi-tenant Retail Point of Sale (POS) system built using **.NET 8/9** and a **Modular Monolith** architecture.

## 2. Business Architecture
- **Multi-Tenancy**: Support for multiple organizations (Tenants) on a single deployment.
- **Store Operations**: Sales, Returns, Discounts, Daily Reconciliation.
- **Inventory Management**: Stock tracking, Purchase Orders, Suppliers.
- **Catalog**: Products, Categories, Attributes, Pricing.
- **Customers**: Loyalty programs, Purchase history.
- **Reporting**: Real-time sales analytics and inventory forecasting.

## 3. Application Architecture (Modular Monolith)
### Core Principles:
- **Strict Module Boundaries**: Modules communicate primarily via In-Process Messaging (MediatR).
- **Independent Data Schemas**: Each module owns its schema (logical separation).
- **Shared Kernel**: Common infrastructure, authentication, and cross-cutting concerns.

### Primary Modules:
1. **Sales Module**: Handles transactions, taxes, and terminal management.
2. **Inventory Module**: Manages SKU quantities and movements.
3. **Catalog Module**: Central repository for product definitions.
4. **Customer Module**: CRM and loyalty logic.
5. **Billing Module**: Subscription and tenant management.

## 4. Technology Architecture
- **Runtime**: .NET 8 / .NET 9
- **Persistence**: EF Core with PostgreSQL (Scalable & Open Source)
- **Messaging**: 
  - **In-Process**: MediatR (Mediator Pattern)
  - **Out-Process**: MassTransit with RabbitMQ or Azure Service Bus.
- **Communication**: REST API (OpenAPI) / gRPC (Internal performance).
- **Security**: OAuth2/OIDC with Duende IdentityServer or Keycloak.
- **Observability**: OpenTelemetry (Grafana/Loki/Tempo).

## 5. Data Architecture
- **Multi-Tenancy Strategy**: Hybrid Approach.
  - Shared Database with \`TenantId\` discriminator for standard POS operations.
  - Dedicated Databases for high-volume enterprise tenants.
- **Modularity**: Every module has its own EF Core \`DbContext\`.

---

# PowerPoint Outline: Architecture Review

## Slide 1: Project Vision
- Cloud-Agnostic Modular Monolith.
- Why Modular Monolith? (Low complexity, high velocity, easy transition to microservices).

## Slide 2: Multi-Tenancy Strategy
- Logical isolation vs. Physical isolation.
- Tenant resolution strategy (Host, Header, or Subdomain).

## Slide 3: Module Communication
- In-process decoupling using MediatR.
- Event-driven consistency through Outbox Pattern.

## Slide 4: Tech Stack
- .NET, EF Core, PostgreSQL, Dapr.

---

# Visio Shape Manifest (CSV Preview)
\`\`\`csv
ShapeID,Name,Type,Description,ConnectorTargets
M-001,SalesModule,Process,Handles POS Transactions,M-002;M-003
M-002,InventoryModule,Process,Stock Control,M-003
M-003,CatalogModule,Process,Product Metadata,
INT-001,MediatR,Bus,In-Process Messenger,M-001;M-002;M-003
DB-001,TenantDB,Database,PostgreSQL Multi-tenant,M-001;M-002;M-003
\`\`\`
`;

export const prompts = [
  {
    phase: "Business Analysis",
    prompt: "Act as a Retail Solutions Architect. Define the core business entities for a POS system including multi-store support and complex discounting logic. Provide a capability map."
  },
  {
    phase: "Design",
    prompt: "Generate a C# class diagram for a 'Sales' module within a modular monolith POS. Use Domain Driven Design (DDD) principles with Aggregates like 'Order' and Value Objects like 'Price'."
  },
  {
    phase: "API Development",
    prompt: "Write a Swagger/OpenAPI 3.0 specification for the Sales module of my POS. Include endpoints for 'FinalizeTransaction' and 'GetHistoryByTenant'."
  },
  {
    phase: "Implementation",
    prompt: "Generate a MediatR command and handler in C# for processing a retail sale. Ensure it uses the 'Outbox' pattern to notify the Inventory module of stock changes."
  },
  {
    phase: "Testing",
    prompt: "Write xUnit tests and FluentAssertions for the 'CalculateDiscount' domain service. Include edge cases for overlapping discounts."
  }
];

export const contracts = [
  {
    module: "Sales",
    contract: `
POST /api/v1/sales/checkout
{
  "terminalId": "uuid",
  "items": [
    { "productId": "uuid", "qty": 2, "unitPrice": 10.50 }
  ],
  "payment": { "type": "Cash", "amount": 21.00 }
}
Response: 201 Created { "receiptId": "REC-10293" }
    `
  },
  {
    module: "Inventory",
    contract: `
GET /api/v1/inventory/{productId}
Response: 200 OK { "onHand": 150, "reserved": 5, "available": 145 }
    `
  }
];
