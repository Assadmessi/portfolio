function normalizeCloudinaryUrl(url) {
  if (!url) return url;
  const s = String(url).trim();

  // Only touch Cloudinary delivery URLs
  if (!s.includes("res.cloudinary.com") || !s.includes("/image/upload/")) return s;

  // ✅ Upgrade old PAD URLs automatically (fixes "middle" on mobile)
  if (s.includes("/image/upload/c_pad")) {
    return s.replace(
      /\/image\/upload\/c_pad[^/]*\//,
      "/image/upload/c_fill,g_auto,w_1200,q_auto,f_auto/"
    );
  }

  // If already transformed (c_*, w_*, etc.), keep as-is
  const afterUpload = s.split("/image/upload/")[1] ?? "";
  const firstSegment = afterUpload.split("/")[0] ?? "";
  const alreadyTransformed =
    firstSegment.includes(",") ||
    firstSegment.startsWith("c_") ||
    firstSegment.startsWith("ar_") ||
    firstSegment.startsWith("w_") ||
    firstSegment.startsWith("h_");

  if (alreadyTransformed) return s;

  // ✅ Responsive-friendly default (fills frame, no padding)
  const tx = "c_fill,g_auto,w_1200,q_auto,f_auto";

  return s.replace("/image/upload/", `/image/upload/${tx}/`);
}