import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
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

async function sendBrevoEmail(data: {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const apiKey = ENV.brevoApiKey;
  if (!apiKey) {
    console.warn("[Brevo] BREVO_API_KEY não configurada — e-mail não enviado.");
    return false;
  }

  const companyLine = data.company
    ? `<p><strong>Empresa:</strong> ${data.company}</p>`
    : "";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #0a1628; border-bottom: 2px solid #1e40af; padding-bottom: 8px;">
        Novo contato via site Digitus
      </h2>
      <p><strong>Nome:</strong> ${data.name}</p>
      ${companyLine}
      <p><strong>E-mail:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      <p><strong>Assunto:</strong> ${data.subject}</p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;" />
      <h3 style="color: #1e40af;">Mensagem:</h3>
      <p style="white-space: pre-wrap; background: #f8fafc; padding: 16px; border-radius: 4px; border-left: 4px solid #1e40af;">
        ${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}
      </p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;" />
      <p style="color: #64748b; font-size: 12px;">
        Mensagem enviada pelo formulário de contato em <strong>digitus.com.vc</strong>.<br>
        Para responder, utilize o e-mail: <a href="mailto:${data.email}">${data.email}</a>
      </p>
    </div>
  `;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Digitus Site", email: "atendimento@digitus.com.vc" },
        to: [{ email: "atendimento@digitus.com.vc", name: "Atendimento Digitus" }],
        replyTo: { email: data.email, name: data.name },
        subject: `[Digitus] Novo contato: ${data.subject} — ${data.name}`,
        htmlContent,
      }),
    });

    if (response.status === 201) {
      return true;
    }

    const errorBody = await response.text().catch(() => "");
    console.warn(`[Brevo] Falha ao enviar e-mail (${response.status}): ${errorBody}`);
    return false;
  } catch (err) {
    console.error("[Brevo] Erro na chamada à API:", err);
    return false;
  }
}

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

        try {
          const sent = await sendBrevoEmail({ name, company, email, subject, message });
          if (!sent) {
            console.warn("[Contact] E-mail não enviado via Brevo (verifique a chave e o sender).");
          }
        } catch (err) {
          console.error("[Contact] Erro inesperado ao enviar e-mail:", err);
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
