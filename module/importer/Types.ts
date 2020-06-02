declare type PhysicalAttribute = "body" | "agility" | "reaction" | "strength";
declare type MentalAttribute = "logic" | "intuition" | "charisma";
declare type SpecialAttribute = "edge" | "essence" | "magic" | "resonance";
declare type MatrixAttribute = "attack" | "sleaze" | "data proc." | "firewall"

/**
 * Any valid attribute that an actor can have.
 */
declare type ActorAttribute = PhysicalAttribute | MentalAttribute | SpecialAttribute | MatrixAttribute | "";

declare enum DamageType {physical = "physical", stun = "stun", matrix = "matrix", none = ""}
declare enum DamageElement {fire = "fire", cold = "cold", acid = "acid", electricity = "electricity", radiation = "radiation", none = ""}

declare enum OpposedType {defense = "defense", soak = "soak", armor = "armor", custom = "custom", none = ""}

declare type NumberOrEmpty = number | "";

//TODO

declare type Skill = string;

/**
 * A pair of fields for types that have a base and current value.
 */
declare type BaseValuePair<TType> = {
    base: TType,
    value: TType
}
/**
 * A pair of fields for types that have a current and max value.
 */
declare type ValueMaxPair<TType> = {
    value: TType,
    max: TType
}

/**
 * A list of mods to apply to a value.
 */
declare type ModList<TType> = {
    [name: string]: TType
}
/**
 * A value that is modifiable, having a base and current value, along with associated mod list.
 */
declare type ModifiableValue = BaseValuePair<number> & {
    mod: ModList<number>
}
/**
 * A modifiable value that also scales with an attribute.
 */
declare type ModifiableValueLinked = ModifiableValue & {
    "attribute": ActorAttribute
}

/**
 * Description data for an item.
 */
declare type DescriptionData = {
    value: string,
    chat: string,
    source: string
};

/**
 * Weapon action data.
 */
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
/**
 * Action limit data.
 */
declare type LimitData = ModifiableValueLinked
/**
 * Action damage data.
 */
declare type DamageData = ModifiableValueLinked & {
    type: BaseValuePair<DamageType>,
    element: BaseValuePair<DamageElement>,
    ap: ModifiableValue
};
/**
 * Action opposed test data.
 */
declare type OpposedTestData = {
    type: OpposedType,
    attribute: ActorAttribute,
    attribute2: ActorAttribute,
    skill: Skill,
    mod: number,
    description: string
};

/**
 * Technology data for an item.
 */
declare type TechnologyData = {
    rating: NumberOrEmpty,
    availability: string,
    quantity: NumberOrEmpty,
    cost: NumberOrEmpty,
    equipped: boolean,
    conceal: ModifiableValue
};

/**
 * Condition data for an item.
 */
declare type ConditionData = ValueMaxPair<number>;

/**
 * Weapon categories.
 */
declare enum WeaponCategory {
    range = "range",
    melee = "melee",
    thrown = "thrown"
}

/**
 * Ammunition data for an weapon.
 */
declare type AmmunitionData = {
    spare_clips: ValueMaxPair<number>,
    current: ValueMaxPair<number>
};

/**
 * Ranged weapon specific data.
 */
declare type RangeWeaponData = {
    category: "",
    ranges: RangeData,
    rc: ModifiableValue,
    modes: FiringModeData
};
/**
 * Weapon ranges data.
 */
declare type RangeData = {
    short: number,
    medium: number,
    long: number,
    extreme: number,
    attribute?: ActorAttribute
};
/**
 * Valid firing modes data.
 */
declare type FiringModeData = {
    single_shot: boolean,
    semi_auto: boolean,
    burst_fire: boolean,
    full_auto: boolean
};

/**
 * Melee weapon specific data.
 */
declare type MeleeWeaponData = {
    reach: number
};

/**
 * Thrown weapon specific data.
 */
declare type ThrownWeaponData = {
    ranges: RangeData,
    blast: BlastData;
};
/**
 * Blast data.
 */
declare type BlastData = {
    radius: number,
    dropoff: number
};

/**
 * A valid weapon with all associated fields. Weapons still have all possible fields, but some
 * may be ignored based on the value of @category.
 */
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




