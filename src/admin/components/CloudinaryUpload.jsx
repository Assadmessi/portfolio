import { useEffect, useMemo, useRef, useState } from "react";
import { Button, HelperText } from "./UI";

/**
 * Cloudinary Upload Widget (admin-only).
 * Requires:
 *  - VITE_CLOUDINARY_CLOUD_NAME
 *  - VITE_CLOUDINARY_UPLOAD_PRESET (unsigned preset)
 *
 * If env vars are missing, this component will show guidance and disable the upload button.
 */
export default function CloudinaryUpload({ onUploaded, folder = "portfolio/projects", allowedFormats = ["png", "jpg", "jpeg", "webp", "gif"], resourceType }) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const widgetRef = useRef(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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
  }, [enabled]);

  const widgetOptions = useMemo(() => {
    if (!enabled) return null;
    return {
      cloudName,
      uploadPreset,
      ...(resourceType ? { resourceType } : {}),
      sources: ["local", "url", "camera"],
      multiple: false,
      maxFiles: 1,
      folder,
      clientAllowedFormats: allowedFormats,
      showAdvancedOptions: false,
      cropping: false,
      defaultSource: "local",
      secure: true,
    };
  }, [enabled, cloudName, uploadPreset, folder, allowedFormats, resourceType]);

  function open() {
    setMsg("");
    if (!enabled) {
      setMsg("Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your environment to enable uploads.");
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
            setMsg("Uploaded. Thumbnail URL updated.");
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
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={open} disabled={!enabled || !ready || busy}>
          {busy ? "Uploading..." : "Upload to Cloudinary"}
        </Button>
        {!enabled ? (
          <div className="text-xs text-slate-600 dark:text-slate-300">
            Set <span className="font-mono">VITE_CLOUDINARY_CLOUD_NAME</span> and <span className="font-mono">VITE_CLOUDINARY_UPLOAD_PRESET</span>.
          </div>
        ) : null}
      </div>

      {msg ? <HelperText tone={msg.includes("Uploaded") ? "success" : msg.includes("Failed") ? "error" : "neutral"}>{msg}</HelperText> : null}
    </div>
  );
}
