/// <reference path="Shadowrun.ts" />
declare namespace Shadowrun {
    export type ComplexForm = {
        name: string,
        folder: string | null,
        type: "complex_form",
        data: {

        },
        permission: {
            default: 2
        }
    }
}