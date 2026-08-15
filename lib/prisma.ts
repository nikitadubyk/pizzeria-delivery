import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

type QueryInput = Record<string, unknown>;

type QueryArgs = {
  where?: QueryInput;
  create?: QueryInput;
  update?: QueryInput;
  data?: QueryInput | QueryInput[];
};

function makePrisma() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  systemDb: ReturnType<typeof makePrisma> | undefined;
};

/**
 * Unscoped access for trusted infrastructure code (tenant provisioning, jobs,
 * migrations). Request handlers should use getRestaurantDb instead.
 */
export const systemDb = globalForPrisma.systemDb ?? makePrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.systemDb = systemDb;
}

function assertRestaurantId(restaurantId: string): void {
  if (!restaurantId.trim()) {
    throw new Error("A non-empty restaurantId is required");
  }
}

function withWhere(
  args: QueryArgs,
  key: "id" | "restaurantId",
  value: string,
): QueryArgs {
  return {
    ...args,
    where: {
      ...args.where,
      [key]: value,
    },
  };
}

function scopedCreateData(
  data: QueryInput | QueryInput[],
  restaurantId: string,
): QueryInput | QueryInput[] {
  const items = Array.isArray(data) ? data : [data];
  const scoped = items.map((item) => {
    if (
      "restaurantId" in item &&
      item.restaurantId !== undefined &&
      item.restaurantId !== restaurantId
    ) {
      throw new Error("Cannot create data for another restaurant");
    }

    if ("restaurant" in item) {
      throw new Error(
        "Use restaurantId from getRestaurantDb; nested restaurant writes are forbidden",
      );
    }

    return { ...item, restaurantId };
  });

  return Array.isArray(data) ? scoped : scoped[0];
}

function assertTenantIsNotChanged(data: QueryInput | undefined): void {
  if (!data) return;

  if ("restaurantId" in data || "restaurant" in data) {
    throw new Error("Changing a record's restaurant is forbidden");
  }
}

function isSuperAdminRole(value: unknown): boolean {
  if (value === "SUPER_ADMIN") return true;

  return (
    typeof value === "object" &&
    value !== null &&
    "set" in value &&
    (value as { set?: unknown }).set === "SUPER_ADMIN"
  );
}

function assertTenantUserRole(
  model: string,
  data: QueryInput | QueryInput[] | undefined,
): void {
  if (model !== "User" || !data) return;

  const items = Array.isArray(data) ? data : [data];
  if (items.some((item) => isSuperAdminRole(item.role))) {
    throw new Error(
      "SUPER_ADMIN is a global role and cannot be managed through a restaurant-scoped client",
    );
  }
}

function hasNonEmptyPhone(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;

  return (
    typeof value === "object" &&
    value !== null &&
    "set" in value &&
    typeof (value as { set?: unknown }).set === "string" &&
    ((value as { set: string }).set.trim().length > 0)
  );
}

function assertTenantUserPhone(
  model: string,
  data: QueryInput | QueryInput[] | undefined,
  required: boolean,
): void {
  if (model !== "User" || !data) return;

  const items = Array.isArray(data) ? data : [data];
  for (const item of items) {
    if (required && !("phone" in item)) {
      throw new Error("Restaurant owners and employees must have a phone");
    }

    if ("phone" in item && !hasNonEmptyPhone(item.phone)) {
      throw new Error("Restaurant owners and employees must have a phone");
    }
  }
}

function scopeTenantOperation(
  model: string,
  operation: string,
  rawArgs: unknown,
  restaurantId: string,
): QueryArgs {
  const args = rawArgs as QueryArgs;

  switch (operation) {
    case "findUnique":
    case "findUniqueOrThrow":
    case "findFirst":
    case "findFirstOrThrow":
    case "findMany":
    case "count":
    case "aggregate":
    case "groupBy":
    case "delete":
    case "deleteMany":
      return withWhere(args, "restaurantId", restaurantId);
    case "update":
    case "updateMany":
    case "updateManyAndReturn":
      assertTenantIsNotChanged(args.data as QueryInput | undefined);
      assertTenantUserRole(model, args.data);
      assertTenantUserPhone(model, args.data, false);
      return withWhere(args, "restaurantId", restaurantId);
    case "create":
    case "createMany":
    case "createManyAndReturn":
      assertTenantUserRole(model, args.data);
      assertTenantUserPhone(model, args.data, true);
      return {
        ...args,
        data: scopedCreateData(args.data ?? {}, restaurantId),
      };
    case "upsert":
      assertTenantIsNotChanged(args.update);
      assertTenantUserRole(model, args.create);
      assertTenantUserRole(model, args.update);
      assertTenantUserPhone(model, args.create, true);
      assertTenantUserPhone(model, args.update, false);
      return {
        ...withWhere(args, "restaurantId", restaurantId),
        create: scopedCreateData(args.create ?? {}, restaurantId) as QueryInput,
      };
    default:
      throw new Error(
        `Prisma operation ${operation} is not allowed until tenant scoping is defined`,
      );
  }
}

function scopeRestaurantOperation(
  operation: string,
  rawArgs: unknown,
  restaurantId: string,
): QueryArgs {
  const args = rawArgs as QueryArgs;

  switch (operation) {
    case "findUnique":
    case "findUniqueOrThrow":
    case "findFirst":
    case "findFirstOrThrow":
    case "findMany":
    case "count":
    case "aggregate":
    case "groupBy":
    case "delete":
    case "deleteMany":
      return withWhere(args, "id", restaurantId);
    case "update":
    case "updateMany":
    case "updateManyAndReturn":
      if (args.data && "id" in args.data) {
        throw new Error("Changing a restaurant id is forbidden");
      }
      return withWhere(args, "id", restaurantId);
    case "create":
    case "createMany":
    case "createManyAndReturn":
    case "upsert":
      throw new Error(
        "Restaurants must be provisioned through the trusted system database",
      );
    default:
      throw new Error(
        `Prisma operation ${operation} is not allowed until tenant scoping is defined`,
      );
  }
}

/**
 * Returns a lightweight Prisma Client variant bound to one restaurant.
 *
 * Every model except Restaurant is tenant-owned by default. This is deliberate:
 * a new model without restaurantId fails closed instead of returning another
 * tenant's data. Add restaurantId to every new business model.
 */
export function getRestaurantDb(restaurantId: string) {
  assertRestaurantId(restaurantId);

  return systemDb.$extends({
    name: "restaurant-scope",
    query: {
      $allModels: {
        $allOperations({ model, operation, args, query }) {
          const scopedArgs =
            model === "Restaurant"
              ? scopeRestaurantOperation(operation, args, restaurantId)
              : scopeTenantOperation(model, operation, args, restaurantId);

          return query(scopedArgs as typeof args);
        },
      },
    },
  });
}

export type RestaurantDb = ReturnType<typeof getRestaurantDb>;

/**
 * Verifies a global administrator before allowing cross-tenant access.
 * Authentication must already have established the trusted user id.
 */
export async function getSuperAdminDb(userId: string) {
  if (!userId.trim()) {
    throw new Error("A non-empty userId is required");
  }

  const superAdmin = await systemDb.user.findFirst({
    where: {
      id: userId,
      role: "SUPER_ADMIN",
      restaurantId: null,
      isActive: true,
    },
    select: { id: true },
  });

  if (!superAdmin) {
    throw new Error("Active super administrator access is required");
  }

  return systemDb;
}

export type SuperAdminDb = Awaited<ReturnType<typeof getSuperAdminDb>>;
