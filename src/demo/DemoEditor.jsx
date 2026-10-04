import { useEffect, useRef, useState } from "react";
import { Head } from "@unhead/react";
import { Button, Input, Textarea } from "../admin/components/UI";
import {
  OWNER_EMAIL,
  getDemoContent,
  resetDemoContent,
  saveDemoProjects,
  saveDemoSite,
} from "./demoContent";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const clone = (v) => JSON.parse(JSON.stringify(v));

const getIn = (obj, path) => path.split(".").reduce((a, k) => (a == null ? a : a[k]), obj);

const setIn = (obj, path, value) => {
  const keys = path.split(".");
  let cur = obj;
  for (const k of keys.slice(0, -1)) {
    if (typeof cur[k] !== "object" || cur[k] === null) cur[k] = {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
};

// Text <-> array conversion for the list-style fields.
const LIST_MODES = {
  lines: {
    parse: (t) => t.split("\n").map((s) => s.trim()).filter(Boolean),
    join: (a) => a.join("\n"),
  },
  paragraphs: {
    parse: (t) => t.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
    join: (a) => a.join("\n\n"),
  },
  csv: {
    parse: (t) => t.split(",").map((s) => s.trim()).filter(Boolean),
    join: (a) => a.join(", "),
  },
};

// Downscale uploads so they fit comfortably in localStorage.
const fileToDataUrl = (file, maxW, quality = 0.82) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750' viewBox='0 0 1200 750'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#6366f1'/>" +
      "<stop offset='1' stop-color='#22d3ee'/></linearGradient></defs>" +
      "<rect width='1200' height='750' fill='url(#g)'/>" +
      "<text x='600' y='390' text-anchor='middle' font-family='system-ui,sans-serif' font-size='56' fill='white' opacity='.92'>Your project image</text></svg>"
  );

const MAX_PROJECTS = 12;
const MAX_SERVICES = 6;

const TABS = [
  { id: "hero", label: "Hero", target: "home" },
  { id: "about", label: "About", target: "about" },
  { id: "services", label: "Services", target: "services" },
  { id: "projects", label: "Projects", target: "projects" },
  { id: "how", label: "How I work", target: "skills" },
  { id: "contact", label: "Contact", target: "contact" },
];

/* -------------------------------------------------------------------------- */
/* Small building blocks                                                      */
/* -------------------------------------------------------------------------- */

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">{label}</span>
    {children}
    {hint ? <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">{hint}</span> : null}
  </label>
);

// Textarea/input that edits an array (lines, paragraphs or comma list).
// Keeps its own raw text so typing a new line / comma never gets "eaten".
const ListField = ({ label, hint, value, onChange, mode = "lines", rows = 4, placeholder }) => {
  const { parse, join } = LIST_MODES[mode];
  const arr = Array.isArray(value) ? value : [];
  const canonical = join(arr);
  const [text, setText] = useState(canonical);

  // Re-sync if the underlying data changed from somewhere else (delete, reset…)
  useEffect(() => {
    if (join(parse(text)) !== canonical) setText(canonical);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonical]);

  const handle = (e) => {
    setText(e.target.value);
    onChange(parse(e.target.value));
  };

  return (
    <Field label={label} hint={hint}>
      {mode === "csv" ? (
        <Input value={text} onChange={handle} placeholder={placeholder} />
      ) : (
        <Textarea rows={rows} value={text} onChange={handle} placeholder={placeholder} />
      )}
    </Field>
  );
};

const ImagePicker = ({ label, value, onChange, maxW = 900, round = false }) => {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await fileToDataUrl(file, maxW));
    } catch {
      setError("Couldn't read that image. Try a JPG or PNG.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <div
          className={`h-14 w-14 shrink-0 overflow-hidden border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-white/10 ${
            round ? "rounded-full" : "rounded-xl"
          }`}
        >
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : null}
        </div>
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? "Loading…" : "Upload image"}
        </Button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={pick} />
      </div>
      {error ? <span className="block text-[11px] text-rose-600 dark:text-rose-400 mt-1">{error}</span> : null}
    </Field>
  );
};

/* -------------------------------------------------------------------------- */
/* Main editor                                                                */
/* -------------------------------------------------------------------------- */

export default function DemoEditor() {
  const [initial] = useState(getDemoContent);
  const [site, setSite] = useState(initial.site);
  const [projects, setProjects] = useState(initial.projects);
  const siteRef = useRef(site);
  const projectsRef = useRef(projects);

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("hero");
  const [confirmReset, setConfirmReset] = useState(false);
  const bodyRef = useRef(null);

  // Apply a change to the site content: clone → mutate → push to the live UI.
  const editSite = (mutate) => {
    const next = clone(siteRef.current);
    mutate(next);
    siteRef.current = next;
    setSite(next);
    saveDemoSite(next);
  };

  const editProjects = (mutate) => {
    const next = clone(projectsRef.current);
    if (!Array.isArray(next.projects)) next.projects = [];
    mutate(next);
    projectsRef.current = next;
    setProjects(next);
    saveDemoProjects(next);
  };

  // Esc minimizes the panel.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const goTo = (t) => {
    setTab(t.id);
    setConfirmReset(false);
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const behavior = reduce ? "auto" : "smooth";
    if (t.target === "home") {
      window.scrollTo({ top: 0, behavior });
    } else {
      document.getElementById(t.target)?.scrollIntoView({ behavior, block: "start" });
    }
  };

  const doReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    const fresh = resetDemoContent();
    siteRef.current = fresh.site;
    projectsRef.current = fresh.projects;
    setSite(fresh.site);
    setProjects(fresh.projects);
    setConfirmReset(false);
  };

  /* ---- bound field helpers (plain functions → stable element types) ---- */

  const text = (label, path, opts = {}) => (
    <Field key={path} label={label} hint={opts.hint}>
      <Input
        value={getIn(site, path) ?? ""}
        onChange={(e) => editSite((d) => setIn(d, path, e.target.value))}
        placeholder={opts.placeholder}
      />
    </Field>
  );

  const area = (label, path, rows = 3, opts = {}) => (
    <Field key={path} label={label} hint={opts.hint}>
      <Textarea
        rows={rows}
        value={getIn(site, path) ?? ""}
        onChange={(e) => editSite((d) => setIn(d, path, e.target.value))}
      />
    </Field>
  );

  const list = (label, path, mode, opts = {}) => (
    <ListField
      key={path}
      label={label}
      hint={opts.hint}
      mode={mode}
      rows={opts.rows}
      placeholder={opts.placeholder}
      value={getIn(site, path)}
      onChange={(arr) => editSite((d) => setIn(d, path, arr))}
    />
  );

  /* ---- tab bodies ---- */

  const renderHero = () => (
    <div className="space-y-4">
      {text("Small label above your name", "hero.badge")}
      {text("Name", "hero.name")}
      {text("Headline", "hero.headlineAccent")}
      {area("Intro", "hero.intro", 3)}
      {area("Availability message", "hero.availability", 3)}
      {text("Main button", "hero.buttons.primary.label")}
      {text("Second button", "hero.buttons.secondary.label")}
      <ImagePicker
        label="Profile photo"
        round
        maxW={480}
        value={site.hero?.photoUrl}
        onChange={(url) => editSite((d) => setIn(d, "hero.photoUrl", url))}
      />
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-4">
      {text("Section title", "about.title")}
      {list("Paragraphs", "about.paragraphs", "paragraphs", { rows: 9, hint: "Leave a blank line between paragraphs." })}
      {list("Skill tags", "about.tags", "csv", { hint: "Separate with commas." })}
    </div>
  );

  const renderServices = () => {
    const cards = site.services?.cards ?? [];
    return (
      <div className="space-y-4">
        {text("Section title", "services.sectionTitle")}
        {area("Description", "services.sectionDescription", 3)}
        {text("Starting price", "services.pricing.range", {
          hint: "Shown as “Typical projects start from …”",
        })}

        <div className="pt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Service cards
        </div>

        {cards.map((card, i) => (
          <div
            key={i}
            className="rounded-2xl border border-black/10 dark:border-white/10 p-3 space-y-3 bg-white/50 dark:bg-white/5"
          >
            {text("Service name", `services.cards.${i}.title`)}
            {list("Bullet points", `services.cards.${i}.points`, "lines", { rows: 4, hint: "One per line." })}
            <Button
              type="button"
              variant="ghost"
              onClick={() => editSite((d) => d.services.cards.splice(i, 1))}
              aria-label={`Remove service ${card.title || i + 1}`}
            >
              Remove this service
            </Button>
          </div>
        ))}

        {cards.length < MAX_SERVICES ? (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              editSite((d) => {
                if (!Array.isArray(d.services.cards)) d.services.cards = [];
                d.services.cards.push({
                  title: "New service",
                  points: ["Describe what's included", "Add another benefit"],
                });
              })
            }
          >
            + Add a service
          </Button>
        ) : null}
      </div>
    );
  };

  const renderProjects = () => {
    const items = projects.projects ?? [];
    return (
      <div className="space-y-4">
        <Field label="Section title">
          <Input
            value={projects.sectionTitle ?? ""}
            onChange={(e) => editProjects((d) => (d.sectionTitle = e.target.value))}
          />
        </Field>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          The homepage shows your 3 newest projects. Add one and watch it appear.
        </p>

        {items.map((p, i) => (
          <details
            key={p.id ?? p.slug ?? i}
            open={i === 0}
            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5"
          >
            <summary className="cursor-pointer select-none px-3 py-2.5 text-sm font-semibold truncate">
              {p.title || "Untitled project"}
            </summary>
            <div className="p-3 pt-1 space-y-3">
              <Field label="Title">
                <Input
                  value={p.title ?? ""}
                  onChange={(e) => editProjects((d) => (d.projects[i].title = e.target.value))}
                />
              </Field>
              <Field label="Short description">
                <Textarea
                  rows={3}
                  value={p.desc ?? p.description ?? ""}
                  onChange={(e) =>
                    editProjects((d) => {
                      d.projects[i].desc = e.target.value;
                      delete d.projects[i].description;
                    })
                  }
                />
              </Field>
              <ListField
                label="Tags"
                mode="csv"
                hint="Separate with commas."
                value={p.tags}
                onChange={(arr) => editProjects((d) => (d.projects[i].tags = arr))}
              />
              <Field label="Live link (optional)">
                <Input
                  value={p.links?.live ?? ""}
                  placeholder="https://"
                  onChange={(e) =>
                    editProjects((d) => {
                      d.projects[i].links = { ...(d.projects[i].links || {}), live: e.target.value };
                    })
                  }
                />
              </Field>
              <ImagePicker
                label="Project image"
                value={p.image}
                onChange={(url) => editProjects((d) => (d.projects[i].image = url))}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => editProjects((d) => d.projects.splice(i, 1))}
                aria-label={`Remove project ${p.title || i + 1}`}
              >
                Remove this project
              </Button>
            </div>
          </details>
        ))}

        {items.length < MAX_PROJECTS ? (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              editProjects((d) => {
                d.projects.push({
                  id: `demo-${Date.now()}`,
                  title: "My new project",
                  desc: "Describe your project here — it shows up on the site instantly.",
                  publishedAt: new Date().toISOString().slice(0, 10),
                  image: PLACEHOLDER_IMAGE,
                  tags: ["React", "Tailwind"],
                  links: { live: "", repo: "", pdf: "" },
                });
              })
            }
          >
            + Add a project
          </Button>
        ) : null}
      </div>
    );
  };

  const renderHow = () => (
    <div className="space-y-4">
      {text("Section title", "howIWork.title")}
      {area("Intro", "howIWork.intro", 3)}
      {list("Principles", "howIWork.points", "lines", { rows: 8, hint: "One per line." })}
    </div>
  );

  const renderContact = () => (
    <div className="space-y-4">
      {text("Heading", "contact.title")}
      {area("Message", "contact.description", 5)}
      {text("Email button label", "contact.emailButtonLabel")}
      {text("Email address", "contact.email", { hint: "Try your own — the button will use it." })}
    </div>
  );

  const bodies = {
    hero: renderHero,
    about: renderAbout,
    services: renderServices,
    projects: renderProjects,
    how: renderHow,
    contact: renderContact,
  };

  const ctaHref = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(
    "I tried your live editing demo"
  )}&body=${encodeURIComponent("Hi Asaad,\n\nI tried the editing demo and I'd like a website I can edit like this.\n\nAbout my business:\n")}`;

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed z-[70] bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-indigo-600 text-white pl-4 pr-5 py-3 text-sm font-semibold shadow-xl shadow-indigo-600/30 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
          aria-label="Open the live editor"
        >
          <span aria-hidden="true">✏️</span> Try editing this site
        </button>
      ) : (
        <section
          aria-label="Live site editor (demo)"
          className="fixed z-[70] inset-x-0 bottom-0 max-h-[52vh] flex flex-col rounded-t-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0F1424] shadow-2xl text-slate-900 dark:text-slate-100 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:top-20 sm:max-h-none sm:w-[380px] sm:rounded-3xl"
        >
          {/* Header */}
          <div className="shrink-0 flex items-start justify-between gap-3 px-4 pt-4 pb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold">Live editor</h2>
                <span className="rounded-full bg-indigo-600/10 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                  Demo
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-slate-600 dark:text-slate-400">
                Type below and the site updates instantly. No code, no login — and nothing leaves your browser.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-full h-8 w-8 grid place-items-center bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              aria-label="Minimize the editor"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          {/* Tabs */}
          <div role="tablist" aria-label="Site sections" className="shrink-0 flex gap-2 overflow-x-auto px-4 py-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => goTo(t)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  tab === t.id
                    ? "bg-indigo-600 text-white"
                    : "bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 py-3">
            {bodies[tab]()}
          </div>

          {/* Footer */}
          <div className="shrink-0 flex items-center justify-between gap-2 border-t border-black/10 dark:border-white/10 px-4 py-3">
            <Button type="button" variant="ghost" onClick={doReset}>
              {confirmReset ? "Tap again to reset" : "Reset demo"}
            </Button>
            <a
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Get one like this →
            </a>
          </div>
        </section>
      )}
    </>
  );
}
