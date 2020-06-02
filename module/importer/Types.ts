declare type PhysicalAttribute = "body" | "agility" | "reaction" | "strength";
declare type MentalAttribute = "logic" | "intuition" | "charisma";
declare type SpecialAttribute = "edge" | "essence" | "magic" | "resonance";
declare type MatrixAttribute = "attack" | "sleaze" | "data proc." | "firewall"

declare type ActorAttribute = PhysicalAttribute | MentalAttribute | SpecialAttribute | MatrixAttribute | "";

declare type DamageType = "physical" | "stun" | "matrix" | "";
declare type DamageElement = "fire" | "cold" | "acid" | "electricity" | "radiation" | "";

declare type OpposedType = "" | "defense" | "soak" | "armor" | "custom";

declare type NumberOrEmpty = number | "";

//TODO
declare type Skill = string;

declare type BaseValuePair<TType> = {
    base: TType,
    value: TType
}
declare type ValueMaxPair<TType> = {
    value: TType,
    max: TType
}

declare type ModList<TType> = {
    [name: string]: TType
}
declare type ModifiableValue = BaseValuePair<number> & {
    mod: ModList<number>
}
declare type ModifiableValueLinked = ModifiableValue & {
    "attribute": ActorAttribute
}

declare type DescriptionData = {
    value: string,
    chat: string,
    source: string
};

declare type ActionData = {
    type: "varies",
    category: string,
    attribute: ActorAttribute,
    attribute2: ActorAttribute,
    skill: Skill,
    spec: boolean
    mod: number,
    mod_description: string,
    limit: LimitData,
    extended: boolean,
    damage: DamageData,
    opposed: OpposedTestData,
    alt_mod: number,
    dice_pool_mod: ModList<number>
};
declare type LimitData = ModifiableValueLinked
declare type DamageData = ModifiableValueLinked & {
    type: BaseValuePair<DamageType>,
    element: BaseValuePair<DamageElement>,
    ap: ModifiableValue
};
declare type OpposedTestData = {
    type: OpposedType,
    attribute: ActorAttribute,
    attribute2: ActorAttribute,
    skill: Skill,
    mod: number,
    description: string
};

declare type TechnologyData = {
    rating: NumberOrEmpty,
    availability: string,
    quantity: NumberOrEmpty,
    cost: NumberOrEmpty,
    equipped: boolean,
    conceal: ModifiableValue
};

declare type ConditionData = ValueMaxPair<number>;

declare type WeaponCategory = "range" | "melee" | "thrown";

declare type AmmunitionData = {
    spare_clips: ValueMaxPair<number>,
    current: ValueMaxPair<number>
};

declare type RangeWeaponData = {
    category: "",
    ranges: RangeData,
    rc: ModifiableValue,
    modes: FiringModeData
};
declare type RangeData = {
    short: number,
    medium: number,
    long: number,
    extreme: number,
    attribute?: ActorAttribute
};
declare type FiringModeData = {
    single_shot: boolean,
    semi_auto: boolean,
    burst_fire: boolean,
    full_auto: boolean
};

declare type MeleeWeaponData = {
    reach: number
};

declare type ThrownWeaponData = {
    ranges: RangeData,
    blast: BlastData;
};
declare type BlastData = {
    radius: number,
    dropoff: number
};

declare type Weapon = {
    name: string,
    folder: string,
    type: "weapon",
    data: {
        description: DescriptionData,
        action: ActionData,
        technology: TechnologyData,
        condition_monitor: ConditionData,
        category: WeaponCategory,
        ammo: AmmunitionData,
        range: RangeWeaponData,
        melee: MeleeWeaponData,
        thrown: ThrownWeaponData
    },
    permission: {
        default: 2
    }
};




