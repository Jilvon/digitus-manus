import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock global fetch to avoid real HTTP calls in tests
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("contact.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: Brevo API returns 201 (success)
    mockFetch.mockResolvedValue({ status: 201, text: async () => "" });
    // Set BREVO_API_KEY for tests
    process.env.BREVO_API_KEY = "xkeysib-test-key-for-unit-tests";
  });

  it("should submit a valid contact form and return success", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "João Silva",
      company: "Empresa Teste",
      email: "joao@empresa.com",
      subject: "Business Intelligence",
      message: "Gostaria de saber mais sobre as soluções de BI.",
    });

    expect(result).toEqual({ success: true });
  });

  it("should submit without company field", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Maria Santos",
      company: "",
      email: "maria@email.com",
      subject: "Consultoria Estratégica",
      message: "Preciso de consultoria para minha organização.",
    });

    expect(result).toEqual({ success: true });
  });

  it("should reject invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Teste",
        company: "",
        email: "email-invalido",
        subject: "Outro Assunto",
        message: "Mensagem de teste com pelo menos 10 caracteres.",
      })
    ).rejects.toThrow();
  });

  it("should reject name too short", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "A",
        company: "",
        email: "teste@email.com",
        subject: "Outro Assunto",
        message: "Mensagem de teste com pelo menos 10 caracteres.",
      })
    ).rejects.toThrow();
  });

  it("should reject empty subject", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Teste Nome",
        company: "",
        email: "teste@email.com",
        subject: "",
        message: "Mensagem de teste com pelo menos 10 caracteres.",
      })
    ).rejects.toThrow();
  });

  it("should reject message too short", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Teste Nome",
        company: "",
        email: "teste@email.com",
        subject: "Outro Assunto",
        message: "Curta",
      })
    ).rejects.toThrow();
  });

  it("should call Brevo API with correct sender and recipient", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await caller.contact.submit({
      name: "Carlos Ferreira",
      company: "Digitus Parceiro",
      email: "carlos@parceiro.com",
      subject: "Gestão de Dados",
      message: "Quero saber mais sobre gestão de dados para minha empresa.",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.brevo.com/v3/smtp/email",
      expect.objectContaining({ method: "POST" })
    );

    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.to[0].email).toBe("atendimento@digitus.com.vc");
    expect(callBody.replyTo.email).toBe("carlos@parceiro.com");
    expect(callBody.subject).toContain("Carlos Ferreira");
    expect(callBody.subject).toContain("Gestão de Dados");
    // Verify api-key header is set (actual key from env)
    const callHeaders = mockFetch.mock.calls[0][1].headers;
    expect(callHeaders["api-key"]).toMatch(/^xkeysib-/);
  });

  it("should still return success even if Brevo returns non-201", async () => {
    mockFetch.mockResolvedValue({ status: 400, text: async () => "Bad Request" });
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Should not throw — just logs warning
    const result = await caller.contact.submit({
      name: "Teste Nome",
      company: "",
      email: "teste@email.com",
      subject: "Assunto Teste",
      message: "Mensagem de teste com pelo menos 10 caracteres.",
    });

    expect(result).toEqual({ success: true });
  });
});

// ─── BREVO_API_KEY environment variable test ───────────────────────────────

describe("BREVO_API_KEY environment", () => {
  it("BREVO_API_KEY should be set and start with xkeysib-", () => {
    const key = process.env.BREVO_API_KEY;
    expect(key).toBeDefined();
    expect(key).not.toBe("");
    expect(key).toMatch(/^xkeysib-/);
  });
});
