# Pizzeria Delivery

Pizzeria Delivery is a multi-tenant platform for pizzerias and food delivery operations.

The core idea is that many independent pizzerias can run on the same application while keeping their business data separate. Each pizzeria tenant can have its own customer-facing site, admins, menu items, prices, orders, delivery settings, branding, and operational workflows.

## Product Vision

The project is built around the full lifecycle of ordering pizza online:

- Customers browse a pizzeria menu, customize pizzas, manage a cart, and place delivery orders.
- Pizzeria admins manage their own products, categories, prices, availability, orders, and delivery operations.
- Couriers and operators can eventually track delivery status and coordinate order fulfillment.
- Platform-level functionality can support creating new pizzerias, configuring their sites, and managing tenant ownership.

This is not a single restaurant website. It is intended to become a multi-tenant pizzeria delivery system where every pizzeria has its own isolated workspace and storefront.

## Multi-Tenant Model

Tenant isolation is a key architectural requirement.

Every important business entity should belong to a pizzeria tenant, for example:

- Admin users
- Menu categories
- Products and pizza options
- Orders and order items
- Customers
- Delivery settings
- Branding and storefront configuration

Queries, routes, admin screens, and Prisma models should preserve tenant ownership so one pizzeria cannot access or modify another pizzeria's data.

## Tech Stack

- Next.js App Router with React and TypeScript
- Mantine UI for reusable UI primitives and application components
- Tailwind CSS for layout, spacing, responsive behavior, and custom styling
- Prisma for database access and schema management
- PostgreSQL as the application database
- Docker Compose for local database infrastructure

## UI Direction

Reusable UI should be built from Mantine components where possible. Shared custom components should live in `components/` and compose Mantine primitives with project-specific behavior.

Tailwind CSS is used around those components for page layout, spacing, responsive design, and visual adjustments that are specific to the pizzeria delivery product.

Customer-facing screens should be fast, mobile-friendly, and clear enough for ordering food with minimal friction. Admin and operational screens should be dense, scannable, and optimized for repeated daily work.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local PostgreSQL database:

```bash
npm run docker:compose
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database

The local database is `pizzeria_delivery`.

The connection string is configured in `.env`:

```bash
DATABASE_URL="postgresql://admin:123@localhost:5432/pizzeria_delivery"
```

Copy the super administrator settings from `.env.example` into `.env`, replace
the example credentials, and use a password with at least 12 characters:

```bash
SUPER_ADMIN_EMAIL="admin@example.com"
SUPER_ADMIN_PASSWORD="replace-with-a-strong-password"
SUPER_ADMIN_NAME="Super Admin"
```

Apply migrations and seed the super administrator:

```bash
npx prisma migrate deploy
npm run db:seed
```

The seed stores a bcrypt hash, never the plaintext password. It is safe to run
again: the matching global administrator is updated and reactivated.

Keep `.env`, `docker-compose.yml`, and Prisma configuration aligned when changing database settings.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:seed
npm run docker:compose
npm run docker:compose:down
```

## Development Notes

- Keep domain language focused on pizzerias, menus, carts, checkout, delivery, customers, couriers, orders, and tenant administration.
- Persist important business data through Prisma models instead of local-only UI state.
- Keep changes small, typed, and aligned with the existing Next.js App Router structure.
- Run lint/build checks when touching application code or Prisma schema.
