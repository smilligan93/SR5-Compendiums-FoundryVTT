/**
 * An import helper to standardize data extraction.
 * Mostly conceived to reduced required refactoring if Chummer changes data file layout.
 * Also contains helper methods to safely parse values to appropriate types.
 */
export class ImportHelper {
    public static readonly CHAR_KEY = "_TEXT";

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
        console.log(`Trying to find the following path: ${path}`);

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
    public static intValue(jsonData: object, key: string, fallback: number = undefined): number {
        try {
            return parseInt(jsonData[key][ImportHelper.CHAR_KEY]);
        }
        catch (e) {
            if (fallback !== undefined) {
                return fallback;
            } else {
                throw e;
            }
        }
    }

    /**
     * Get a value from the the provided jsonData, optionally returning a default value if it is not found.
     * @param jsonData The data to get the keyed value in.
     * @param key The key to check for the value under.
     * @param fallback An optional default value to return if the key is not found.
     */
    public static stringValue(jsonData: object, key: string|number, fallback: string = undefined): string {
        try {
            return jsonData[key][ImportHelper.CHAR_KEY];
        }
        catch (e) {
            if (fallback !== undefined) {
                return fallback;
            } else {
                throw e;
            }
        }
    }

    /**
     * A decorated parseInt which supports error suppression by providing a default value to
     * be returned in the event an error is raised.
     * @param value The value to parse.
     * @param fallback The devault value to return in case of error.
     */
    public static parseInt(value: any, fallback: number = undefined): number {
        try {
            return parseInt(value);
        }
        catch (e) {
            if (fallback !== undefined) {
                return fallback;
            } else {
                throw e;
            }
        }
    }
}