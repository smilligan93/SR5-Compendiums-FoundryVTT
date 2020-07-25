import {DataImporter} from "./DataImporter";
import {ImportHelper} from "../helper/ImportHelper";
import {Constants} from "./Constants";
import ComplexForm = Shadowrun.ComplexForm;
import {ComplexFormParserBase} from "../parser/complex-form/ComplexFormParserBase";

export class ComplexFormImporter extends DataImporter {
    CanParse(jsonObject: object): boolean {
        return jsonObject.hasOwnProperty("complexforms") && jsonObject["complexforms"].hasOwnProperty("complexform");
    }

    GetDefaultData(): ComplexForm {
        return {
            name: "Unnamed Form",
            folder: null,
            type: "complex_form",
            data: {
                description: {
                    value: "",
                    chat: "",
                    source: ""
                },
                action: {
                    type: "complex",
                    category: "",
                    attribute: "resonance",
                    attribute2: "",
                    skill: "compiling",
                    spec: false,
                    mod: 0,
                    mod_description: "",
                    damage: {
                        type: {
                            base: "physical",
                            value: "physical"
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
                        type: "defense",
                        attribute: "",
                        attribute2: "",
                        skill: "",
                        mod: 0,
                        description: ""
                    },
                    alt_mod: 0,
                    dice_pool_mod: {}
                },
                target: "",
                duration: "",
                fade: 0
            },
            permission: {
                default: 2
            }
        }
    }

    async Parse(jsonObject: object): Promise<Entity> {
        const parser = new ComplexFormParserBase();
        const folder = await ImportHelper.GetFolderAtPath(`${Constants.ROOT_IMPORT_FOLDER_NAME}/Complex Forms`, true);

        let datas: ComplexForm[] = [];
        let jsonDatas = jsonObject["complexforms"]["complexform"];
        for (let i = 0; i < jsonDatas.length; i++) {
            let jsonData = jsonDatas[i];

            let data = parser.Parse(jsonData, this.GetDefaultData());
            data.folder = folder.id;

            datas.push(data);
        }

        return await Item.create(datas);
    }
}