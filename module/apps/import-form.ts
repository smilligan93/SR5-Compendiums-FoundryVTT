import { ImportHelper } from "../importer/ImportHelper";
import { Constants } from "../importer/Constants";
import { WeaponImporter } from "../importer/WeaponImporter";
import { ArmorImporter } from "../importer/ArmorImporter";
import { DataImporter } from "../importer/DataImporter";

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

    static Importers: DataImporter[] = [
        new WeaponImporter(),
        new ArmorImporter()
    ];

    async parseXML(xmlSource) {
        let jsonSource = await DataImporter.xml2json(xmlSource);
        console.log(jsonSource);

        for (const di of Import.Importers) {
            if (di.canParse(jsonSource)) {
                await di.parse(jsonSource);
            }
        }
    }

    activateListeners(html) {
        html.find("button[type='submit']").on("click", async (event) => {
            event.preventDefault();

            let xmlSource = html.find("#xml-source").val();
            await this.parseXML(xmlSource);
        });
    }
}









