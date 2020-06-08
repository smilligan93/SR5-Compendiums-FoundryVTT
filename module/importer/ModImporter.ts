import {DataImporter} from "./DataImporter";
import Mod = Shadowrun.Mod;
import {ImportHelper} from "./ImportHelper";
import {Constants} from "./Constants";
import MountType = Shadowrun.MountType;

export class ModImporter extends DataImporter {
    public categoryTranslations: any;
    public accessoryTranslations: any;

    CanParse(jsonObject: object): boolean {
        return jsonObject.hasOwnProperty("accessories") && jsonObject["accessories"].hasOwnProperty("accessory");
    }

    GetDefaultData(): Mod {
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
        }
    }

    ExtractTranslation() {
        if (!DataImporter.jsoni18n) {
            return;
        }

        let jsonWeaponsi18n = ImportHelper.ExtractDataFileTranslation(DataImporter.jsoni18n, 'weapons.xml');
        // Parts of weapon accessory translations are within the application translation. Currently only data translation is used.
        this.accessoryTranslations = ImportHelper.ExtractItemTranslation(jsonWeaponsi18n, 'accessories', 'accessory');
    }

    async Parse(jsonObject: object): Promise<Entity> {
        let modDatas: Mod[] = [];
        let jsonAccs = jsonObject["accessories"]["accessory"];
        for (let i = 0; i < jsonAccs.length; i++) {
            let jsonData = jsonAccs[i];

            let data = this.GetDefaultData();

            data.name = ImportHelper.stringValue(jsonData, "name");
            data.name = ImportHelper.MapNameToTranslation(this.accessoryTranslations, data.name);

            data.data.description.source = `${ImportHelper.stringValue(jsonData, "source")} ${ImportHelper.stringValue(jsonData, "page")}`;

            data.data.technology.availability = ImportHelper.stringValue(jsonData, "avail", "0");
            data.data.technology.cost = ImportHelper.intValue(jsonData, "cost", 0);
            data.data.technology.rating = ImportHelper.intValue(jsonData, "rating", 0);

            data.data.type = "weapon";

            data.data.mount_point = ImportHelper.stringValue(jsonData, "mount") as MountType;

            data.data.rc = ImportHelper.intValue(jsonData, "rc", 0);
            data.data.accuracy = ImportHelper.intValue(jsonData, "accuracy", 0);

            data.data.technology.conceal.base = ImportHelper.intValue(jsonData, "conceal", 0);

            let folderName = (data.data.mount_point !== undefined) ? data.data.mount_point : "Other";
            if (folderName.includes("/")) {
                let splitName = folderName.split("/");
                folderName = splitName[0];
            }

            let folder = await ImportHelper.GetFolderAtPath(`${Constants.ROOT_IMPORT_FOLDER_NAME}/Mods/${folderName}`, true);
            data.folder = folder.id;

            modDatas.push(data);
        }

        return await Item.create(modDatas);
    }
}