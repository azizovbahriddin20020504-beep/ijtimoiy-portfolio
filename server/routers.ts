import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getUserPortfolio, getProfile, listUsers, getDb, profiles, goals, activities, projects, achievements, reflections, evidence, users } from "./db";

const profileInput = z.object({ fullName: z.string().max(255).optional(), school: z.string().max(255).optional(), className: z.string().max(32).optional(), academicYear: z.string().max(32).optional(), advisor: z.string().max(255).optional(), interests: z.string().optional(), strengths: z.string().optional(), goalsSummary: z.string().optional() });
const activityInput = z.object({ date: z.string(), eventName: z.string().min(1), organization: z.string().optional(), workDone: z.string().optional(), role: z.string().optional(), hours: z.number().min(0).max(1000) });
const goalInput = z.object({ title: z.string().min(1), deadline: z.string().optional(), status: z.string().optional(), progress: z.number().int().min(0).max(100).optional() });
const projectInput = z.object({ title: z.string().min(1), role: z.string().optional(), teamSize: z.number().int().min(0).optional(), duration: z.string().optional(), outcome: z.string().optional() });
const achievementInput = z.object({ category: z.string().optional(), title: z.string().min(1), date: z.string().optional(), eventName: z.string().optional(), result: z.string().optional(), evidenceUrl: z.string().url().optional().or(z.literal("")) });
const reflectionInput = z.object({ quarter: z.string().min(1), benefit: z.string().optional(), challenge: z.string().optional(), skill: z.string().optional(), nextGoal: z.string().optional() });
const evidenceInput = z.object({ title: z.string().min(1), type: z.string().optional(), url: z.string().url().optional().or(z.literal("")) });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  portfolio: router({
    mine: protectedProcedure.query(({ ctx }) => getUserPortfolio(ctx.user.id)),
    saveProfile: protectedProcedure.input(profileInput).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Ma’lumotlar bazasi ulanmagan" }); const existing = await getProfile(ctx.user.id); if (existing) await db.update(profiles).set(input).where(eq(profiles.userId, ctx.user.id)); else await db.insert(profiles).values({ userId: ctx.user.id, ...input }); return { success: true }; }),
    createGoal: protectedProcedure.input(goalInput).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }); await db.insert(goals).values({ userId: ctx.user.id, ...input }); return { success: true }; }),
    createActivity: protectedProcedure.input(activityInput).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }); await db.insert(activities).values({ userId: ctx.user.id, ...input, hours: String(input.hours) }); return { success: true }; }),
    createProject: protectedProcedure.input(projectInput).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }); await db.insert(projects).values({ userId: ctx.user.id, ...input }); return { success: true }; }),
    createAchievement: protectedProcedure.input(achievementInput).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }); await db.insert(achievements).values({ userId: ctx.user.id, ...input }); return { success: true }; }),
    createReflection: protectedProcedure.input(reflectionInput).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }); await db.insert(reflections).values({ userId: ctx.user.id, ...input }); return { success: true }; }),
    createEvidence: protectedProcedure.input(evidenceInput).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }); await db.insert(evidence).values({ userId: ctx.user.id, ...input }); return { success: true }; }),
  }),
  admin: router({
    users: adminProcedure.query(() => listUsers()),
    portfolio: adminProcedure.input(z.object({ userId: z.number().int().positive() })).query(({ input }) => getUserPortfolio(input.userId)),
    setRole: adminProcedure.input(z.object({ userId: z.number().int().positive(), role: z.enum(["user", "admin", "advisor"]) })).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }); await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId)); return { success: true }; }),
    updateActivityStatus: adminProcedure.input(z.object({ activityId: z.number().int().positive(), status: z.enum(["pending", "approved", "needs_review", "rejected"]) })).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }); await db.update(activities).set({ status: input.status }).where(eq(activities.id, input.activityId)); return { success: true }; }),
    allData: adminProcedure.query(async () => { const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }); const [activityRows, projectRows, reflectionRows, evidenceRows] = await Promise.all([db.select().from(activities), db.select().from(projects), db.select().from(reflections), db.select().from(evidence)]); return { activities: activityRows, projects: projectRows, reflections: reflectionRows, evidence: evidenceRows }; }),
  }),
});
export type AppRouter = typeof appRouter;
