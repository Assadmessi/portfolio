import { Head } from "@unhead/react";

export default function Seo({
  title = "Asaad | Front-End Developer",
  description = "Asaad – Front-End Developer building modern, high-performance web applications.",
  url = "",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
