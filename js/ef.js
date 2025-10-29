addLayer("ef", {
    name: "echof", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EF", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        upgFinished: decimalZero,
    }},
    color: "#a2d876ff",
    requires: new Decimal(1e20), // Can be a function that takes requirement increases into account
    resource: "echo fragment(s)", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(0.2)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    branches:['v'],
    buyables: {
        11: {
            title: "More Points",
            display() {
                return `Void Cores generate more points.
                <br>Currently: ×${format(this.effect())}
                Cost: ${format(this.cost())} echo fragment
                Amount: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}`
            },
            cost() {
                return decimalOne
            },
            canAfford() {
                return player.ef.points.gte(this.cost())
            },
            purchaseLimit: new Decimal(8),
            effect() {
                let eff = new Decimal(2).pow(getBuyableAmount(this.layer, this.id))
                return eff
            },
            buy() {
                player.ef.points = player.ef.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
                if (getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit)) {
                    player.ef.upgFinished = player.ef.upgFinished.add(1)
                }
            }
        },
        12: {
            title: "Better Void Hearts",
            display() {
                return `Void Hearts have a better base.
                <br>Currently: +${format(this.effect())} (+0.04 per purchase)
                Cost: ${format(this.cost())} echo fragment
                Amount: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}`
            },
            cost() {
                return decimalOne
            },
            canAfford() {
                return player.ef.points.gte(this.cost())
            },
            purchaseLimit: new Decimal(6),
            effect() {
                let eff = getBuyableAmount(this.layer, this.id).mul(0.04)
                return eff
            },
            buy() {
                player.ef.points = player.ef.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
                if (getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit)) {
                    player.ef.upgFinished = player.ef.upgFinished.add(1)
                }
            }
        },
        13: {
            title: "More Void Sigils",
            display() {
                return `Decrease Void Sigil requirement.
                Effect: -1 void sigil per upgrade.
                <br>Currently: -${formatWhole(this.effect())}
                Cost: ${format(this.cost())} echo fragment
                Amount: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}`
            },
            cost() {
                return decimalOne
            },
            canAfford() {
                return player.ef.points.gte(this.cost())
            },
            purchaseLimit: new Decimal(3),
            effect() {
                let eff = getBuyableAmount(this.layer, this.id).div(2).ceil()
                return eff
            },
            buy() {
                player.ef.points = player.ef.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
                if (getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit)) {
                    player.ef.upgFinished = player.ef.upgFinished.add(1)
                }
            }
        },
        21: {
            title: "Sigil Power",
            display() {
                return `Void Sigils boost point gain.
                <br>Currently: ×${format(this.effect())}
                Cost: ${format(this.cost())} echo fragment
                Amount: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}`
            },
            cost() {
                return decimalOne
            },
            canAfford() {
                return player.ef.points.gte(this.cost())
            },
            purchaseLimit: new Decimal(10),
            effect() {
                let bonus = getBuyableAmount(this.layer, this.id)
                let none = decimalOne
                let eff = getBuyableAmount('v', 21).pow(2).add(1).log(2).add(1).mul(Decimal.pow(Decimal.root(10, 10), bonus))
                if (getBuyableAmount('ef',21).gte(1)) {
                    return eff
                }
                else {
                    return none
                }
            },
            buy() {
                player.ef.points = player.ef.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
                if (getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit)) {
                    player.ef.upgFinished = player.ef.upgFinished.add(1)
                }
            }
        },
        22: {
            title: "Dust Empowering",
            display() {
                return `Void Dust boosts Void Shard gain.
                <br>Currently: ×${format(this.effect())}
                Cost: ${format(this.cost())} echo fragment
                Amount: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}`
            },
            cost() {
                return decimalOne
            },
            canAfford() {
                return player.ef.points.gte(this.cost())
            },
            purchaseLimit: new Decimal(10),
            effect() {
                let bonus = getBuyableAmount(this.layer, this.id)
                let none = decimalOne
                let eff = getBuyableAmount('v', 22).root(2).add(1).log(2).add(1).mul(Decimal.pow(Decimal.root(10, 10), bonus))
                if (getBuyableAmount('ef',22).gte(1)) {
                    return eff
                }
                else {
                    return none
                }
            },
            buy() {
                player.ef.points = player.ef.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
                if (getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit)) {
                    player.ef.upgFinished = player.ef.upgFinished.add(1)
                }
            }
        },
        23: {
            title: "Point Enhancer Enhancer",
            display() {
                return `Point Enhancer is better by ×1.1.
                <br>Currently: ×${formatWhole(this.effect())}
                Cost: ${format(this.cost())} echo fragment(s)
                Amount: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit())}`
            },
            cost() {
                return new Decimal(2)
            },
            canAfford() {
                return player.ef.points.gte(this.cost())
            },
            purchaseLimit() {
                let base = new Decimal(10)
                return base
            },
            effect() {
                let eff = new Decimal(1.1).pow(getBuyableAmount(this.layer, this.id))
                return eff
            },
            buy() {
                player.ef.points = player.ef.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
                if (getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit)) {
                    player.ef.upgFinished = player.ef.upgFinished.add(1)
                }
            }
        },
    },
    componentStyles: {
        "buyable"() {
            return {
                'height':"120px",
                "width":"180px",
                "border-radius":"15%",
            }
        }
    },    
    tabFormat: {
        "Main": {content: [
            "main-display",
            "prestige-button",
            ["display-text", function() { return 'You have ' + formatWhole(player.points) + ' points.' }],
            "blank",
            ["row", [["buyable",11],["buyable",12],["buyable",13]]],
            //"blank",
            ["row", [["buyable",21],["buyable",22],["buyable",23]]],
            //"blank",
            //["row", [["upgrade",11],["upgrade",12],["upgrade",13],["upgrade",14],["upgrade",15]]],
        ]}
    }
})