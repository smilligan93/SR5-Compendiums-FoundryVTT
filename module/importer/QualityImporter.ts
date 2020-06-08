import {DataImporter} from "./DataImporter";
import {ImportHelper} from "./ImportHelper";
import {QualityParserBase} from "../parser/quality/QualityParserBase";
import Quality = Shadowrun.Quality;

export class QualityImporter extends DataImporter {
    public categoryTranslations: any;
    public qualityTranslations: any;

    CanParse(jsonObject: object): boolean {
        return jsonObject.hasOwnProperty("qualities") && jsonObject["qualities"].hasOwnProperty("quality");
    }

    GetDefaultData(): Quality {
        return {
            name: "Unnamed Armor",
            folder: null,
            type: "quality",
            data: {
                description: {
                    value: "",
                    chat: "",
                    source: ""
                },
                action: {
                    type: "varies",
                    category: "",
                    attribute: "",
                    attribute2: "",
                    skill: "",
                    spec: false,
                    mod: 0,
                    mod_description: "",
                    damage: {
                        type: {
                            base: "",
                            value: ""
                        },
                        element: {
                            base: "",
                            value: ""
                        },
                        base: 0,
                        value: 0,
                        ap: {
                            base: 0,
                            value: 0,
                            mod: {}
                        },
                        attribute: "",
                        mod: {}
                    },
                    limit: {
                        value: 0,
                        attribute: "",
                        mod: {},
                        base: 0
                    },
                    extended: false,
                    opposed: {
                        type: "",
                        attribute: "",
                        attribute2: "",
                        skill: "",
                        mod: 0,
                        description: ""
                    },
                    alt_mod: 0,
                    dice_pool_mod: {}
                },
                type: ""
            },
            permission: {
                default: 2
            }
        };
    }

    ExtractTranslation() {
        if(!DataImporter.jsoni18n) {
            return;
        }

        let jsonQualityi18n = ImportHelper.ExtractDataFileTranslation(DataImporter.jsoni18n, 'qualities.xml');
        this.categoryTranslations = ImportHelper.ExtractCategoriesTranslation(jsonQualityi18n);
        this.qualityTranslations = ImportHelper.ExtractItemTranslation(jsonQualityi18n, 'qualities', 'quality');
    }

    async Parse(jsonObject: object): Promise<Entity> {
        const jsonNameTranslations = {};
        const folders = await ImportHelper.MakeCategoryFolders(jsonObject, "Qualities", this.categoryTranslations);
        console.log(folders);

        const parser = new QualityParserBase();

        let datas: Quality[] = [];
        let jsonDatas = jsonObject["qualities"]["quality"];
        for (let i = 0; i < jsonDatas.length; i++) {
            let jsonData = jsonDatas[i];
            let data = parser.Parse(jsonData, this.GetDefaultData());

            let category = ImportHelper.stringValue(jsonData, "category");
            data.folder = folders[category.toLowerCase()].id;
            data.name = ImportHelper.MapNameToTranslation(this.qualityTranslations, data.name);

            datas.push(data);
        }

        return await Item.create(datas);
    }
}