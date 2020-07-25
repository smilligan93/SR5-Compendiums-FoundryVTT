/// <reference path="Shadowrun.ts" />
declare namespace Shadowrun {
    export type Cyberware = Item & {
        type: 'cyberware',
        data: CyberwareData
    };

    export type CyberwareData = {
        essence: number,
        action: ActionData,
        grade: CyberwareGrade,
        capacity: number
    };

    export type CyberwareGrade = "standard"|"alphaware"|"betaware"|"deltaware"|"used"|"";
}
