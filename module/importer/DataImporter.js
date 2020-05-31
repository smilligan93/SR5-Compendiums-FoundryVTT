var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ImportHelper } from "./ImportHelper";
const xml2js = require("xml2js");
export class DataImporter {
    /**
     * Parse an XML string into a JSON object.
     * @param xmlString The string to parse as XML.
     * @returns A json object converted from the string.
     */
    static xml2json(xmlString) {
        return __awaiter(this, void 0, void 0, function* () {
            const parser = xml2js.Parser({
                explicitArray: false,
                explicitCharkey: true,
                charkey: ImportHelper.CHAR_KEY
            });
            return (yield parser.parseStringPromise(xmlString))["chummer"];
        });
    }
}
