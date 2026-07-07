const email = "om.sharma@iitg.ac.in";

// Muted ink on the dark drape — no palette token, footer-only.
const dim = "text-[#8B8B89]";

const Dot = () => (
  <span aria-hidden="true" className={dim}>
    ·
  </span>
);

export function SiteFooter() {
  return (
    <footer id="contact" className="scroll-mt-24 bg-drape text-paper">
      <div className="mx-auto max-w-[1120px] px-6 py-24 md:py-28">
        <p className={`navlabel ${dim}`}>04 — Contact</p>
        <p className="hero-intro mt-12 max-w-[22ch] text-[clamp(1.75rem,4vw,var(--text-title))] leading-tight">
          Building things, one problem at a time. If any of it resonates — say
          hi.
        </p>
        <p className="mt-10">
          <a href={`mailto:${email}`} className="ulink font-display text-subhead">
            {email}
          </a>
        </p>
        <div className="mt-20 flex flex-wrap items-baseline justify-between gap-4 border-t border-paper/20 pt-7">
          <div
            className={`flex flex-wrap items-baseline gap-x-2.5 gap-y-1 font-mono text-xs ${dim}`}
          >
            <a
              className="ulink"
              href="https://github.com/omsharmaiitg"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <Dot />
            <a
              className="ulink"
              href="https://www.linkedin.com/in/om-sharma2008/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <Dot />
            {/* Links to /public/resume.pdf — works once Om drops the file in. */}
            <a
              className="ulink"
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
          </div>
          <span className={`font-mono text-[0.6875rem] italic ${dim}`}>
            built with Next.js
          </span>
        </div>
      </div>
    </footer>
  );
}
