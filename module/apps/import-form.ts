import { WeaponImporter } from "../importer/WeaponImporter";
import { ArmorImporter } from "../importer/ArmorImporter";
import { DataImporter } from "../importer/DataImporter";
import { AmmoImporter } from "../importer/AmmoImporter";
import { ModImporter } from "../importer/ModImporter";
import { SpellImporter } from "../importer/SpellImporter";
import {QualityImporter} from "../importer/QualityImporter";

export class Import extends Application {
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
        new QualityImporter()
    ];

    async parseXML(xmlSource) {
        let jsonSource = await DataImporter.xml2json(xmlSource);

        for (const di of Import.Importers) {
            if (di.CanParse(jsonSource)) {
                di.ExtractTranslation();
                await di.Parse(jsonSource);
            }
        }
    }

    async parseXmli18n(xmlSource) {
        let jsonSource = await DataImporter.xml2json(xmlSource);
        
        if (DataImporter.CanParseI18n(jsonSource)) {
            DataImporter.ParseTranslation(jsonSource);
        }
    }
    

    activateListeners(html) {
        html.find("button[type='submit']").on("click", async (event) => {
            event.preventDefault();

            let i18nXmlSource = html.find("#i18n-xml-source").val();
            await this.parseXmli18n(i18nXmlSource);

            let xmlSource = html.find("#xml-source").val();
            await this.parseXML(xmlSource);
        });
    }
}









