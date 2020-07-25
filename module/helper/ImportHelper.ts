import {Constants} from "../importer/Constants";
import {XMLStrategy} from "./XMLStrategy";
import {JSONStrategy} from "./JSONStrategy";
import {ImportStrategy} from "./ImportStrategy";

export enum ImportMode {
    XML = 1,
    JSON = 2
}
export enum LookupMode {
    Directory = 0,
    Actor = 1
}

/**
 * An import helper to standardize data extraction.
 * Mostly conceived to reduced required refactoring if Chummer changes data file layout.
 * Also contains helper methods to safely parse values to appropriate types.
 */
export class ImportHelper {
    public static readonly CHAR_KEY = "_TEXT";

    private static s_Strategy: ImportStrategy = new XMLStrategy();

    public static SetMode(mode: ImportMode) {
        switch (mode) {
            case ImportMode.XML:
                ImportHelper.s_Strategy = new XMLStrategy();
                break;
            case ImportMode.JSON:
                ImportHelper.s_Strategy = new JSONStrategy();
                break;
        }
    }

    private constructor() { }

    /**
     * Helper method to create a new folder.
     * @param name The name of the folder.
     * @param parent The parent folder.
     * @returns {Promise<Folder>} A promise that resolves with the folder object when the folder is created.
     */
    public static async NewFolder(name: string, parent: Folder | null = null): Promise<Folder> {
        return await Folder.create({
            type: "Item",
            parent: (parent === null) ? null : parent.id,
            name: name
        });
    }

    /**
     * Get a folder at a path in the items directory.
     * @param path The absolute path of the folder.
     * @param mkdirs If true, will make all folders along the hierarchy if they do not exist.
     * @returns A promise that will resolve with the found folder.
     */
    public static async GetFolderAtPath(path: string, mkdirs: boolean = false): Promise<Entity> {
        let idx = 0;
        let curr, last = null;
        let next = path.split("/");
        while (idx < next.length) {
            curr = game.folders.find((folder) => folder.parent === last && folder.name === next[idx]);
            if (curr === null) {
                if (!mkdirs) {
                    return Promise.reject(`Unable to find folder: ${path}`);
                }

                curr = await ImportHelper.NewFolder(next[idx], last);
            }
            last = curr;
            idx++;
        }
        return Promise.resolve(curr);
    }

    /**
     * Get a value from the the provided jsonData, optionally returning a default value if it is not found
     * or is unable to be parsed to an integer.
     * @param jsonData The data to get the keyed value in.
     * @param key The key to check for the value under.
     * @param fallback An optional default value to return if the key is not found.
     */
    public static IntValue(jsonData: object, key: string, fallback: number|undefined = undefined): number {
        return ImportHelper.s_Strategy.intValue(jsonData, key, fallback);
    }

    /**
     * Get a value from the the provided jsonData, optionally returning a default value if it is not found.
     * @param jsonData The data to get the keyed value in.
     * @param key The key to check for the value under.
     * @param fallback An optional default value to return if the key is not found.
     */
    public static StringValue(jsonData: object, key: string|number, fallback: string|undefined = undefined): string {
        return ImportHelper.s_Strategy.stringValue(jsonData, key, fallback);
    }

    /**
     * Get an object from the the provided jsonData, optionally returning a default value if it is not found.
     * @param jsonData The data to get the keyed value in.
     * @param key The key to check for the value under.
     * @param fallback An optional default value to return if the key is not found.
     */
    public static ObjectValue(jsonData: object, key: string|number, fallback: object|null|undefined = undefined): object|null {
        return ImportHelper.s_Strategy.objectValue(jsonData, key, fallback);
    }
    
    //TODO
    public static findItem(nameOrCmp: string|ItemComparer): Entity {
        let result: any | null;
        if (typeof (nameOrCmp) === "string") {
            result = game.items.find((item) => item.name == nameOrCmp);
        } else {
            result = game.items.find(nameOrCmp);
        }
        return result;
    }

    //TODO
    public static async MakeCategoryFolders(jsonData: object, path: string): Promise<{ [name: string]: Folder }> {
        let folders = {};
        let jsonCategories = jsonData["categories"]["category"];
        for (let i = 0; i < jsonCategories.length; i++) {
            let categoryName = jsonCategories[i][ImportHelper.CHAR_KEY];
            folders[categoryName.toLowerCase()] = await ImportHelper.GetFolderAtPath(
                `${Constants.ROOT_IMPORT_FOLDER_NAME}/${path}/${categoryName}`,
                true
            );
        }
        return folders;
    }
}
export type ItemComparer = (item: Item) => boolean;