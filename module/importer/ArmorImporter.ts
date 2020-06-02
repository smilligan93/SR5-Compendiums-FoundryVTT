import { DataImporter } from "./DataImporter";
import {ImportHelper} from "./ImportHelper";
import {Constants} from "./Constants";

export class ArmorImporter extends DataImporter {
    CanParse(jsonObject: object): boolean {
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
                    rating: 0,
                    availability: "0",
                    quantity: 1,
                    cost: 0,
                    equipped: true,
                    concealability: 0
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

    ParseData(jsonObject: object) {
        let data = this.GetDefaultData();
        data.name = ImportHelper.stringValue(jsonObject, "name");
        data.data.description.source = `${ImportHelper.stringValue(jsonObject, "source")} ${ImportHelper.stringValue(jsonObject, "page")}`;

        data.data.technology.availability = ImportHelper.stringValue(jsonObject, "avail");
        data.data.technology.cost = ImportHelper.intValue(jsonObject, "cost");

        data.data.armor.value = ImportHelper.intValue(jsonObject, "armor", 0);
        data.data.armor.mod = ImportHelper.stringValue(jsonObject, "armor").includes("+");
        return data;
    }

    async Parse(jsonObject: object): Promise<Entity> {
        let armorCategoryFolders = {};
        let jsonCategories = jsonObject["categories"]["category"];
        for (let i = 0; i < jsonCategories.length; i++) {
            let categoryName = ImportHelper.stringValue(jsonCategories, i);
            armorCategoryFolders[categoryName]
                = await ImportHelper.GetFolderAtPath(`${Constants.ROOT_IMPORT_FOLDER_NAME}/Armor/${categoryName}`, true);
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

        return await Item.create(armorDatas);
    }
}