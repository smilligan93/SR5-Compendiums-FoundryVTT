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
export class ModImporter extends DataImporter {
    CanParse(jsonObject) {
        return jsonObject.hasOwnProperty("accessories") && jsonObject["accessories"].hasOwnProperty("accessory");
    }
    GetDefaultData() {
        return {
            name: "",
            folder: null,
            type: "modification",
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
                type: "",
                mount_point: "",
                dice_pool: 0,
                accuracy: 0,
                rc: 0
            },
            permission: {
                default: 2
            }
        };
    }
    Parse(jsonObject) {
        return __awaiter(this, void 0, void 0, function* () {
            let modDatas = [];
            let jsonAccs = jsonObject["accessories"]["accessory"];
            for (let i = 0; i < jsonAccs.length; i++) {
                let jsonData = jsonAccs[i];
                let data = this.GetDefaultData();

                data.name = ImportHelper.stringValue(jsonData, "name");
                data.data.description.source = `${ImportHelper.stringValue(jsonData, "source")} ${ImportHelper.stringValue(jsonData, "page")}`;
                data.data.technology.availability = ImportHelper.stringValue(jsonData, "avail", "0");
                data.data.technology.cost = ImportHelper.intValue(jsonData, "cost", 0);
                data.data.technology.rating = ImportHelper.intValue(jsonData, "rating", 0);
                data.data.type = "weapon";
                data.data.mount_point = ImportHelper.stringValue(jsonData, "mount");
                data.data.rc = ImportHelper.intValue(jsonData, "rc", 0);
                data.data.accuracy = ImportHelper.intValue(jsonData, "accuracy", 0);
                data.data.conceal = ImportHelper.intValue(jsonData, "conceal", 0);

                let folderName = (data.data.mount_point !== undefined) ? data.data.mount_point : "Other";
                if (folderName.includes("/")) {
                    let splitName = folderName.split("/");
                    folderName = splitName[0];
                }
                let folder = yield ImportHelper.GetFolderAtPath(`${Constants.ROOT_IMPORT_FOLDER_NAME}/Mods/${folderName}`, true);
                data.folder = folder.id;
                modDatas.push(data);
            }
            return yield Item.create(modDatas);
        });
    }
}
