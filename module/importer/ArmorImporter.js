var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DataImporter } from "./DataImporter";
import { ImportHelper } from "./ImportHelper";
import { Constants } from "./Constants";
export class ArmorImporter extends DataImporter {
    CanParse(jsonObject) {
        return jsonObject.hasOwnProperty("armors") && jsonObject["armors"].hasOwnProperty("armor");
    }
    GetDefaultData() {
        return {
            name: "Unnamed Armor",
            folder: null,
            type: "armor",
            data: {
                description: {
                    value: "",
                    chat: "",
                    source: ""
                },
                technology: {
                    rating: 1,
                    availability: "",
                    quantity: 1,
                    cost: 0,
                    equipped: true,
                    conceal: {
                        base: 0,
                        value: 0,
                        mod: {}
                    }
                },
                condition_monitor: {
                    value: 0,
                    max: 0
                },
                armor: {
                    value: 0,
                    mod: false,
                    acid: 0,
                    cold: 0,
                    fire: 0,
                    electricity: 0,
                    radiation: 0
                }
            },
            permission: {
                default: 2
            }
        };
    }
    ParseData(jsonObject) {
        let data = this.GetDefaultData();
        data.name = ImportHelper.stringValue(jsonObject, "name");
        data.data.description.source = `${ImportHelper.stringValue(jsonObject, "source")} ${ImportHelper.stringValue(jsonObject, "page")}`;
        data.data.technology.availability = ImportHelper.stringValue(jsonObject, "avail");
        data.data.technology.cost = ImportHelper.intValue(jsonObject, "cost");
        data.data.armor.value = ImportHelper.intValue(jsonObject, "armor", 0);
        data.data.armor.mod = ImportHelper.stringValue(jsonObject, "armor").includes("+");
        return data;
    }
    Parse(jsonObject) {
        return __awaiter(this, void 0, void 0, function* () {
            let armorCategoryFolders = {};
            let jsonCategories = jsonObject["categories"]["category"];
            for (let i = 0; i < jsonCategories.length; i++) {
                let categoryName = ImportHelper.stringValue(jsonCategories, i);
                armorCategoryFolders[categoryName]
                    = yield ImportHelper.GetFolderAtPath(`${Constants.ROOT_IMPORT_FOLDER_NAME}/Armor/${categoryName}`, true);
            }
            let armorDatas = [];
            let jsonArmors = jsonObject["armors"]["armor"];
            for (let i = 0; i < jsonArmors.length; i++) {
                let jsonData = jsonArmors[i];
                let data = this.ParseData(jsonData);
                let category = ImportHelper.stringValue(jsonData, "category");
                let folder = armorCategoryFolders[category];
                if (game.items.find((item) => item.folder === folder.id && item.name === data.name)) {
                    continue;
                }
                data.folder = folder.id;
                armorDatas.push(data);
            }
            return yield Item.create(armorDatas);
        });
    }
}
