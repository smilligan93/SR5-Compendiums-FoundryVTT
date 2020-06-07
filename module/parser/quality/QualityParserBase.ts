import {ImportHelper} from "../../importer/ImportHelper";
import Quality = Shadowrun.Quality;
import {Parser} from "../Parser";

export class QualityParserBase extends Parser<Quality> {
    public Parse(jsonData: object, data: Quality): Quality {
        data.name = ImportHelper.stringValue(jsonData, "name");

        data.data.description.source = `${ImportHelper.stringValue(jsonData, "source")} ${ImportHelper.stringValue(jsonData, "page")}`;

        data.data.type = (ImportHelper.stringValue(jsonData, "category") === "Positive") ? "positive" : "negative";

        return data;
    }
}