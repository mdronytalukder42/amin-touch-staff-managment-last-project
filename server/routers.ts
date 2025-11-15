import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ 
      code: 'FORBIDDEN',
      message: 'Admin access required' 
    });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Income Entry operations
  income: router({
    create: protectedProcedure
      .input(z.object({
        date: z.string(),
        time: z.string(),
        type: z.enum(["Income Add", "Income Minus", "Income Payment", "OTP Add", "OTP Minus", "OTP Payment"]),
        amount: z.number(),
        description: z.string(),
        recipient: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createIncomeEntry({
          userId: ctx.user.id,
          userName: ctx.user.name || 'Unknown',
          ...input,
        });
      }),

    list: protectedProcedure
      .input(z.object({
        userId: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        // Staff can only see their own entries
        const userId = ctx.user.role === 'admin' ? input?.userId : ctx.user.id;
        return await db.getIncomeEntries(userId, input?.startDate, input?.endDate);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        date: z.string().optional(),
        time: z.string().optional(),
        type: z.enum(["Income Add", "Income Minus", "Income Payment", "OTP Add", "OTP Minus", "OTP Payment"]).optional(),
        amount: z.number().optional(),
        description: z.string().optional(),
        recipient: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        
        // Check ownership for non-admin users
        if (ctx.user.role !== 'admin') {
          const entries = await db.getIncomeEntries(ctx.user.id);
          const entry = entries.find(e => e.id === id);
          if (!entry) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' });
          }
        }
        
        return await db.updateIncomeEntry(id, updates);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Check ownership for non-admin users
        if (ctx.user.role !== 'admin') {
          const entries = await db.getIncomeEntries(ctx.user.id);
          const entry = entries.find(e => e.id === input.id);
          if (!entry) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' });
          }
        }
        
        await db.deleteIncomeEntry(input.id);
        return { success: true };
      }),
  }),

  // Ticket Entry operations
  ticket: router({
    create: protectedProcedure
      .input(z.object({
        issueDate: z.string(),
        passengerName: z.string(),
        pnr: z.string(),
        tripType: z.enum(["1 Way", "Return"]),
        flightName: z.string(),
        from: z.string(),
        to: z.string(),
        departureDate: z.string(),
        arrivalDate: z.string(),
        returnDate: z.string().optional(),
        fromIssuer: z.string(),
        bdNumber: z.string().optional(),
        qrNumber: z.string().optional(),
        ticketCopyUrl: z.string().optional(),
        ticketCopyFileName: z.string().optional(),
        status: z.enum(["Pending", "Confirmed", "Cancelled"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createTicketEntry({
          userId: ctx.user.id,
          userName: ctx.user.name || 'Unknown',
          status: input.status || "Pending",
          ...input,
        });
      }),

    list: protectedProcedure
      .input(z.object({
        userId: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        // Staff can only see their own entries
        const userId = ctx.user.role === 'admin' ? input?.userId : ctx.user.id;
        return await db.getTicketEntries(userId, input?.startDate, input?.endDate);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        issueDate: z.string().optional(),
        passengerName: z.string().optional(),
        pnr: z.string().optional(),
        tripType: z.enum(["1 Way", "Return"]).optional(),
        flightName: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        departureDate: z.string().optional(),
        arrivalDate: z.string().optional(),
        returnDate: z.string().optional(),
        fromIssuer: z.string().optional(),
        bdNumber: z.string().optional(),
        qrNumber: z.string().optional(),
        ticketCopyUrl: z.string().optional(),
        ticketCopyFileName: z.string().optional(),
        status: z.enum(["Pending", "Confirmed", "Cancelled"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        
        // Check ownership for non-admin users
        if (ctx.user.role !== 'admin') {
          const entries = await db.getTicketEntries(ctx.user.id);
          const entry = entries.find(e => e.id === id);
          if (!entry) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' });
          }
        }
        
        return await db.updateTicketEntry(id, updates);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Check ownership for non-admin users
        if (ctx.user.role !== 'admin') {
          const entries = await db.getTicketEntries(ctx.user.id);
          const entry = entries.find(e => e.id === input.id);
          if (!entry) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' });
          }
        }
        
        await db.deleteTicketEntry(input.id);
        return { success: true };
      }),
  }),

  // User management (admin only)
  users: router({
    list: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),
  }),
});

export type AppRouter = typeof appRouter;
