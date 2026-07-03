import { actions, isInputError } from "astro:actions";
import { useState, useTransition, useEffect, useRef } from "react";

type ActionResult = Awaited<ReturnType<typeof actions.contactForm>>;

export default function ContactForm() {
  const jsFlagRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (jsFlagRef.current) jsFlagRef.current.value = "1"; // only runs if JS actually executed
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await actions.contactForm(formData);
      setState(result);
    });
  }

  const fieldErrors =
    state?.error && isInputError(state.error) ? state.error.fields : undefined;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-[480px]"
      aria-label="Contact form"
    >
      <input type="hidden" name="_js" ref={jsFlagRef} defaultValue="0" />
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px" }}
        aria-hidden="true"
      />

      {/* name/email/message inputs — same Tailwind classes, class→className */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="contact-name"
          className="text-xs font-medium text-text-muted uppercase tracking-[0.08em] font-mono"
        >
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={fieldErrors?.name ? true : undefined}
          aria-describedby={
            fieldErrors?.name ? "contact-name-error" : undefined
          }
          className="bg-bg border border-bg-border rounded-md px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors duration-150"
        />
        {fieldErrors?.name && (
          <p id="contact-name-error" className="text-xs text-red-500">
            {fieldErrors.name[0]}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="contact-email"
          className="text-xs font-medium text-text-muted uppercase tracking-[0.08em] font-mono"
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          aria-invalid={fieldErrors?.email ? true : undefined}
          aria-describedby={
            fieldErrors?.email ? "contact-email-error" : undefined
          }
          className="bg-bg border border-bg-border rounded-md px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors duration-150"
        />
        {fieldErrors?.email && (
          <p id="contact-email-error" className="text-xs text-red-500">
            {fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="contact-message"
          className="text-xs font-medium text-text-muted uppercase tracking-[0.08em] font-mono"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          placeholder="What are you working on?"
          aria-invalid={fieldErrors?.message ? true : undefined}
          aria-describedby={
            fieldErrors?.message ? "contact-message-error" : undefined
          }
          className="bg-bg border border-bg-border rounded-md px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors duration-150 resize-y"
        />
        {fieldErrors?.message && (
          <p id="contact-message-error" className="text-xs text-red-500">
            {fieldErrors.message[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="self-start bg-accent text-bg border-none rounded-md px-6 py-3 text-sm font-semibold cursor-pointer hover:bg-accent-dim active:scale-[0.98] transition-[background-color,transform] duration-150"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
      {state?.data?.success && (
        <p role="status">Thanks — I'll get back to you within 48 hours.</p>
      )}
      {state?.error && !isInputError(state.error) && (
        <p role="alert" className="text-xs text-red-500">
          {state.error.message ?? "Something went wrong — try again shortly."}
        </p>
      )}
    </form>
  );
}
