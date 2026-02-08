import { useMemo, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase/firebase";
import { Button, HelperText } from "./UI";

export default function StorageUpload({ folder = "portfolio/uploads", onUploaded }) {
  const storage = useMemo(() => getStorage(app), []);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handlePick(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setMsg("");
    setBusy(true);
    try {
      const safeName = `${Date.now()}-${file.name}`.replace(/[^\w.\-]/g, "_");
      const storageRef = ref(storage, `${folder}/${safeName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setMsg("Uploaded.");
      onUploaded?.(url);
    } catch (err) {
      setMsg(err?.message ?? "Upload failed.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handlePick}
          disabled={busy}
          className="block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-black/10 dark:file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-900 dark:file:text-slate-100 hover:file:bg-black/15 dark:hover:file:bg-white/15"
        />
        <Button type="button" variant="ghost" disabled={busy} onClick={() => setMsg("Tip: pick an image file to upload.")}>
          Help
        </Button>
      </div>
      {msg ? <HelperText tone={msg === "Uploaded." ? "success" : "error"}>{msg}</HelperText> : null}
      <HelperText>
        Optional: uploads to Firebase Storage and returns a public download URL. This does not change any public-site code.
      </HelperText>
    </div>
  );
}
