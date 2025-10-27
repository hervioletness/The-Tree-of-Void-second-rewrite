addLayer("ach", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
    }},
    color: "#fffb00ff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 'side', // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    achievements: {
        11: {
            name: "The Beginning",
            done() { return getBuyableAmount('v',11).gte(1) },
            tooltip: "Have your first Void Core."
        },
        12: {
            name: "Getting Started",
            done() { return getBuyableAmount('v',12).gte(1) },
            tooltip: "Get your first Void Heart.<br>Reward: ×2 point multiplier.",
        },
        13: {
            name: "Another Step",
            done() { return getBuyableAmount('v',12).gte(5) },
            tooltip: "Get 5 Void Hearts.<br>Reward: Point Enhancers are 10% stronger."
        },
        14: {
            name: "An Emblem of the Void",
            done() { return player.v.hasPrestiged },
            tooltip: "Obtain your first Void Sigil.<br>Reward: ×2.5 point multiplier."
        },
        15: {
            name: "Void Mastery",
            done() { return getBuyableAmount('v',13).gte(20) },
            tooltip: "Get 20 upgrades to the Point Enhancer."
        },
        16: {
            name: "Shard Splinterer",
            done() { return player.v.hasFractured },
            tooltip: "Fracture your Void Shards.<br>Reward: Get a free Void Core.",
            onComplete() {
                player.extraCores = player.extraCores.add(1)
            }
        },
        17: {
            name: "Symmetric Cores",
            done() { return getBuyableAmount('v',11).add(player.extraCores).eq(100) && getBuyableAmount('v',13).eq(100) },
            tooltip: "Have exactly 100 Void Cores and 100 Point Enhancer upgrades at the same time.<br>Reward: Point Enhancers are 21% stronger.",
            
        },
        21: {
            name: "Echoic Initiation",
            done() { return player.ef.total.gte(1) },
            tooltip: "Obtain your first Echo Fragment.",
        },
        22: {
            name: "Upgrader",
            done() { return getBuyableAmount('ef',11).gte(tmp.ef.buyables[11].purchaseLimit) || getBuyableAmount('ef',12).gte(tmp.ef.buyables[12].purchaseLimit) || getBuyableAmount('ef',13).gte(tmp.ef.buyables[13].purchaseLimit)},
            tooltip: "Maximize any of the first row EF upgrades<br>Reward: Void Cores are 10% stronger.",
        },
    },
    tabFormat: [
        "blank",
        "blank",
        "blank",
        "blank",
        ["display-text", "<h2>Achievements</h2>"],
        "blank",
        "blank",
        ["row", [["achievement", 11], ["achievement", 12], ["achievement", 13], ["achievement", 14], ["achievement", 15], ["achievement", 16], ["achievement", 17]]],
        ["row", [["achievement", 21], ["achievement", 22], ["achievement", 23], ["achievement", 24], ["achievement", 25], ["achievement", 26], ["achievement", 27]]]
    ]
})