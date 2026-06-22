export function emptyToNull(value: FormDataEntryValue | null): string | null {
  const str = (value ?? "").toString().trim();
  return str === "" ? null : str;
}
