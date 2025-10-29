/*
TEMPLATE FOR NEW LAYERS
addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})
*/
addLayer("v", {
    name: "void", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "V", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        hasPrestiged: false,
        hasFractured: false,
        lastCurrent: decimalZero,
        bestCurrent: decimalZero,
    }},
    color: "#3e5d8c",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "void shard(s)", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('v',11)) mult = mult.mul(upgradeEffect('v',11))
        mult = mult.mul(buyableEffect('ef',22))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "v", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    buyables: {
        11: {
            title: "Void Cores",
            display() {
                let extradesc = ` + ` + player.extraCores
                return `Dim the light for generation of points.
                Cost: ${formatWhole(this.cost())} void shards
                Amount: ${getBuyableAmount(this.layer,this.id)} ${player.extraCores.gt(0) ? extradesc : ''}
                Currently: ${format(buyableEffect('v',11))}/s`

            },
            cost() {
                let base = new Decimal(10)
                let x = new Decimal(1.13)//points
                let y = getBuyableAmount(this.layer,this.id).sub(9) //exponent
                //THIS IS JUST AN EXAMPLE b*X^Y
                if (getBuyableAmount(this.layer,this.id).lt(10)) return getBuyableAmount(this.layer,this.id).add(1)
                else return base.mul(x.pow(y)).round()
            },
            canAfford(){
                return player.v.points.gte(this.cost())
            },
            buy() {
                player.v.points = player.v.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            effect() {
                let eff = getBuyableAmount(this.layer,this.id)
                eff = eff.add(player.extraCores)
                eff = eff.mul(buyableEffect('v',12).eff)
                hasAchievement('ach',22) ? eff = eff.mul(1.1) : eff = eff;
                return eff
            }
        },
        12: {
            title: "Void Hearts",
            display() {
                let ses = `Requirement:`
                return `Concentrate Void Cores into Hearts for a boost in their generation.
                ${ses} ${formatWhole(this.cost())} void cores
                Amount: ${getBuyableAmount(this.layer,this.id)}
                Effect: ×${format(buyableEffect(this.layer,this.id).base)} multiplier on Void Cores per Heart.
                Currently: ×${format(buyableEffect(this.layer,this.id).eff)}`
            },
            cost() {
                let base = new Decimal(3)
                let x = new Decimal(1.15)//points
                let y = getBuyableAmount(this.layer,this.id).min(12) //exponent
                let y2 = getBuyableAmount(this.layer,this.id).sub(11).max(0).pow(1.4) //exponent after 12
                if (getBuyableAmount(this.layer,this.id).gte(12))y = y.add(y2)
                //THIS IS JUST AN EXAMPLE X^Y
                return base.mul(x.pow(y)).ceil()
            },
            canAfford(){
                return getBuyableAmount('v',11).add(player.extraCores).gte(this.cost())
            },
            buy() {
                setBuyableAmount('v',11,decimalZero)
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
                player.points = new Decimal(10)
            },
            effect() {
                let base = new Decimal(1.2)
                base = base.add(buyableEffect('ef',12))
                return {
                    base:base,
                    eff:base.pow(getBuyableAmount(this.layer,this.id))
                }
            }
        },
        13: {
            title: "Point Enhancer",
            display() {
                let ses = `Cost:`
                return `Points boost themselves. Every new upgrade improves the formula.
                ${ses} ${formatWhole(this.cost())} points
                Amount: ${getBuyableAmount(this.layer,this.id)}
                Effect: ×${format(buyableEffect(this.layer,this.id).base)} on points.
                Currently: ×${format(buyableEffect(this.layer,this.id).eff)}
                Next: ×${format(buyableEffect(this.layer,this.id).next)}`
            },
            cost() {
                let base = new Decimal(10)
                let x = new Decimal(1.33)//points
                let y = getBuyableAmount(this.layer,this.id) //exponent
                //THIS IS JUST AN EXAMPLE X^Y
                return base.mul(x.pow(y)).ceil()
            },
            canAfford(){
                return getBuyableAmount('v',11).gte(1) && player.points.gte(this.cost())
            },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            effect() {
                let base = new Decimal(1.1)
                let bonus = base.pow(getBuyableAmount(this.layer,this.id).pow(0.65)).sub(1)
                let eff = player.points.add(1).log(3).times(bonus).add(1)
                let nextBonus = base.pow(getBuyableAmount(this.layer,this.id).add(1).pow(0.65)).sub(1)
                let next = player.points.add(1).log(3).times(nextBonus).add(1)
                if (hasUpgrade('v',14)) {
                    eff = eff.pow(upgradeEffect('v',14))
                    next = next.pow(upgradeEffect('v',14))
                }
                if (hasAchievement('ach',13)) {
                    eff = eff.mul(1.1)
                    next = next.mul(1.1)
                }
                if (hasAchievement('ach',17)) {
                    eff = eff.mul(1.21)
                    next = next.mul(1.21)
                }
                return {
                    base:base,
                    next:next,
                    eff:eff
                }
            }
        },
        21: {
            title: "Void Sigils",
            display() {
                let ses = `Requirement:`
                return `Complete a cycle of Void Hearts by obtaining ${formatWhole(this.cost().base)}, and lose them in exchange for a void sigil.
                ${ses} ${formatWhole(this.cost().base)} void hearts.
                Amount: ${formatWhole(getBuyableAmount(this.layer,this.id))}
                Effect: Reset all Void Hearts, Cores and Point Enhancers for void sigils.
                Reset for ${formatWhole(this.cost().current)} void sigil(s).
                Next: ${formatWhole(this.cost().next)} void hearts`
            },
            cost() {
                let base = new Decimal(10)
                base = base.sub(buyableEffect('ef',13))
                let baseC = new Decimal(3.5)
                let baseExp = new Decimal(2.5)
                if (hasAchievement('ach',24)) {
                    baseC = baseC.sub(2)
                    baseExp = baseExp.sub(1/2)
                }
                let potSigils = getBuyableAmount('v',12).add(1).sub(base).div(baseC).max(0).root(baseExp).ceil()
                let nextReq = potSigils.pow(baseExp)
                let next = base.add(new Decimal(baseC).times(nextReq)).floor()
                // the formula is 12 + (4x³) where x is the amount of potential sigils you would gain
                return {
                    base:base,
                    current:potSigils,
                    next:next,
                }
            },
            canAfford(){
                return getBuyableAmount('v',12).gte(this.cost().base)
            },
            buy() {
                player.v.lastCurrent = this.cost().current
                if (player.v.bestCurrent.lt(this.cost().current)) player.v.bestCurrent = this.cost().current
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(this.cost().current))
                setBuyableAmount('v',11,decimalZero)
                setBuyableAmount('v',12,decimalZero)
                setBuyableAmount('v',13,decimalZero)
                player.v.points = new Decimal(0)
                player.points = new Decimal(10)
                if (player.v.hasPrestiged === false) player.v.hasPrestiged = true
            },
            unlocked() {
                return player.v.hasPrestiged || player.v.buyables[12].gte(this.cost().base.sub(4))
            }
        },
        22: {
            title: "Shard Fracture",
            display() {
                let ses = `Requirement:`
                let hint = player.v.hasFractured ? `` : `<b>Reset for at least 10 void dust!!!</b>`
                return `Fracture your void shards for void dust. The most part will be lost.
                ${ses} ${formatWhole(this.cost().base)} void shards.
                Amount: ${formatWhole(getBuyableAmount(this.layer,this.id))}
                Effect: Reset all Void Hearts, Cores and Point Enhancers for void dust.
                Reset for ${formatWhole(this.cost().current)} void dust.
                Next: ${formatWhole(this.cost().next)} void shards
                ${hint}`
            },
            cost() {
                let base = new Decimal(1000000)
                let baseInc = new Decimal(500000)
                let baseExp = new Decimal(0.99)
                let potDust = player.v.points.add(1).sub(base).div(baseInc).max(0).root(baseExp).ceil()
                let nextReq = potDust.pow(baseExp)
                let next = base.add(new Decimal(baseInc).times(nextReq)).ceil()
                // the formula is b + bI*p^bE where p is the amount of potential sigils you would gain
                
                return {
                    base:base,
                    current:potDust,
                    next:next,
                }
            },
            canAfford(){
                return player.v.points.gte(this.cost().base)
            },
            buy() {
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(this.cost().current))
                setBuyableAmount('v',11,decimalZero)
                setBuyableAmount('v',12,decimalZero)
                setBuyableAmount('v',13,decimalZero)
                player.v.points = new Decimal(0)
                player.points = new Decimal(10)
                if (player.v.hasPrestiged === false) player.v.hasPrestiged = true
                if (player.v.hasFractured === false) player.v.hasFractured = true
            },
            unlocked() {
                return hasUpgrade('v',13)
            }
        },
    },
    upgrades: {
        11: {
            title: "Void Surge",
            description: "Point Enhancer also boosts Void shard gain at a reduced rate.",
            cost: new Decimal(1),
            effect() {
                let base = new Decimal(1.05)
                let eff = base.pow(getBuyableAmount('v',13).pow(0.75))
                return eff
            },
            effectDisplay() { return `×${format(this.effect())}` }, // Add formatting to the effect
            currencyDisplayName: "void sigil",
            currencyInternalName: 21,
            currencyLocation() {
                return player.v.buyables
            },
            unlocked() {
                return player.v.hasPrestiged
            },
            effect() { 
                let eff = buyableEffect('v',13).eff.pow(0.75)
                return eff
            }
            // costs 'v', 21 buyables, not void shards.
        },
        12: {
            title: "Cascade of Shards",
            description: "Void Shards boost points gain.",
            cost: new Decimal(1),
            effect() {
                let softcap = new Decimal(1e3)
                let softcap2 = new Decimal(1e6)
                let eff = player.v.points.min(softcap).pow(1.05).add(1)
                let eff2 = player.v.points.min(softcap2).div(softcap).log(2.2).pow(1.75).add(1)
                let eff3 = player.v.points.div(softcap2).add(1).log(10).root(1.5).add(1)
                if (player.v.points.gte(softcap)) eff = eff.times(eff2)
                if (player.v.points.gte(softcap2)) eff = eff.times(eff3)
                //the reason why eff2 is divided by 1e10 and not subtracted
                //is because e10 is a big number and void shards are expected
                //to reach bigger digits fast, so the penalty of e10 shards would be useless.
                return eff
            },
            effectDisplay() { return `×${format(this.effect())}` }, // Add formatting to the effect
            currencyDisplayName: "void sigil",
            currencyInternalName: 21,
            currencyLocation() {
                return player.v.buyables
            },
            unlocked() {
                return player.v.hasPrestiged
            },
            canAfford() {
                return hasUpgrade('v',11)
            }
        },
        13: {
            title: "Shard Splitting",
            description: "Unlock Shard Fracture.",
            cost: new Decimal(3),
            currencyDisplayName: "void sigils",
            currencyInternalName: 21,
            currencyLocation() {
                return player.v.buyables
            },
            unlocked() {
                return player.v.hasPrestiged
            },
            canAfford() {
                return hasUpgrade('v',12)
            }
        },
        14: {
            title: "Compounded Enhancing",
            description: "Point Enhancer's value raises itself.",
            cost: new Decimal(10),
            currencyDisplayName: "void dust",
            currencyInternalName: 22,
            currencyLocation() {
                return player.v.buyables
            },
            unlocked() {
                return player.v.hasFractured
            },
            canAfford() {
                return hasUpgrade('v',13)
            },
            effect() {
                let eff = new Decimal(2).sub(decimalOne.div(buyableEffect('v',13).eff.pow(2).root(5)))
                return eff
            },
            effectDisplay() { return `^${format(this.effect())}` }
        },
        15: {
            title: "Symmetry Core",
            description: "Mult based on lowest of VCs or PEs to points. Imbalance lowers efficiency.",
            cost: new Decimal(2.5e4),
            currencyDisplayName: "void dust",
            currencyInternalName: 22,
            currencyLocation() {
                return player.v.buyables
            },
            unlocked() {
                return player.v.hasFractured
            },
            canAfford() {
                return hasUpgrade('v',14)
            },
            effect() {
                let a = getBuyableAmount('v',11).add(player.extraCores).max(1)
                let b = getBuyableAmount('v',13).max(1)
                let power = decimalOne.add(a.min(b).min(150).div(100))
                let eff = b.min(a).pow(power).mul(a.min(b).div(a.max(b))).max(1)
                return eff.min("1e15")
            },
            effectDisplay() { return `×${format(this.effect())}` }
        },
    },
    tabFormat: {
        "Main": {content: [
            "main-display",
            "prestige-button",
            ["display-text", function() { return 'You have ' + formatWhole(player.points) + ' points.' }],
            "blank",
            ["row", [["buyable",11],["buyable",12],["buyable",13]]],
            "blank",
            ["row", [["buyable",21],["buyable",22]]],
            "blank",
            ["row", [["upgrade",11],["upgrade",12],["upgrade",13],["upgrade",14],["upgrade",15]]],
        ]}
    }
})