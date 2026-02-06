import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";

const Services = () => {
  const EMAIL = "ayehtetheinmessi@gmail.com";

  const subject = "Freelance Project Inquiry";

  // Write it with NO indentation, then normalize line breaks for email clients.
  const body = [
    "Hi Asaad,",
    "",
    "I'm interested in working with you.",
    "",
    "Project type (landing page / business site / React UI / fixes):",
    "Scope (pages / features):",
    "Deadline:",
    "Budget range (optional):",
    "Reference links (optional):",
    "",
    "Thanks!",
  ].join("\r\n");

  const mailtoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  const services = [
    {
      title: "Landing Pages & Marketing Sites",
      points: [
        "Modern, responsive layout (mobile-first)",
        "Smooth scroll + tasteful animations (Framer Motion)",
        "Fast loading + clean structure for handoff",
      ],
    },
    {
      title: "Portfolio / Business Website",
      points: [
        "Polished UI with strong visual hierarchy",
        "Sections, forms, and CTA optimization",
        "Deployment-ready (Vercel/Netlify)",
      ],
    },
    {
      title: "React UI Builds (From Figma)",
      points: [
        "Component-based architecture",
        "Reusable UI patterns + Tailwind system",
        "Responsive + cross-browser checks",
      ],
    },
    {
      title: "Fixes, UI Polish & Animations",
      points: [
        "Bug fixing, layout issues, responsiveness fixes",
        "Performance + code cleanup (readability)",
        "Add micro-interactions that improve UX",
      ],
    },
  ];

  const process = [
    { title: "1) Quick Brief", desc: "You share goals, references, and a deadline." },
    { title: "2) Quote & Plan", desc: "I propose scope, timeline, and deliverables." },
    { title: "3) Build & Updates", desc: "You get progress updates + a staging link." },
    { title: "4) Handoff", desc: "Final delivery + small tweaks if needed." },
  ];

  return (
    <MotionSection
      id="services"
      variants={staggerContainer}
      className="py-24 px-6 max-w-6xl mx-auto"
    >
      <div className="text-center">
        <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold">
          Freelance Services
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-5 text-gray-400 leading-relaxed max-w-3xl mx-auto"
        >
          Need a clean, modern website or a React UI built fast and properly?
          I help individuals and small businesses ship polished interfaces with
          responsive layouts, smooth animations, and readable code.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center gap-3">
          <a
            href={mailtoHref}
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-500 rounded-xl font-medium hover:bg-indigo-400 transition"
          >
            Request a Quote
          </a>

          <p className="text-sm text-gray-400">
            Based in <span className="text-gray-200">Bahrain</span> — available for{" "}
            <span className="text-gray-200">remote freelance worldwide</span>.
          </p>

          <p className="text-sm text-gray-400">
            Typical projects start from{" "}
            <span className="text-gray-200">$100–$300</span> depending on scope.
          </p>
        </motion.div>
      </div>

      <motion.div
        variants={fadeUp}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <h3 className="text-lg font-semibold">{s.title}</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              {s.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-1 text-indigo-400">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="mt-16">
        <h3 className="text-xl font-semibold text-center">How the process works</h3>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {process.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="font-medium">{step.title}</p>
              <p className="mt-2 text-sm text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-gray-400">
          <span className="text-gray-200">Tip:</span> If you have a Figma link, include it in your email — it speeds everything up.
        </div>
      </motion.div>
    </MotionSection>
  );
};

export default Services;