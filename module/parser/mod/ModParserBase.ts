import {ItemParserBase} from "../item/ItemParserBase";
import Mod = Shadowrun.Mod;
import {ImportHelper} from "../../importer/ImportHelper";
import MountType = Shadowrun.MountType;

export class ModParserBase extends ItemParserBase<Mod> {
    Parse(jsonData: object, data: Mod): Mod {
        data = super.Parse(jsonData, data);

        data.data.type = "weapon";

        data.data.mount_point = ImportHelper.stringValue(jsonData, "mount") as MountType;

        data.data.rc = ImportHelper.intValue(jsonData, "rc", 0);
        data.data.accuracy = ImportHelper.intValue(jsonData, "accuracy", 0);

        data.data.technology.conceal.base = ImportHelper.intValue(jsonData, "conceal", 0);

        return data;
    }
}