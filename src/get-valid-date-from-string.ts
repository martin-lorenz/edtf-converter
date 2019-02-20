import * as moment from 'moment';

/** @internal */
interface IDateInfo {
  date: moment.Moment;
  format: string;
}

/**
 * Get a Moment.js date from a string that is valid for at least one of the
 * given formats.
 *
 * @internal
 * @param dateString The string to be parsed.
 * @param formats The formats to be validated against.
 * @returns The result containing the date date and detected format.
 */
export default function getValidDateFromString(dateString: string, formats: string[]): IDateInfo {
  let date: moment.Moment | null = null;
  let format: string | null = null;
  for (format of formats) {
    const momentDate = moment(dateString, format, true);
    if (momentDate.isValid()) {
      date = momentDate;
      break;
    }
  }
  if (!date) {
    throw new Error(
      `Date input "${dateString}" matches none of the available formats.`,
    );
  }
  return {
    date,
    format: format as string,
  };
}