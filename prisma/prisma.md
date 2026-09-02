# Prisma and multi-tenant architecture

## Folder structure

- `schema.prisma` contains only the Prisma Client generator and PostgreSQL
  datasource.
- `models/restaurant.prisma` contains the tenant root (`Restaurant`) and its
  status.
- `models/user.prisma` contains administrative accounts and their roles.
- Add future bounded domains as separate files in `models/`, for example
  `menu.prisma`, `order.prisma`, and `delivery.prisma`.
- `migrations/` contains generated database migrations and stays next to
  `schema.prisma`.

`prisma.config.ts` points Prisma at the whole `prisma/` directory, so all
`.prisma` files are loaded as one schema.

## Tenant ownership

`Restaurant` is the tenant root. Every restaurant-owned business model must
contain:

- a required `restaurantId`;
- a relation to `Restaurant`;
- an index beginning with `restaurantId`;
- `restaurantId` in tenant-specific unique constraints.

For example, a menu item SKU or customer email should normally be unique within
one restaurant rather than across the entire platform.

`User` is the only current exception to the required `restaurantId` rule because
it can represent a global super administrator. Its invariants are:

- `SUPER_ADMIN`: exactly one global account may exist; `restaurantId` must be
  `null`; `phone` may be `null`; it can work across tenants;
- `OWNER`: `restaurantId` must reference the owned restaurant and `phone` is
  required;
- `EMPLOYEE`: `restaurantId` must reference the employing restaurant and
  `phone` is required.

`User` represents back-office and staff accounts. Customer identities and
delivery contacts should be modeled separately in a future tenant-owned
`Customer` domain rather than adding a customer role to `User`.

User passwords are stored as bcrypt hashes in `User.password`; plaintext
passwords must never be persisted. The database seed provisions the global
administrator from `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, and the optional
`SUPER_ADMIN_NAME` environment variable. Re-running the seed updates that
single administrator's email, credentials, and active state. A partial unique
database index prevents creating a second `SUPER_ADMIN` account.

Prisma Schema Language cannot express these conditional rules for
`restaurantId` and `phone`. Application services must enforce them, and the
first database migration should add equivalent PostgreSQL `CHECK` constraints.

## Database clients

Application handlers for restaurant users must call
`getRestaurantDb(restaurantId)` from `lib/prisma.ts`. It injects the restaurant
constraint into root reads and writes, prevents tenant reassignment, and rejects
the `SUPER_ADMIN` role.

Cross-tenant admin handlers must call `getSuperAdminDb(userId)`. It returns the
global client only after verifying that the user is active, has the
`SUPER_ADMIN` role, and has no restaurant.

`systemDb` is intentionally unscoped. It is reserved for trusted infrastructure
such as initial super-admin provisioning, migrations, and controlled background
jobs. Never use it directly in a request handler or with tenant-controlled
identifiers.

Prisma query extensions do not intercept nested writes. Keep nested writes
inside a tenant-owned parent relation, or use explicit root operations through
the scoped client. PostgreSQL row-level security can later provide an additional
database-level boundary.
