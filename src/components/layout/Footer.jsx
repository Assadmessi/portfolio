import { siteContent } from "../../content";

const Footer = () => {
  const { links } = siteContent;

  return (
    <footer className="mt-24 border-t border-slate-200/70 dark:border-white/10">
      <div className="nb-container py-12 text-center">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Let’s build something impactful.
        </h3>

        <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Open to freelance work and junior frontend opportunities. Based in Bahrain.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
          <a
            href="#contact"
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Contact
          </a>

          {links?.githubUrl ? (
            <a
              href={links.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-700 dark:text-slate-300 hover:underline"
            >
              GitHub
            </a>
          ) : null}

          {links?.linkedinUrl ? (
            <a
              href={links.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-700 dark:text-slate-300 hover:underline"
            >
              LinkedIn
            </a>
          ) : null}

          {links?.resumeUrl ? (
            <a
              href={links.resumeUrl}
              className="font-semibold text-slate-700 dark:text-slate-300 hover:underline"
            >
              Resume
            </a>
          ) : null}
        </div>

        <div className="mt-10 text-xs text-slate-500 dark:text-slate-500">
          © {new Date().getFullYear()} Asaad — Frontend Developer (React • Tailwind • Motion).
        </div>
      </div>
    </footer>
  );
};

export default Footer;