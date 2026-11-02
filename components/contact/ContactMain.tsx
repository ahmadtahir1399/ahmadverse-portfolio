"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MagneticBall from "@/components/common/MagneticBall";
import { SPACING } from "@/constants/spacing";
import { useBallSize } from "@/hooks/useBallSize";
import { CONTACT, PERSON, SOCIALS } from "@/lib/site";
import { validateContact, type ContactErrors } from "@/lib/contactSchema";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Must match HONEYPOT in app/api/contact/route.ts */
const HONEYPOT = "company_website";

interface Field {
  no: string;
  name: "name" | "email" | "organization" | "services" | "message";
  question: string;
  placeholder: string;
  type?: "text" | "email" | "textarea";
  required?: boolean;
}

const FIELDS: Field[] = [
  {
    no: "01",
    name: "name",
    question: "What's your name?",
    placeholder: "John Doe *",
    required: true,
  },
  {
    no: "02",
    name: "email",
    question: "What's your email?",
    placeholder: "john@doe.com *",
    type: "email",
    required: true,
  },
  {
    no: "03",
    name: "organization",
    question: "What's the name of your organization?",
    placeholder: "John & Doe ®",
  },
  {
    no: "04",
    name: "services",
    question: "What services are you looking for?",
    placeholder: "AI app, marketplace, full-stack build ...",
  },
  {
    no: "05",
    name: "message",
    question: "Your message",
    placeholder: "Hello Ahmad, can you help me with ... *",
    type: "textarea",
    required: true,
  },
];

const LABEL_CLASS =
  "text-[11px] font-[450] uppercase tracking-[0.2em] text-off-white-shade/40";

const QUESTION_CLASS =
  "block text-[1.15rem] font-[450] tracking-tight sm:text-[1.35rem] md:text-[1.75rem]";

/** No borders, no focus ring - the row hairline is the only rule on screen. */
const FIELD_CLASS =
  "mt-5 block w-full border-0 bg-transparent p-0 text-[1.15rem] leading-[1.6] outline-none placeholder:text-off-white-shade/30 focus:outline-none focus:ring-0 disabled:opacity-50 sm:text-[1.35rem] md:mt-6 md:text-[1.75rem]";

const EMPTY = {
  name: "",
  email: "",
  organization: "",
  services: "",
  message: "",
};

/** Business facts shown under the contact details. Empty values are skipped. */
const BUSINESS_DETAILS = [
  PERSON.name,
  PERSON.jobTitle,
  `Location: ${CONTACT.location}`,
  CONTACT.availability,
].filter(Boolean);

type Status = "idle" | "sending" | "sent" | "error";

const ContactMain = () => {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [trap, setTrap] = useState("");

  // 150 / 190 / 230 - the ball has to shrink or it swamps a phone screen
  const ballSize = useBallSize(150, 190, useCallback(() => 230, []));

  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  /** Grows the textarea to fit its content so it never shows a scrollbar. */
  const autoGrow = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    messageRef.current = el;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  // The inline height above outlives a viewport change, so recompute on resize
  // (and orientation change) or the field keeps a stale desktop height on a phone.
  useEffect(() => {
    const onResize = () => autoGrow(messageRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [autoGrow]);

  const set = (name: keyof typeof EMPTY, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (status === "error" || status === "sent") setStatus("idle");
    // Clear this field's error as soon as the visitor starts correcting it
    if (errors[name]) {
      setErrors(({ [name]: _cleared, ...rest }) => rest);
    }
  };

  /**
   * Validates with the shared zod schema, then POSTs to /api/contact, which
   * re-validates with that same schema before handing the mail to Resend.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    const result = validateContact(values);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setFormError("");
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, [HONEYPOT]: trap }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Server-side validation disagreed - surface it per field
        if (res.status === 422 && data.errors) {
          setErrors(data.errors as ContactErrors);
          setStatus("idle");
          return;
        }
        setFormError(data.error ?? "That didn't send. Please try again.");
        setStatus("error");
        return;
      }

      setValues(EMPTY);
      setStatus("sent");
    } catch {
      setFormError(
        `Couldn't reach the server. Check your connection, or email me at ${CONTACT.email}.`
      );
      setStatus("error");
    }
  };

  const ballText =
    status === "sending" ? "Sending" : status === "sent" ? "Sent!" : "Send it!";

  return (
    <section className="pt-12 text-off-white-shade sm:pt-16 md:pt-24 lg:pt-[150px]">
      <div className={SPACING.container}>
        {/* flex on small screens so the form can sit above the details;
            the 12-col grid takes over from lg where both fit side by side */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-6">
          {/* ---------- Headline ---------- */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="order-1 text-[13vw] font-[450] leading-[0.96] tracking-tight sm:text-[10vw] md:text-[8vw] lg:order-none lg:col-span-8 lg:row-start-1 lg:text-[6.4vw]"
          >
            Let&apos;s start a <br className="hidden sm:block" />
            project together
          </motion.h1>

          {/* ---------- Right rail: portrait + details ---------- */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="order-3 mt-20 lg:order-none lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:row-start-1 lg:mt-[115px] lg:pl-8"
          >
            <div className="relative h-[96px] w-[96px] overflow-hidden rounded-full bg-grey-shade md:h-[124px] md:w-[124px]">
              <Image
                src={PERSON.photo}
                alt={`Portrait of ${PERSON.name}, ${PERSON.jobTitle}`}
                fill
                priority
                className="object-cover object-center"
                sizes="124px"
              />
            </div>

            {/* Down-right arrow, pointing at the details below */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-10 h-5 w-5 md:mt-16"
              aria-hidden="true"
            >
              <path d="M7 7l10 10" />
              <path d="M17 9v8H9" />
            </svg>

            <div className="mt-10 md:mt-16">
              <p className={LABEL_CLASS}>Contact details</p>
              <a
                href={`mailto:${CONTACT.email}`}
                className="mt-5 block break-words text-[16px] underline-offset-4 hover:underline lg:text-[19px]"
              >
                {CONTACT.email}
              </a>
              {CONTACT.phone && (
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="mt-2 block text-[16px] underline-offset-4 hover:underline lg:text-[19px]"
                >
                  {CONTACT.phone}
                </a>
              )}
            </div>

            <div className="mt-10 md:mt-12">
              <p className={LABEL_CLASS}>Business details</p>
              {BUSINESS_DETAILS.map((line) => (
                <p
                  key={line}
                  className="mt-2 text-[16px] first:mt-5 lg:text-[19px]"
                >
                  {line}
                </p>
              ))}
            </div>

            {SOCIALS.length > 0 && (
              <div className="mt-10 md:mt-12">
                <p className={LABEL_CLASS}>Socials</p>
                <div className="mt-5 flex flex-wrap items-start gap-x-6 gap-y-2 lg:flex-col">
                  {SOCIALS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative text-[16px] after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-off-white-shade after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100 lg:text-[19px]"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.aside>

          {/* ---------- Form ---------- */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="order-2 mt-16 md:mt-24 lg:order-none lg:col-span-8 lg:row-start-2 lg:mt-24"
          >
            {/* Honeypot: off-screen, untabbable, hidden from screen readers */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={HONEYPOT}>Company website</label>
              <input
                id={HONEYPOT}
                name={HONEYPOT}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
              />
            </div>

            {FIELDS.map((field, i) => (
              <motion.div
                key={field.no}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                className="border-t border-off-white-shade/15 pt-10 pb-8 md:pt-14 md:pb-12"
              >
                <div className="grid grid-cols-12 gap-x-3 md:gap-x-4">
                  <span className="col-span-2 text-[13px] text-off-white-shade/40 sm:col-span-1 md:text-[15px]">
                    {field.no}
                  </span>

                  <div className="col-span-10 sm:col-span-11">
                    <label htmlFor={field.name} className={QUESTION_CLASS}>
                      {field.question}
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        rows={2}
                        ref={autoGrow}
                        value={values[field.name]}
                        onChange={(e) => {
                          set(field.name, e.target.value);
                          autoGrow(e.currentTarget);
                        }}
                        placeholder={field.placeholder}
                        disabled={status === "sending"}
                        aria-required={field.required}
                        aria-invalid={Boolean(errors[field.name])}
                        className={`${FIELD_CLASS} min-h-[9rem] resize-none overflow-hidden sm:min-h-[12rem] md:min-h-[24rem]`}
                      />
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type ?? "text"}
                        value={values[field.name]}
                        onChange={(e) => set(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        disabled={status === "sending"}
                        aria-required={field.required}
                        aria-invalid={Boolean(errors[field.name])}
                        className={FIELD_CLASS}
                      />
                    )}

                    {errors[field.name] && (
                      <p className="mt-3 text-[14px] text-red-400 md:text-[15px]">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Divider with the Send ball sitting on it */}
            <div className="relative border-t border-off-white-shade/15">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 lg:left-[82%]">
                {/* MagneticBall renders a bare <button>, which inside a form
                    defaults to type="submit" - so this IS the submit button.
                    Passing onClick as well would fire handleSubmit twice. */}
                <MagneticBall
                  text={ballText}
                  size={ballSize}
                  bgColor="var(--color-blue)"
                  // Deepens on hover rather than going light, so the off-white
                  // label can never vanish into the ball. Same pair the footer
                  // and project pages use.
                  hoverBgColor="var(--color-dark-blue)"
                  textColor="var(--color-off-white-shade)"
                  fontSize="1rem"
                />
              </div>
              {/* Reserves the height the overlapping ball needs */}
              <div className="h-[110px] md:h-[140px] lg:h-[180px]" aria-hidden="true" />
            </div>

            {/* Status line, announced to screen readers as it changes */}
            <div aria-live="polite" className="min-h-[1.5rem] text-center lg:text-left">
              {status === "sent" && (
                <p className="text-[15px] text-off-white-shade/70">
                  Thanks - that's landed in my inbox. I'll get back to you
                  shortly.
                </p>
              )}
              {status === "error" && formError && (
                <p className="text-[15px] text-red-400">{formError}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactMain;
