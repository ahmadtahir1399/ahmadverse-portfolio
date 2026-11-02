import { z } from "zod";

/**
 * What a valid enquiry looks like - the single source of truth.
 *
 * Deliberately kept outside the component: if the mailto handoff is ever
 * swapped for an API route, the server can import this exact schema and
 * validate the same payload, so client and server can never disagree.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),

  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .pipe(z.email("That email doesn't look right.")),

  organization: z
    .string()
    .trim()
    .max(120, "That's a little long - keep it under 120 characters.")
    .optional(),

  services: z
    .string()
    .trim()
    .max(200, "That's a little long - keep it under 200 characters.")
    .optional(),

  message: z
    .string()
    .trim()
    .min(10, "Tell me a little more - at least 10 characters."),
});

export type ContactValues = z.infer<typeof contactSchema>;
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

type ContactResult =
  | { ok: true; data: ContactValues }
  | { ok: false; errors: ContactErrors };

/**
 * Parses and flattens zod issues to `{ field: firstMessage }` so each input
 * can render its own message. Only the first issue per field is kept - piling
 * three messages under one input helps nobody.
 */
export const validateContact = (values: unknown): ContactResult => {
  const result = contactSchema.safeParse(values);
  if (result.success) return { ok: true, data: result.data };

  const errors: ContactErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ContactValues | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return { ok: false, errors };
};
