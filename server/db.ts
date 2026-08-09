import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, User, users, profiles, goals, activities, projects, achievements, reflections, evidence, evaluations } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
export async function getDb() { if (!_db && process.env.DATABASE_URL) { try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); } } return _db; }

export function isPortfolioAdminEmail(email?: string | null) { return email?.toLowerCase() === "azizovbahriddin20020504@gmail.com"; }

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) return;
  const isAdmin = isPortfolioAdminEmail(user.email) || user.openId === ENV.ownerOpenId;
  const values: InsertUser = { openId: user.openId, name: user.name, email: user.email, loginMethod: user.loginMethod, lastSignedIn: user.lastSignedIn ?? new Date(), role: isAdmin ? "admin" : (user.role ?? "user") };
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: { name: values.name, email: values.email, loginMethod: values.loginMethod, lastSignedIn: values.lastSignedIn, ...(isAdmin ? { role: "admin" as const } : {}) } });
}
export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0]; }
export async function getProfile(userId: number) { const db = await getDb(); if (!db) return undefined; return (await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1))[0]; }
export async function getUserPortfolio(userId: number) { const db = await getDb(); if (!db) return { profile: undefined, goals: [], activities: [], projects: [], achievements: [], reflections: [], evidence: [], evaluations: [] }; const [profile, goalRows, activityRows, projectRows, achievementRows, reflectionRows, evidenceRows, evaluationRows] = await Promise.all([db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1), db.select().from(goals).where(eq(goals.userId, userId)).orderBy(desc(goals.createdAt)), db.select().from(activities).where(eq(activities.userId, userId)).orderBy(desc(activities.createdAt)), db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt)), db.select().from(achievements).where(eq(achievements.userId, userId)).orderBy(desc(achievements.createdAt)), db.select().from(reflections).where(eq(reflections.userId, userId)).orderBy(desc(reflections.createdAt)), db.select().from(evidence).where(eq(evidence.userId, userId)).orderBy(desc(evidence.createdAt)), db.select().from(evaluations).where(eq(evaluations.userId, userId)).orderBy(desc(evaluations.createdAt))]); return { profile: profile[0], goals: goalRows, activities: activityRows, projects: projectRows, achievements: achievementRows, reflections: reflectionRows, evidence: evidenceRows, evaluations: evaluationRows }; }
export async function listUsers() { const db = await getDb(); if (!db) return []; return db.select().from(users).orderBy(desc(users.createdAt)); }
export { users, profiles, goals, activities, projects, achievements, reflections, evidence, evaluations };
export type { User };
