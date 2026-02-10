import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";
import { siteContent } from "../../content";

const Contact = () => {
  const { contact, links, hero } = siteContent;

  const EMAIL = contact.email;
  const RESUME_URL = links.resumeUrl;
  const GITHUB_URL = links.githubUrl;
  const LINKEDIN_URL = links.linkedinUrl;

  return (
    <MotionSection
      id="contact"
      variants={staggerContainer}
      className="py-24 px-6 max-w-4xl mx-auto text-center scroll-mt-24"
    >
      <motion.h2
        variants={fadeUp}
        className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100"
      >
        {contact.title}
      </motion.h2>

      <motion.p
        variants={fadeUp}
        className="mt-6 text-slate-700 dark:text-slate-400 leading-relaxed"
      >
        {contact.description}
      </motion.p>

      <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={`mailto:${EMAIL}?subject=${encodeURIComponent(contact.mailtoSubject)}`}
          className="px-6 py-3 rounded-xl font-medium transition
                     bg-indigo-600/90 text-white hover:bg-indigo-600
                     ring-1 ring-indigo-600/20
                     dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:ring-indigo-400/20"
        >
          {contact.emailButtonLabel}
        </a>

        <a
          href={RESUME_URL}
          download
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 rounded-xl transition
                    border border-black/10 text-slate-800 hover:bg-black/5
                    dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
        >
          {contact.resumeButtonLabel}
        </a>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-10 max-w-2xl mx-auto text-left rounded-2xl
                   border border-black/5 dark:border-white/10
                   bg-white/70 dark:bg-white/5 p-6 backdrop-blur"
      >
        <p className="font-medium text-slate-900 dark:text-slate-100">{contact.quoteBoxTitle}</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-400">
          {contact.quoteBoxItems.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1 text-indigo-500/80 dark:text-indigo-300/80">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-8 flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400"
      >
        <a className="hover:text-slate-900 dark:hover:text-white transition" href={GITHUB_URL} target="_blank" rel="noreferrer">
          {hero.footerLinks.githubLabel}
        </a>
        <span className="text-black/30 dark:text-white/20">•</span>
        <a className="hover:text-slate-900 dark:hover:text-white transition" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
          {hero.footerLinks.linkedinLabel}
        </a>
      </motion.div>
    </MotionSection>
  );
};

export default Contact;