export { findNucleusType, nucleusTypes, type NucleusTypeId } from '../../../../../src/features/nuclei/nucleus-types';
export { profileLetters } from '../../../../../src/shared/profile-letters';
export { formatCalendarEventDate } from '../../../../../src/features/calendar/event-input';

export function isNucleusId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function pageNumber(values: string[]) {
  return values.length === 1 && /^[1-9]\d{0,3}$/.test(values[0]) ? Number(values[0]) : 1;
}
