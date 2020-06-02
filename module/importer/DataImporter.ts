import {ImportHelper} from "./ImportHelper";

const xml2js = require("xml2js");

export abstract class DataImporter {

    /**
     * Get default data for constructing a TItem.
     */
    public abstract GetDefaultData(): any;

    /**
     * Validate if this importer is capable of parsing the provided JSON data.
     * @param jsonObject JSON data to check import capability for.
     * @returns boolean True if the importer is capable of parsing the provided XML data.
     */
    public abstract CanParse(jsonObject: object): boolean;

    /**
     * Parse the specified jsonObject and return Item representations.
     * @param jsonObject The JSON data to parse.
     * @returns An array of created objects.
     */
    public abstract async Parse(jsonObject: object): Promise<Entity>;

    /**
     * Parse an XML string into a JSON object.
     * @param xmlString The string to parse as XML.
     * @returns A json object converted from the string.
     */
    public static async xml2json(xmlString: string): Promise<object> {
        const parser = xml2js.Parser({
            explicitArray: false,
            explicitCharkey: true,
            charkey: ImportHelper.CHAR_KEY
        });
        return (await parser.parseStringPromise(xmlString))["chummer"];
    }
}