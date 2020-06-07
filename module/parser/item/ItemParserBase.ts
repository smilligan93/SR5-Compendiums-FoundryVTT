import {Parser} from "../Parser";
import {ImportHelper} from "../../importer/ImportHelper";
import Item = Shadowrun.Item;

export abstract class ItemParserBase<TResult extends Item> extends Parser<TResult> {
    Parse(jsonData: object, data: TResult): TResult {
        data.name = ImportHelper.stringValue(jsonData, "name");

        data.data.description.source = `${ImportHelper.stringValue(jsonData, "source")} ${ImportHelper.stringValue(jsonData, "page")}`;

        data.data.technology.availability = ImportHelper.stringValue(jsonData, "avail", "0");
        data.data.technology.cost = ImportHelper.intValue(jsonData, "cost", 0);
        data.data.technology.rating = ImportHelper.intValue(jsonData, "rating", 0);

        return data;
    }
}