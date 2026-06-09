import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock notifyOwner to avoid real HTTP calls in tests
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

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

  it("should reject empty name", async () => {
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

  it("should call notifyOwner with correct title format", async () => {
    const { notifyOwner } = await import("./_core/notification");
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await caller.contact.submit({
      name: "Carlos Ferreira",
      company: "Digitus Parceiro",
      email: "carlos@parceiro.com",
      subject: "Gestão de Dados",
      message: "Quero saber mais sobre gestão de dados para minha empresa.",
    });

    expect(notifyOwner).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining("Carlos Ferreira"),
        content: expect.stringContaining("carlos@parceiro.com"),
      })
    );
  });
});
