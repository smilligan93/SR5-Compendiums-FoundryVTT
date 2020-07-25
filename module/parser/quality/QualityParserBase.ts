import {ImportHelper} from "../../helper/ImportHelper";
import Quality = Shadowrun.Quality;
import {Parser} from "../Parser";

export class QualityParserBase extends Parser<Quality> {
    public Parse(jsonData: object, data: Quality): Quality {
        data.name = ImportHelper.StringValue(jsonData, "name");

        data.data.description.source = `${ImportHelper.StringValue(jsonData, "source")} ${ImportHelper.StringValue(jsonData, "page")}`;

        data.data.type = (ImportHelper.StringValue(jsonData, "category") === "Positive") ? "positive" : "negative";

        return data;
    }
}