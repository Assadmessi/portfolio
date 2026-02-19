import { siteContent } from "../../content";

const Footer = () => {
  const { links } = siteContent;

  return (
    <footer className="mt-24 border-t border-slate-200/70 dark:border-white/10">
      <div className="nb-container py-12 text-center relative">
        {/* Subtle visual strip (keeps text unchanged, adds premium feel) */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-10 w-full max-w-5xl">
          <div className="mx-auto grid grid-cols-3 gap-3 opacity-70">
            {["/uploads/project1.png", "/uploads/project2.png", "/uploads/project3.png"].map((src, i) => (
              <div
                key={i}
                className="h-16 sm:h-20 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5"
              >
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/5 to-sky-500/10 blur-2xl" />
        </div>

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