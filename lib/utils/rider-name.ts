/**
 * Strip diacritics so timing-board abbreviations stay ASCII safe.
 * "Viñales" -> "Vinales", "Rins" -> "Rins".
 */
function toAscii(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Official timing-board surname abbreviation: keep the first three clean
 * letters, e.g. "Marquez" -> "MAR", "Di Giannantonio" -> "DIG".
 */
export function abbreviateSurname(surname: string): string {
  return toAscii(surname)
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 3);
}

/**
 * Compact timing-board name: first initial + 3-letter surname.
 * ("Marc Marquez" -> "M MAR", "Fabio Di Giannantonio" -> "F DIG").
 *
 * Pass `name` and `surname` separately when already available; otherwise the
 * helper splits the full name on whitespace.
 */
export function abbreviateRiderName(name: string, surname?: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';

  let firstName = trimmed;
  let lastName = surname?.trim() ?? '';

  if (!lastName) {
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) return abbreviateSurname(parts[0]);
    firstName = parts[0];
    lastName = parts.slice(1).join(' ');
  }

  const initial = toAscii(firstName).charAt(0).toUpperCase();
  const abbreviated = abbreviateSurname(lastName);

  return `${initial} ${abbreviated}`.trim();
}
