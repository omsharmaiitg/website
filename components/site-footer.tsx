const email = "om.sharma@iitg.ac.in";

const Dot = () => <span aria-hidden="true">·</span>;

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="meta mx-auto flex max-w-[720px] flex-wrap items-baseline gap-x-2 gap-y-1 px-6 py-8">
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
        {/* Resume link returns once Om sends resume.pdf — until the file
            exists in /public it would be a dead href. */}
        <Dot />
        <span className="italic">built with Next.js</span>
      </div>
    </footer>
  );
}
