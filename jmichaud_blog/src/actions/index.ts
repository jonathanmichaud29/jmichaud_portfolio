import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const submissions = new Map<string, number[]>(); // in-memory, single-instance only — same caveat as before

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
const safeHeader = (s: string) => s.replace(/[\r\n]/g, " ").slice(0, 200);

export const server = {
  contactForm: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(1).max(200),
      email: z.string().trim().toLowerCase().pipe(z.email()),
      message: z.string().min(1).max(5000),
      _gotcha: z.string().optional(),
      _js: z.string().optional(),
    }),
    handler: async ({ name, email, message, _gotcha, _js }, ctx) => {
      if (_gotcha || _js !== "1") return { success: true }; // bot signal — fake success, no send

      const ip =
        ctx.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "unknown";
      const now = Date.now();
      const hits = (submissions.get(ip) ?? []).filter(
        (t) => now - t < 10 * 60 * 1000,
      );
      if (hits.length >= 3) {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many submissions — try again later.",
        });
      }
      submissions.set(ip, [...hits, now]);

      try {
        await resend.emails.send({
          from: import.meta.env.CONTACT_FROM_EMAIL,
          to: import.meta.env.CONTACT_TO_EMAIL,
          replyTo: email,
          subject: safeHeader(`Portfolio contact: ${name}`),
          html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message)}</p>`,
        });
      } catch {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send — try again shortly.",
        });
      }

      return { success: true };
    },
  }),
};
