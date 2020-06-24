/**
 * @module EdtfConverter
 */
import * as moment from 'moment';
interface IEdtfPartResult {
    cleanEdtf: string;
    detectedModifiers: ICustomModifier[];
    format: 'YYYY' | 'YYYY-MM' | 'YYYY-MM-DD';
    hasOpenEnd: boolean;
    hasOpenStart: boolean;
    isApproximate: boolean;
    isCentury: boolean;
    isDecade: boolean;
    isUncertain: boolean;
    maxDate: moment.Moment;
    minDate: moment.Moment;
}
interface IParseEdtfResult {
    primaryPart: IEdtfPartResult;
    secondaryPart: IEdtfPartResult;
    separator: string | null;
}
export interface ICustomModifier {
    keyword: string;
    modifierRegex: RegExp;
    addModifierFn: (edtf: string) => string;
    removeModifierFn: (edtf: string) => string;
}
/** Allow customizing the converters' behaviour. */
export interface IOptions {
    /** Used when converting an EDTF with the approxmiate modifier `~` to a date.
     *
     * Example: With `approximateVariance.days = 5`, the resulting min and max dates for
     * "~1930-05-03" are "1930-04-28" and "1930-05-08" respectively.
     */
    approximateVariance?: {
        /** @default 3 */
        days?: number;
        /** @default 3 */
        months?: number;
        /** @default 3 */
        years?: number;
    };
    /**
     * Allows adding custom keywords with corresponding modifier functions. If a keyword is detected,
     * it's modifier is called with the original EDTF string expecting it to return a modified EDTF
     * string.
     */
    customModifiers?: ICustomModifier[];
    customSeparators?: ICustomModifier[];
    /** Used when converting an EDTF to natural language. */
    edtfToTextOptions?: {
        dateFormat?: string;
        /**
         *  If provided, converter merges intervals like
         * `1 June 2000 - 5 June 2000` to `1-5 June 2000`.
         */
        mergedIntervalDateFormats?: {
            /** @example ['MMMM D', 'MMMM D, YYYY'] => July 1 – September 1, 2000 */
            sameYear?: string[];
            /** @example ['MMMM D', 'D, YYYY'] => July 1 – 10, 2000 */
            sameYearAndMonth?: string[];
            /** @example ['MMMM', 'MMMM YYYY'] => July – September 2000 */
            sameYearOnlyMonth?: string[];
        };
        separator?: string;
    };
    /**
     * The locales specify which words trigger a certain EDTF feature and how to parse date formats.
     * The order of the locales determines their priority while parsing.
     * @default ['en']
     */
    locales?: Array<'en' | 'fr'>;
}
/** An object containing the minimum and maximum date for an EDTF value */
export interface IDate {
    min: moment.Moment | null;
    max: moment.Moment | null;
}
/** Class representing a converter. */
export declare class Converter {
    private localeData;
    private _options;
    /** Get the current options or update them for all subsequent operations. */
    options: IOptions;
    /** Initialize the options for the converter. */
    constructor(options?: IOptions);
    /**
     * Converts natural language to an EDTF compliant date string.
     */
    textToEdtf(input: string): string;
    /**
     * Converts an EDTF compliant date string to natural language.
     */
    edtfToText(edtf: string): string;
    /**
     * Converts an EDTF date string to `min` and `max` Moment.js dates (UTC)
     */
    edtfToDate(edtf: string): IDate;
    /**
     * Parses an EDTF to a result object containing information about it's modifiers and dates
     */
    parseEdtf(edtf: string): IParseEdtfResult;
    /** Checks whether a given EDTF is valid
     *  @throws {Error} Error thrown if invalid
     */
    validateEdtf(edtf: string): void;
    private validateEdtfPart;
}
export {};
