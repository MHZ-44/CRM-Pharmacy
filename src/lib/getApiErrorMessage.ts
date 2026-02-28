type ApiErrorPayload = {
  error?: string;
  message?: string;
  errors?: Record<string, string | string[]> | string[];
};

const toText = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong.",
): string => {
  const responseData = (error as { response?: { data?: ApiErrorPayload } })
    ?.response?.data;

  const directError =
    toText(responseData?.error) ??
    toText(responseData?.message) ??
    toText((error as { message?: string })?.message);

  if (directError) return directError;

  if (Array.isArray(responseData?.errors)) {
    const fromArray = responseData.errors.map(toText).filter(Boolean).join(", ");
    if (fromArray) return fromArray;
  }

  if (
    responseData?.errors &&
    typeof responseData.errors === "object" &&
    !Array.isArray(responseData.errors)
  ) {
    const firstValue = Object.values(responseData.errors)[0];
    if (Array.isArray(firstValue)) {
      const first = firstValue.map(toText).filter(Boolean).join(", ");
      if (first) return first;
    }
    const first = toText(firstValue);
    if (first) return first;
  }

  return fallback;
};
