export function resolveAppearanceLogoMimeType(
  file: File
): "image/jpeg" | "image/png" | "image/webp" | null {
  if (
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/webp"
  ) {
    return file.type;
  }

  return null;
}
