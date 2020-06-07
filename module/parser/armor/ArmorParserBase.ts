import {ItemParserBase} from "../item/ItemParserBase";
import Armor = Shadowrun.Armor;
import {ImportHelper} from "../../helper/ImportHelper";

export class ArmorParserBase extends ItemParserBase<Armor> {
    Parse(jsonData: object, data: Shadowrun.Armor): Shadowrun.Armor {
        data = super.Parse(jsonData, data);

        data.data.armor.value = ImportHelper.intValue(jsonData, "armor", 0);
        data.data.armor.mod = ImportHelper.stringValue(jsonData, "armor").includes("+");

        return data;
    }
}