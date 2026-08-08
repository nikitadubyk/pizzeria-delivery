<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: Pizzeria Delivery

Pizzeria Delivery is a Next.js application for a pizzeria and food delivery workflow. The product should support browsing a pizza menu, customizing orders, managing a cart, collecting customer contact and delivery details, tracking order status, and supporting future admin workflows for menu, orders, and delivery operations.

## Tech Stack

- Next.js App Router with React and TypeScript.
- Mantine UI for reusable UI primitives and application components.
- Tailwind CSS for styling.
- Prisma for database access and schema management.
- PostgreSQL as the application database.
- Docker Compose for local database infrastructure.

## Local Environment

- The local PostgreSQL database name is `pizzeria_delivery`.
- `DATABASE_URL` must point to the same database name used by `docker-compose.yml`.
- Use `npm run docker:compose` to start local infrastructure.
- Use `npm run docker:compose:down` to stop local infrastructure.
- Use `npm run dev` for the local Next.js development server.

## Product Requirements

- Keep the domain language focused on pizzeria, menu, cart, checkout, delivery, customers, couriers, and order management.
- Treat the product as a multi-tenant pizzeria platform: each pizzeria tenant can have its own admin users, menu/products, customer-facing site, orders, delivery settings, branding, and operational data.
- Keep tenant-specific data isolated by pizzeria/tenant ownership in models, queries, routes, and admin workflows.
- Do not introduce property-market terminology, models, copy, database names, or routes.
- Customer-facing flows should be fast, mobile-friendly, and clear enough for ordering food with minimal friction.
- Admin or operational screens should prioritize dense, scannable information for repeated use.
- Persist important business data through Prisma models instead of local-only UI state when the feature requires backend state.

## Engineering Requirements

- Before changing Next.js APIs or routing conventions, read the relevant guide in `node_modules/next/dist/docs/`.
- Follow existing project structure and keep changes small and domain-focused.
- Prefer Mantine UI components for interactive UI controls and reusable building blocks.
- Create new shared/custom UI components under `components/`, composing Mantine primitives where possible.
- Use Tailwind CSS for page layout, spacing, responsive behavior, and project-specific visual styling around Mantine components.
- Keep TypeScript types explicit at module boundaries.
- Run lint/build checks when touching application code or Prisma schema.
- Keep Docker, `.env`, Prisma datasource configuration, and documentation synchronized when changing database names.
