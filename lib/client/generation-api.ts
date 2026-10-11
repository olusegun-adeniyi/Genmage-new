import type { EditState } from "@/lib/validation/edit-state";

export type GenerateResponse = {
  slug: string;
  imageUrl: string;
  prompt: string;
  style: string;
  editState: EditState;
};

export type GenerateErrorCode = "invalid_prompt" | "invalid_style" | "cost_cap_reached" | "refused" | "failed";

export class GenerateApiError extends Error {
  code: GenerateErrorCode | "network_error";

  constructor(code: GenerateErrorCode | "network_error") {
    super(code);
    this.code = code;
  }
}

export async function requestGeneration(prompt: string, style: string): Promise<GenerateResponse> {
  let response: Response;

  try {
    response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, style }),
    });
  } catch {
    throw new GenerateApiError("network_error");
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({ error: "failed" }))) as { error?: string };
    throw new GenerateApiError((body.error as GenerateErrorCode | undefined) ?? "failed");
  }

  return response.json();
}

// Best-effort — a failed edit-state persist shouldn't block Share/Export, which the
// caller has already committed to by the time this fires. Errors are swallowed here
// deliberately, not left to reject and crash an unrelated flow.
export async function patchEditState(slug: string, editState: EditState): Promise<void> {
  try {
    await fetch(`/api/generation/${slug}/edit-state`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ editState }),
    });
  } catch {
    // network failure — permalink edit_state stays stale until the next successful patch.
  }
}
