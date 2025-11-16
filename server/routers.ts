import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";

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
    
    // Custom login procedure with session-based auth
    login: publicProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserByUsername(input.username);
        
        if (!user || user.password !== input.password) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid username or password',
          });
        }

        // Update last signed in
        await db.updateUserLastSignIn(user.id);

        // Create session
        const sessionId = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        
        await db.createSession({
          id: sessionId,
          userId: user.id,
          expiresAt,
        });

        // Set cookie with session ID
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionId, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      }),

    logout: publicProcedure.mutation(async ({ ctx }) => {
      // Delete session from database
      const cookies = ctx.req.headers.cookie?.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      
      const sessionId = cookies?.[COOKIE_NAME];
      if (sessionId) {
        await db.deleteSession(sessionId);
      }
      
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),

    // Change password
    changePassword: protectedProcedure
      .input(z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(6),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        
        if (!user || user.password !== input.currentPassword) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Current password is incorrect',
          });
        }

        await db.updateUserPassword(user.id, input.newPassword);

        return {
          success: true,
          message: 'Password changed successfully',
        };
      }),
  }),

  // Income entries router
  income: router({
    // Get all income entries (admin only)
    getAll: adminProcedure.query(async () => {
      return await db.getAllIncomeEntries();
    }),

    // Get user's own income entries
    getMy: protectedProcedure.query(async ({ ctx }) => {
      return await db.getIncomeEntriesByUserId(ctx.user.id);
    }),

    // Create income entry
    create: protectedProcedure
      .input(z.object({
        date: z.string(),
        time: z.string(),
        type: z.enum([
          "Income Add",
          "Income Minus",
          "Income Payment",
          "OTP Add",
          "OTP Minus",
          "OTP Payment"
        ]),
        amount: z.number().int(),
        description: z.string(),
        recipient: z.string().optional(),
        receivedFrom: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const entry = await db.createIncomeEntry({
          ...input,
          userId: ctx.user.id,
          userName: ctx.user.name || 'Unknown',
        });
        return entry;
      }),

    // Get statistics
    getStats: protectedProcedure.query(async ({ ctx }) => {
      return await db.getIncomeStats(ctx.user.id);
    }),

    // Get admin statistics (all users)
    getAdminStats: adminProcedure.query(async () => {
      return await db.getAdminIncomeStats();
    }),

    // Update income entry (own entries only)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        date: z.string(),
        time: z.string(),
        type: z.enum([
          "Income Add",
          "Income Minus",
          "Income Payment",
          "OTP Add",
          "OTP Minus",
          "OTP Payment"
        ]),
        amount: z.number().int(),
        description: z.string(),
        recipient: z.string().optional(),
        receivedFrom: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const entry = await db.getIncomeEntryById(input.id);
        if (!entry || entry.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Cannot update this entry',
          });
        }
        return await db.updateIncomeEntry(input.id, input);
      }),

    // Delete income entry (own entries only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const entry = await db.getIncomeEntryById(input.id);
        if (!entry || entry.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Cannot delete this entry',
          });
        }
        return await db.deleteIncomeEntry(input.id);
      }),
  }),

  // Ticket entries router
  ticket: router({
    // Get all ticket entries (admin only)
    getAll: adminProcedure.query(async () => {
      return await db.getAllTicketEntries();
    }),

    // Get user's own ticket entries
    getMy: protectedProcedure.query(async ({ ctx }) => {
      return await db.getTicketEntriesByUserId(ctx.user.id);
    }),

    // Create ticket entry
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
        source: z.string().optional(),
        status: z.enum(["Pending", "Confirmed", "Cancelled"]).default("Pending"),
      }))
      .mutation(async ({ ctx, input }) => {
        const entry = await db.createTicketEntry({
          ...input,
          userId: ctx.user.id,
          userName: ctx.user.name || 'Unknown',
        });
        return entry;
      }),

    // Get statistics
    getStats: protectedProcedure.query(async ({ ctx }) => {
      return await db.getTicketStats(ctx.user.id);
    }),

    // Get admin statistics (all users)
    getAdminStats: adminProcedure.query(async () => {
      return await db.getAdminTicketStats();
    }),

    // Search tickets by name or PNR
    search: protectedProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role === 'admin') {
          return await db.searchTickets(input.query);
        } else {
          return await db.searchTicketsByUser(ctx.user.id, input.query);
        }
      }),

    // Update ticket entry (own entries only)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
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
        source: z.string().optional(),
        bdNumber: z.string().optional(),
        qrNumber: z.string().optional(),
        ticketCopyUrl: z.string().optional(),
        ticketCopyFileName: z.string().optional(),
        status: z.enum(["Pending", "Confirmed", "Cancelled"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const entry = await db.getTicketEntryById(input.id);
        if (!entry || entry.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Cannot update this entry',
          });
        }
        return await db.updateTicketEntry(input.id, input);
      }),

    // Delete ticket entry (own entries only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const entry = await db.getTicketEntryById(input.id);
        if (!entry || entry.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Cannot delete this entry',
          });
        }
        return await db.deleteTicketEntry(input.id);
      }),

    // Upload ticket copy file
    uploadTicketCopy: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        mimeType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { storagePut } = await import('./storage');
        const buffer = Buffer.from(input.fileData, 'base64');
        const fileKey = `ticket-copies/${Date.now()}-${input.fileName}`;
        const result = await storagePut(fileKey, buffer, input.mimeType);
        return {
          url: result.url,
          fileName: input.fileName,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
