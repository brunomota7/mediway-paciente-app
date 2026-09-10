// 📁 src/lib/datetime.js
//
// Conversão entre o formato de exibição do app (pt-BR, `DD/MM/YYYY`) e o
// formato aceito/retornado pela API:
//   LocalDate      -> "YYYY-MM-DD"
//   LocalTime      -> "HH:mm"
//   LocalDateTime  -> ISO-8601 ("YYYY-MM-DDTHH:mm:ss")

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const ISO_DATE = 'YYYY-MM-DD';
export const ISO_TIME = 'HH:mm';
export const BR_DATE = 'DD/MM/YYYY';
export const BR_DATETIME = 'DD/MM/YYYY HH:mm';

/** `Date | string` -> `"YYYY-MM-DD"` (para campos `LocalDate`). `null` se inválido. */
export function toIsoDate(value) {
  if (!value) return null;
  const d = dayjs(value);
  return d.isValid() ? d.format(ISO_DATE) : null;
}

/** `Date | "HH:mm" | "HH:mm:ss"` -> `"HH:mm"` (para campos `LocalTime`). */
export function toIsoTime(value) {
  if (!value && value !== 0) return null;
  if (value instanceof Date) {
    const d = dayjs(value);
    return d.isValid() ? d.format(ISO_TIME) : null;
  }
  const match = String(value).trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hh = String(Math.min(23, Math.max(0, parseInt(match[1], 10)))).padStart(2, '0');
  return `${hh}:${match[2]}`;
}

/** `"YYYY-MM-DD"` ou ISO -> `Date`. `null` se inválido. */
export function fromIsoDate(value) {
  if (!value) return null;
  const d = dayjs(value);
  return d.isValid() ? d.toDate() : null;
}

/** Qualquer data -> `"DD/MM/YYYY"` para exibição. `""` se inválida. */
export function toBrDate(value) {
  if (!value) return '';
  const d = dayjs(value);
  return d.isValid() ? d.format(BR_DATE) : '';
}

/** Qualquer datetime -> `"DD/MM/YYYY HH:mm"` para exibição. */
export function toBrDateTime(value) {
  if (!value) return '';
  const d = dayjs(value);
  return d.isValid() ? d.format(BR_DATETIME) : '';
}

/** `"DD/MM/YYYY"` -> `"YYYY-MM-DD"` (parse estrito). `null` se inválido. */
export function brDateToIso(value) {
  if (!value) return null;
  const d = dayjs(String(value).trim(), BR_DATE, true);
  return d.isValid() ? d.format(ISO_DATE) : null;
}

/** `true` se a data é estritamente anterior a hoje (regra "deve ser passada"). */
export function isPastDate(value) {
  if (!value) return false;
  const d = dayjs(value);
  return d.isValid() && d.startOf('day').isBefore(dayjs().startOf('day'));
}

/** `true` se a data é hoje ou futura (regra "hoje ou futura"). */
export function isTodayOrFuture(value) {
  if (!value) return false;
  const d = dayjs(value);
  return d.isValid() && !d.startOf('day').isBefore(dayjs().startOf('day'));
}

export default {
  ISO_DATE,
  ISO_TIME,
  BR_DATE,
  BR_DATETIME,
  toIsoDate,
  toIsoTime,
  fromIsoDate,
  toBrDate,
  toBrDateTime,
  brDateToIso,
  isPastDate,
  isTodayOrFuture,
};
