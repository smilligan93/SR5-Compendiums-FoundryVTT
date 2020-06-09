import Cyberware = Shadowrun.Cyberware;
import {Parser} from "../Parser";
import {ItemParserBase} from "../item/ItemParserBase";
import {ImportHelper} from "../../helper/ImportHelper";

export class CyberwareParser extends ItemParserBase<Cyberware> {
    Parse(jsonData: object, data: Cyberware): Cyberware {
        data = super.Parse(jsonData, data);

        const essence = ImportHelper.StringValue(jsonData, "ess", "0").match(/[0-9]\.?[0-9]*/g);
        if (essence !== null) {
            data.data.essence = parseFloat(essence[0]);
        }

        const capacity = ImportHelper.StringValue(jsonData, "capacity", "0").match(/[0-9]+/g);
        if (capacity !== null) {
            data.data.capacity = parseInt(capacity[0]);
        }

        return data;
    }
}