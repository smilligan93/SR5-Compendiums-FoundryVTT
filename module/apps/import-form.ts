import {WeaponImporter} from "../importer/WeaponImporter";
import {ArmorImporter} from "../importer/ArmorImporter";
import {DataImporter} from "../importer/DataImporter";
import {AmmoImporter} from "../importer/AmmoImporter";
import {ModImporter} from "../importer/ModImporter";
import {SpellImporter} from "../importer/SpellImporter";
import {QualityImporter} from "../importer/QualityImporter";
import {ComplexFormImporter} from "../importer/ComplexFormImporter";
import {CyberwareImporter} from "../importer/CyberwareImporter";
import {ImportHelper, ImportMode} from "../helper/ImportHelper";

export class Import extends Application {
    private supportedDataFiles: String[] = [
        'armor.xml',
        'bioware.xml',
        'cyberware.xml',
        'spells.xml',
        'weapons.xml',
        'gear.xml'
    ];
    private dataFiles: File[] = [];
    private langDataFile: File;

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.id = 'chummer-data-import';
        options.classes = ["app", "window-app", "filepicker"];
        options.title = 'Chummer/Data Import';
        options.template = 'modules/shadowrun5e-compendiums/templates/apps/compendium-import.html';
        options.width = 600;
        options.height = "auto";
        return options;
    }

    //Order is important, ex. some weapons need mods to fully import
    static Importers: DataImporter[] = [
        new ModImporter(),
        new WeaponImporter(),
        new ArmorImporter(),
        new AmmoImporter(),
        new SpellImporter(),
        new ComplexFormImporter(),
        new QualityImporter(),
        new CyberwareImporter()
    ];

    async parseXML(xmlSource) {
        let jsonSource = await DataImporter.xml2json(xmlSource);
        ImportHelper.SetMode(ImportMode.XML);

        for (const di of Import.Importers) {
            if (di.CanParse(jsonSource)) {
                di.ExtractTranslation();
                await di.Parse(jsonSource);
            }
        }
    }

    async parseXmli18n(xmlSource) {
        if (!xmlSource) {
            return;
        }
        let jsonSource = await DataImporter.xml2json(xmlSource);

        if (DataImporter.CanParseI18n(jsonSource)) {
            DataImporter.ParseTranslation(jsonSource);
        }
    }

    isDataFile = (file: File): boolean => {
        return this.supportedDataFiles.some(supported => supported === file.name);
    }

    isLangDataFile = (file: File): boolean => {
        const pattern = /[a-zA-Z]{2}-[a-zA-Z]{2}_data\.xml/;
        return file.name.match(pattern) !== null;
    }

    activateListeners(html) {
        html.find("button[type='submit']").on("click", async (event) => {
            event.preventDefault();

            if (this.langDataFile) {
                const text = await this.langDataFile.text();
                await this.parseXmli18n(text);
            }

            // Use for of pattern to allow await to actually pause.
            // don't use .forEach as it won't await for async callbacks.
            for (const dataFile of this.dataFiles) {
                console.error(dataFile.name);
                const text = await dataFile.text();
                await this.parseXML(text);
            }

        });

        html.find("input[type='file'].filedatadrop").on("change", async event => {
            Array.from(event.target.files).forEach((file: File) => {
                if (this.isDataFile(file)) {
                    // Allow user to overwrite an already added file, they have their reasons.
                    const existingIdx = this.dataFiles.findIndex(dataFile => dataFile.name === file.name);
                    if (existingIdx === -1) {
                        this.dataFiles.push(file);
                    } else {
                        this.dataFiles[existingIdx] = file;
                    }
                }

                if (this.isLangDataFile(file)) {
                    this.langDataFile = file;
                }
            })
        });
    }
}









