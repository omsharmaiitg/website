const email = "om.sharma@iitg.ac.in";

const Dot = () => <span aria-hidden="true">·</span>;

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="scroll-mt-24 border-t border-hairline py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <p className="navlabel text-ink-muted">contact</p>
        <p className="mt-5 max-w-[520px] text-subhead italic text-ink-muted">
          Building things, one problem at a time. If any of it resonates —
          say hi.
        </p>
      </div>
      <div className="meta mx-auto mt-10 flex max-w-[1080px] flex-wrap items-baseline gap-x-2 gap-y-1 px-6">
        <a className="ulink" href={`mailto:${email}`}>
          {email}
        </a>
        <Dot />
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
        <Dot />
        <span className="italic">built with Next.js</span>
      </div>
    </footer>
  );
}
