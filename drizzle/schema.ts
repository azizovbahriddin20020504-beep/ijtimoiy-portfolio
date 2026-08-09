import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "advisor"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(), userId: int("userId").notNull().unique(), fullName: varchar("fullName", { length: 255 }), school: varchar("school", { length: 255 }), className: varchar("className", { length: 32 }), academicYear: varchar("academicYear", { length: 32 }), advisor: varchar("advisor", { length: 255 }), interests: text("interests"), strengths: text("strengths"), goalsSummary: text("goalsSummary"), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const goals = mysqlTable("goals", { id: int("id").autoincrement().primaryKey(), userId: int("userId").notNull(), title: varchar("title", { length: 255 }).notNull(), deadline: varchar("deadline", { length: 64 }), status: varchar("status", { length: 64 }).default("Rejalashtirilmoqda").notNull(), progress: int("progress").default(0).notNull(), createdAt: timestamp("createdAt").defaultNow().notNull() });
export const activities = mysqlTable("activities", { id: int("id").autoincrement().primaryKey(), userId: int("userId").notNull(), date: varchar("date", { length: 32 }).notNull(), eventName: varchar("eventName", { length: 255 }).notNull(), organization: varchar("organization", { length: 255 }), workDone: text("workDone"), role: varchar("role", { length: 128 }), hours: decimal("hours", { precision: 8, scale: 2 }).default("0").notNull(), status: mysqlEnum("status", ["pending", "approved", "needs_review", "rejected"]).default("pending").notNull(), createdAt: timestamp("createdAt").defaultNow().notNull() });
export const projects = mysqlTable("projects", { id: int("id").autoincrement().primaryKey(), userId: int("userId").notNull(), title: varchar("title", { length: 255 }).notNull(), role: varchar("role", { length: 128 }), teamSize: int("teamSize"), duration: varchar("duration", { length: 64 }), outcome: text("outcome"), createdAt: timestamp("createdAt").defaultNow().notNull() });
export const achievements = mysqlTable("achievements", { id: int("id").autoincrement().primaryKey(), userId: int("userId").notNull(), category: varchar("category", { length: 128 }), title: varchar("title", { length: 255 }).notNull(), date: varchar("date", { length: 32 }), eventName: varchar("eventName", { length: 255 }), result: varchar("result", { length: 255 }), evidenceUrl: text("evidenceUrl"), createdAt: timestamp("createdAt").defaultNow().notNull() });
export const reflections = mysqlTable("reflections", { id: int("id").autoincrement().primaryKey(), userId: int("userId").notNull(), quarter: varchar("quarter", { length: 32 }).notNull(), benefit: text("benefit"), challenge: text("challenge"), skill: text("skill"), nextGoal: text("nextGoal"), createdAt: timestamp("createdAt").defaultNow().notNull() });
export const evidence = mysqlTable("evidence", { id: int("id").autoincrement().primaryKey(), userId: int("userId").notNull(), title: varchar("title", { length: 255 }).notNull(), type: varchar("type", { length: 64 }), url: text("url"), fileKey: text("fileKey"), createdAt: timestamp("createdAt").defaultNow().notNull() });
export const evaluations = mysqlTable("evaluations", { id: int("id").autoincrement().primaryKey(), userId: int("userId").notNull(), quarter: varchar("quarter", { length: 32 }).notNull(), activity: int("activity").default(0).notNull(), initiative: int("initiative").default(0).notNull(), reflection: int("reflection").default(0).notNull(), verification: int("verification").default(0).notNull(), documentation: int("documentation").default(0).notNull(), feedback: text("feedback"), createdAt: timestamp("createdAt").defaultNow().notNull() });

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
