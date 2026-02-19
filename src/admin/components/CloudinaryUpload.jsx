import { useEffect, useMemo, useRef, useState } from "react";
import { Button, HelperText } from "./UI";

/**
 * Cloudinary Upload Widget (admin-only).
 * Requires:
 *  - VITE_CLOUDINARY_CLOUD_NAME
 *  - VITE_CLOUDINARY_UPLOAD_PRESET (unsigned preset) OR a preset from `presetEnvKey`
 *
 * Props:
 *  - folder: Cloudinary folder path
 *  - allowedFormats: ["png","jpg",...]
 *  - resourceType: "image" | "raw" (use "raw" for pdf)
 *  - presetEnvKey: e.g. "VITE_CLOUDINARY_RESUME_UPLOAD_PRESET"
 */
export default function CloudinaryUpload({
  onUploaded,
  folder = "portfolio/projects",
  allowedFormats = ["png", "jpg", "jpeg", "webp", "gif"],
  resourceType = "image",
  presetEnvKey,
}) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const widgetRef = useRef(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = presetEnvKey ? import.meta.env[presetEnvKey] : import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const enabled = Boolean(cloudName && uploadPreset);

  const scriptUrl = "https://widget.cloudinary.com/v2.0/global/all.js";

  useEffect(() => {
    if (!enabled) return;

    const existing = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existing) {
      setReady(true);
      return;
    }

    const s = document.createElement("script");
    s.src = scriptUrl;
    s.async = true;
    s.onload = () => setReady(true);
    s.onerror = () => setMsg("Failed to load Cloudinary widget script.");
    document.body.appendChild(s);

    return () => {
      // Do not remove script (shared singleton) — safe to keep.
    };
  }, [enabled, scriptUrl]);

  const widgetOptions = useMemo(() => {
    if (!enabled) return null;
    return {
      cloudName,
      uploadPreset,
      sources: ["local", "url", "camera"],
      multiple: false,
      maxFiles: 1,
      folder,
      clientAllowedFormats: allowedFormats,
      showAdvancedOptions: false,
      cropping: false,
      defaultSource: "local",
      secure: true,
      resourceType,
    };
  }, [enabled, cloudName, uploadPreset, folder, allowedFormats, resourceType]);

  function open() {
    setMsg("");
    if (!enabled) {
      setMsg("Set VITE_CLOUDINARY_CLOUD_NAME and an upload preset env var to enable uploads.");
      return;
    }
    if (!ready || !window.cloudinary) {
      setMsg("Cloudinary widget not ready yet. Try again.");
      return;
    }

    setBusy(true);

    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(widgetOptions, (error, result) => {
        if (error) {
          setMsg(error?.message ?? "Upload failed.");
          setBusy(false);
          return;
        }
        if (result?.event === "success") {
          const url = result?.info?.secure_url || result?.info?.url;
          if (url) {
            onUploaded?.(url);
            setMsg("Uploaded. URL updated.");
          } else {
            setMsg("Upload succeeded but no URL returned.");
          }
          setBusy(false);
        }
        if (result?.event === "close") {
          setBusy(false);
        }
      });
    }

    widgetRef.current.open();
  }

  return (
    <div>
      <Button tone="neutral" onClick={open} disabled={!enabled || busy}>
        {busy ? "Uploading..." : "Upload"}
      </Button>

      {!enabled ? (
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
          Set <span className="font-mono">VITE_CLOUDINARY_CLOUD_NAME</span> and{" "}
          <span className="font-mono">{presetEnvKey ?? "VITE_CLOUDINARY_UPLOAD_PRESET"}</span>.
        </div>
      ) : null}

      {msg ? (
        <HelperText tone={msg.includes("Uploaded") ? "success" : msg.includes("failed") ? "error" : "neutral"}>
          {msg}
        </HelperText>
      ) : null}
    </div>
  );
}
