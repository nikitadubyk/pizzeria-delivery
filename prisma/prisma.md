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

## Restaurant admin authentication

The current scope is login and the first protected page at `/admin`.
`/admin/login` accepts only an email or phone and password. The trusted
`findRestaurantUsersForLogin` infrastructure helper looks up staff accounts
across restaurants for authentication only; it grants no business-data access.
Staff phone numbers and case-insensitive emails are globally unique across
restaurants. PostgreSQL partial unique indexes enforce this for OWNER/EMPLOYEE
accounts, including concurrent writes. A conflict returns HTTP 409. The login
service also rejects ambiguous identities defensively.

`app/api/admin/auth.service.ts` verifies credentials and creates an identity.
`auth.repository.ts` owns database queries, `auth.validation.ts` owns input
validation. The login form calls POST /api/admin/login and stores the returned token in localStorage. The RTK Query API loads GET /api/admin/me; RestaurantAuthGuard protects every page in the protected layout and exposes the verified identity through context. Formik and the API share lib/validation/restaurant-login.ts.
Password helpers and `lib/auth/jwt.service.ts` are shared with super admin.

The restaurant id in the signed session comes from the authenticated User row,
never from the login form. Subsequent user queries use `getRestaurantDb` with
the verified token's restaurant id. Active OWNER/EMPLOYEE accounts in ACTIVE
restaurants can access the first page; other accounts are rejected. The session
is checked against the database on each protected request.

Restaurant tokens use the separate localStorage key `restaurantAccessToken`, expire after 12 hours and have their own JWT issuer, audience and
type. The signed session version is the user's `authVersion`. The PostgreSQL
User_auth_version trigger increments it when password, role, restaurantId or
isActive changes, including direct SQL updates. Name and contact edits preserve
sessions. Explicit session revocation can increment authVersion. This trigger
and the partial unique indexes live in the restaurant_login_identity migration;
Prisma schema generation alone does not create them. Existing tokens from the
previous timestamp format require a new login. Logout removes the token from localStorage; no server session registry is added.
`/api/admin/me` returns only the safe identity DTO. Menu, orders, staff management,
settings and recovery remain future work.

Requests authenticate with Authorization: Bearer; cookies are not used. Server-rendered admin HTML contains no restaurant data. Each protected API verifies the token and current database state. The token key is separate from super admin, and storage events synchronize logout across tabs.
