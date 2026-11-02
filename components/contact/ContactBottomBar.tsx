"use client";

import { useLocalTime } from "@/hooks/useLocalTime";
import { SOCIALS } from "@/lib/site";

const LABEL_CLASS =
  "text-[10px] md:text-xs font-[450] uppercase tracking-[0.2em] text-off-white-shade/40";

/**
 * Plain, static bottom bar for /contact - deliberately NOT the animated
 * reveal footer, which would just repeat the call to action this page already
 * is. Same information, no scroll choreography.
 */
const ContactBottomBar = () => {
  const time = useLocalTime();

  return (
    <div className="container-app pt-24 pb-8 text-off-white-shade md:pt-32 md:pb-10">
      <div className="flex flex-col gap-8 px-4 md:flex-row md:items-end md:justify-between md:gap-0 md:px-0">
        <div className="flex items-end gap-12 md:gap-14">
          <div>
            <p className={LABEL_CLASS}>Version</p>
            <p className="mt-2 text-sm md:text-base">
              {new Date().getFullYear()} &copy; Edition
            </p>
          </div>
          <div>
            <p className={LABEL_CLASS}>Local time</p>
            <p className="mt-2 text-sm md:text-base">{time || " "}</p>
          </div>
        </div>

        {SOCIALS.length > 0 && (
          <div>
            <p className={LABEL_CLASS}>Socials</p>
            <div className="mt-2 flex flex-wrap gap-5 md:gap-7">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative text-sm after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-off-white-shade after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100 md:text-base"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactBottomBar;
