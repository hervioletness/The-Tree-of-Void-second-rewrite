# Upgrades

# Milestones

# Buyables
```js
buyables: {
    11: {
        title: "Title",
        display() {
            return "HAHAHA"
        },
        cost() {
            let x = point//points
            let y = exponent//exponent
            //THIS IS JUST AN EXAMPLE X^Y
            return x.pow(y)
        },
        canAfford(){
            return player.points.gte(this.cost())
        },
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
        }        
    }
}
```