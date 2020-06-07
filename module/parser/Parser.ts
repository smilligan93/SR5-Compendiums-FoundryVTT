import {ImportHelper} from "../importer/ImportHelper";

export abstract class Parser<TResult> {
    public abstract Parse(jsonData: object, data: TResult): TResult;
}