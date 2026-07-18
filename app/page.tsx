"use client"; // needs useState + fetch for the generation round-trip

import { useState } from "react";

type GenerateResponse = {
  slug: string;
  imageUrl: string;
  prompt: string;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const body = await response.json();

    if (!response.ok) {
      setError(body.error ?? "unknown_error");
      setLoading(false);
      return;
    }

    setResult(body);
    setLoading(false);
  }

  return (
    <main>
      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        rows={3}
        cols={60}
      />
      <br />
      <button onClick={handleGenerate} disabled={loading || prompt.trim().length < 3}>
        {loading ? "Generating..." : "Generate"}
      </button>
      {error && <p>Error: {error}</p>}
      {result && (
        // eslint-disable-next-line @next/next/no-img-element -- Day 1 scaffold, plain img until design pass
        <img src={result.imageUrl} alt={result.prompt} width={400} />
      )}
    </main>
  );
}
