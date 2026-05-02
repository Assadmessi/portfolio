import { motion } from "framer-motion";
import { siteContent } from "../../content";

const Contact = () => {
  const { contact, links, hero } = siteContent;
  const EMAIL = contact.email;
  const RESUME_URL = links.resumeUrl;
  const GITHUB_URL = links.githubUrl;
  const LINKEDIN_URL = links.linkedinUrl;

  return (
    <section id="contact" className="relative py-32 sm:py-44 overflow-hidden scroll-mt-24">
      {/* Sticky label */}
      <div className="absolute top-10 left-6 sm:left-10 z-10 pointer-events-none">
        <p className="font-mono text-[10px] tracking-[0.3em] text-cyan-500 dark:text-cyan-400/70 uppercase">/ 06 — Contact</p>
      </div>

      {/* Big background marquee word */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none opacity-[0.025] z-0">
        <div className="whitespace-nowrap font-extrabold leading-none tracking-[-0.06em]"
          style={{ fontSize: "clamp(8rem, 22vw, 22rem)" }}>
          {contact.title.toUpperCase()} · {contact.title.toUpperCase()}
        </div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10">
        {/* MASSIVE TITLE */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-extrabold leading-[0.85] tracking-[-0.045em] mb-12 sm:mb-16"
          style={{ fontSize: "clamp(3rem, 11vw, 12rem)" }}
        >
          {contact.title}
        </motion.h2>

        {/* Description + email actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20 sm:mb-28">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-base sm:text-xl text-slate-700 dark:text-white/65 leading-relaxed max-w-2xl mb-10 font-mono"
            >
              {contact.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent(contact.mailtoSubject)}`}
                className="px-7 py-3.5 rounded-md text-sm font-semibold transition-all bg-gradient-to-br from-indigo-500/30 to-cyan-400/15 border border-indigo-400/40 hover:translate-y-[-2px] hover:border-indigo-400/70 hover:shadow-[0_8px_24px_rgba(99,102,241,0.25)] font-mono tracking-wider"
              >
                {contact.emailButtonLabel}
              </a>
              <a
                href={RESUME_URL}
                download
                className="px-7 py-3.5 rounded-md text-sm font-semibold border border-black/15 dark:border-white/15 text-slate-700 dark:text-white/70 hover:border-black/30 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white transition-all font-mono tracking-wider"
              >
                {contact.resumeButtonLabel}
              </a>
            </motion.div>
          </div>

          {/* Right: email card with crosshair corners */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent p-7 overflow-hidden"
            >
              {/* Crosshair corners */}
              <div className="absolute top-3 left-3 w-3 h-3 border-l border-t border-cyan-400/40" />
              <div className="absolute top-3 right-3 w-3 h-3 border-r border-t border-cyan-400/40" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-l border-b border-cyan-400/40" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-r border-b border-cyan-400/40" />

              <p className="font-mono text-[10px] tracking-[0.25em] text-cyan-500 dark:text-cyan-400/70 uppercase mb-4">
                {contact.quoteBoxTitle}
              </p>
              <ul className="space-y-3">
                {contact.quoteBoxItems.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm text-slate-700 dark:text-white/70 leading-relaxed"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    <span className="text-cyan-500 dark:text-cyan-400 mt-1 shrink-0 text-[10px]">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* GIANT EMAIL DISPLAY (ORYZO closing accent) */}
        <motion.a
          href={`mailto:${EMAIL}?subject=${encodeURIComponent(contact.mailtoSubject)}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="group block"
        >
          <p className="font-mono text-[10px] tracking-[0.25em] text-cyan-500 dark:text-cyan-400/70 uppercase mb-3">
            / Email
          </p>
          <p
            className="font-extrabold leading-[0.95] tracking-[-0.03em] break-all transition-colors group-hover:text-cyan-500 dark:group-hover:text-cyan-300"
            style={{ fontSize: "clamp(1.5rem, 5vw, 5rem)" }}
          >
            {EMAIL}
          </p>
        </motion.a>

        {/* Social row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 flex items-center gap-6 text-sm font-mono"
        >
          <a className="hover:text-cyan-500 dark:hover:text-cyan-300 transition" href={GITHUB_URL} target="_blank" rel="noreferrer">
            {hero.footerLinks.githubLabel} ↗
          </a>
          <span className="text-slate-300 dark:text-white/15">/</span>
          <a className="hover:text-cyan-500 dark:hover:text-cyan-300 transition" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            {hero.footerLinks.linkedinLabel} ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
