import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  company: z.string().max(100).optional().default(""),
  email: z.string().email("E-mail inválido").max(320),
  subject: z.string().min(1, "Selecione um assunto").max(100),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(2000),
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(contactSchema)
      .mutation(async ({ input }) => {
        const { name, company, email, subject, message } = input;

        const companyLine = company ? `\nEmpresa: ${company}` : "";
        const content = [
          `Nova mensagem recebida pelo formulário de contato do site Digitus.`,
          ``,
          `Nome: ${name}${companyLine}`,
          `E-mail: ${email}`,
          `Assunto: ${subject}`,
          ``,
          `Mensagem:`,
          message,
          ``,
          `---`,
          `Responder para: ${email}`,
          `Destinatário: atendimento@digitus.com.vc`,
        ].join("\n");

        try {
          const notified = await notifyOwner({
            title: `[Digitus] Novo contato: ${subject} — ${name}`,
            content,
          });
          if (!notified) {
            console.warn("[Contact] notifyOwner returned false (service temporarily unavailable)");
          }
        } catch (err) {
          console.error("[Contact] Failed to notify owner:", err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao enviar mensagem. Por favor, tente novamente.",
          });
        }

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
