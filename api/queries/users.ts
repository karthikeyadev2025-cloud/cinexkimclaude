import { eq } from "drizzle-orm";
import * as schema from "../../db/schema.js";
import type { InsertUser } from "../../db/schema.js";
import { getDb } from "./connection.js";
import { env } from "../lib/env.js";

export async function findUserByUnionId(unionId: string) {
  return getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.unionId, unionId))
    .then((rows) => rows.at(0));
}

export async function findUserByEmail(email: string) {
  return getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .then((rows) => rows.at(0));
}

export async function upsertUser(data: InsertUser) {
  const values = { ...data };
  const updateSet: Partial<InsertUser> = {
    lastSignInAt: new Date(),
    ...data,
  };

  if (
    values.role === undefined &&
    values.unionId &&
    values.unionId === env.ownerUnionId
  ) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  await getDb()
    .insert(schema.users)
    .values(values)
    .onConflictDoUpdate({
      target: schema.users.unionId,
      set: updateSet,
    });
}
