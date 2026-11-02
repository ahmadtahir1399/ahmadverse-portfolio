import { PERSON } from "@/lib/site";

/**
 * Factual, question-and-answer style content about Ahmad Tahir.
 *
 * Server component on purpose: the copy is plain HTML in the initial
 * response, so search crawlers and AI answer engines (Google AI
 * Overviews / AI Mode) can extract and cite it directly. The visible
 * text is mirrored 1:1 by the FAQPage JSON-LD on the home page - the
 * two must stay in sync (Google requires markup to match on-page text).
 */
export const FAQ_ITEMS = [
  {
    question: "Who is Ahmad Tahir?",
    answer:
      "Ahmad Tahir is a full stack web developer based in Pakistan, working with clients worldwide. He designs and builds modern web applications end to end - from marketing sites and e-commerce stores to real-time AI products and marketplaces - using Next.js, React, TypeScript, and Node.js.",
  },
  {
    question: "What does a full stack web developer do?",
    answer:
      "A full stack web developer builds both the front end of a website (everything users see and interact with) and the back end (servers, APIs, and databases that power it). This means one person can take a product from idea to a fully working, deployed web application.",
  },
  {
    question: "What services does Ahmad Tahir offer?",
    answer:
      "Full stack web development with Next.js and React, front-end builds with advanced animation and interaction design, back-end and API development with Node.js, NestJS, and FastAPI, e-commerce and marketplace development with Stripe payments, and AI-powered product development using LLM APIs.",
  },
  {
    question: "What technologies does Ahmad Tahir use?",
    answer:
      "His core stack is Next.js, React, TypeScript, and Tailwind CSS on the front end, with Node.js, NestJS, FastAPI, PostgreSQL, MongoDB, and Supabase on the back end. He also works with WebSockets for real-time features and OpenAI and Groq APIs for AI products.",
  },
  {
    question: "How can I hire Ahmad Tahir?",
    answer:
      "Ahmad Tahir is currently available for freelance work worldwide. The fastest way to reach him is by email at ahmadtahir1399@gmail.com - include a short description of your project and he will get back to you.",
  },
] as const;

const AboutFaq = () => {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="container-app mt-24 md:mt-32 lg:mt-40 max-w-full md:max-w-[85%] lg:max-w-[69%] text-black-shade"
    >
      <div className="px-4 md:px-0">
        <span className="text-xs font-[450] uppercase tracking-[0.2em] text-grey-shade/60">
          ABOUT / FAQ
        </span>
        <h2
          id="about-heading"
          className="mt-4 text-3xl md:text-4xl lg:text-5xl font-[450] tracking-tight text-grey-shade"
        >
          About <span className="text-blue">Ahmad Tahir</span>
        </h2>

        <dl className="mt-10 md:mt-14">
          {FAQ_ITEMS.map((item) => (
            <div
              key={item.question}
              className="border-t border-grey-shade/15 py-7 md:py-9 md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] md:gap-12"
            >
              <dt className="text-lg md:text-xl font-[450] tracking-tight">
                {item.question}
              </dt>
              <dd className="mt-3 md:mt-0 text-sm md:text-base leading-relaxed text-grey-shade">
                {item.question === "How can I hire Ahmad Tahir?" ? (
                  <>
                    Ahmad Tahir is currently available for freelance work
                    worldwide. The fastest way to reach him is by email at{" "}
                    <a
                      href={`mailto:${PERSON.email}`}
                      className="text-blue underline underline-offset-4"
                    >
                      {PERSON.email}
                    </a>{" "}
                    - include a short description of your project and he will
                    get back to you.
                  </>
                ) : (
                  item.answer
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default AboutFaq;
