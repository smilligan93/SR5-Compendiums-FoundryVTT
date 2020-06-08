import { DataImporter } from "./DataImporter";
import {ImportHelper} from "./ImportHelper";
import {Constants} from "./Constants";
import Armor = Shadowrun.Armor;
import {ArmorParserBase} from "../parser/armor/ArmorParserBase";

export class ArmorImporter extends DataImporter {
    public armorTranslations;
    public categoryTranslations;

    CanParse(jsonObject: object): boolean {
        return jsonObject.hasOwnProperty("armors") && jsonObject["armors"].hasOwnProperty("armor");
    }

    GetDefaultData(): Armor {
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

    ParseTranslation(jsonObject: object) {
        let jsoni18n: any = {};

        let tranlsations = jsonObject["chummer"];
        for (let i = 0; i < tranlsations.length; i++) {
            const translation = tranlsations[i];
            if (translation.$.file === 'armor.xml') {
                jsoni18n = translation;
                break;
            }
        }

        if (!jsonObject) { 
            return ;
        }

        this.categoryTranslations = {};
        // TODO: Refactor into pretty method
        if (jsoni18n && jsoni18n.hasOwnProperty("categories")) {
            jsoni18n.categories.category.forEach(category => {
                const name = category[ImportHelper.CHAR_KEY];
                const translation = category.$.translate;
                this.categoryTranslations[name] = translation;
            })
        }

        this.armorTranslations = {};
        if (jsoni18n && jsoni18n.hasOwnProperty('armors')) {
            jsoni18n.armors.armor.forEach(armor => {
                const name = armor.name[ImportHelper.CHAR_KEY];
                const translation = armor.translate[ImportHelper.CHAR_KEY];
                this.armorTranslations[name] = translation;
            });
        }
    }

    async Parse(jsonObject: object): Promise<Entity> {
        const folders = await ImportHelper.MakeCategoryFolders(jsonObject, "Armor", this.categoryTranslations);

        const parser = new ArmorParserBase();

        let datas: Armor[] = [];
        let jsonDatas = jsonObject["armors"]["armor"];
        for (let i = 0; i < jsonDatas.length; i++) {
            let jsonData = jsonDatas[i];

            let data = parser.Parse(jsonData, this.GetDefaultData());
            const category = ImportHelper.stringValue(jsonData, "category").toLowerCase();
            if (this.armorTranslations && this.armorTranslations.hasOwnProperty(data.name)) {
                data.name = this.armorTranslations[data.name];
            }
            data.folder = folders[category].id;

            datas.push(data);
        }

        return await Item.create(datas);
    }

    async 
}