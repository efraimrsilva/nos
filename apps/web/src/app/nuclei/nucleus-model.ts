export { findNucleusType, nucleusTypes, type NucleusTypeId } from '../../domain/nuclei/nucleus-types';
export { profileLetters } from '../../domain/profile-letters';
export { formatCalendarEventDate } from '../../domain/calendar/event-input';

export function isNucleusId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function pageNumber(values: string[]) {
  return values.length === 1 && /^[1-9]\d{0,3}$/.test(values[0]) ? Number(values[0]) : 1;
}
