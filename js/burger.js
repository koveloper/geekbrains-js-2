'use strict';

class BurgerComponent {
    constructor({price, calories, description}) {
        this.price = price;
        this.calories = calories;
        this.description = description;
    }

    getPrice() {
        return this.price;
    }

    getCalories() {
        return this.calories;;
    }

    toString() {
        return this.description + ' (' + this.price + 'p' + ' / ' + this.calories + 'c)';
    }
}

class Burger extends BurgerComponent {
    
    static SIZE_SMALL = {price: 50, calories: 20, description: 'size SMALL'};
    static SIZE_BIG = {price: 100, calories: 40, description: 'size XXL'};

    static STUFF_CHEESE = {price: 10, calories: 20, description: 'CHEESE'};
    static STUFF_SALAD = {price: 20, calories: 5, description: 'SALAD'};
    static STUFF_POTATO = {price: 15, calories: 10, description: 'POTATO'};

    static COMPONENT_SPICES = {price: 15, calories: 0, description: 'SPICES'};
    static COMPONENT_MAYO = {price: 20, calories: 5, description: 'MAYO'};
    
    constructor(size = Burger.SIZE_SMALL, stuff = Burger.STUFF_CHEESE) {
        super(size);
        this.components = [new BurgerComponent(stuff)];                
    }

    addComponent(component = Burger.COMPONENT_SPICES) {
        this.components.push(new BurgerComponent(component));
        return this;
    }

    getPrice() {
        return super.getPrice() + this.components.reduce((acc, el) => {return acc + el.getPrice()}, 0);
    }

    getCalories() {
        return super.getCalories() + this.components.reduce((acc, el) => {return acc + el.getCalories()}, 0);    
    }

    toString() {
        return super.toString() + ' | ' + this.components.join(' + ') + ": \r\n\t" + this.getPrice() + 'p / ' + this.getCalories() + 'c';
    }

    static getSizes() {
        return [Burger.SIZE_SMALL, Burger.SIZE_BIG];
    }

    static getStuffs() {
        return [Burger.STUFF_CHEESE, Burger.STUFF_SALAD, Burger.STUFF_POTATO];
    }

    static getComponents() {
        return [Burger.COMPONENT_SPICES, Burger.COMPONENT_MAYO];
    }
}

for(let size of Burger.getSizes()) {
    for(let stuff of Burger.getStuffs()) {
        const burger = new Burger(size, stuff);
        console.log(burger.toString());
        for(let stuff of Burger.getComponents()) {
            burger.addComponent(stuff);
            console.log(burger.toString());
        }
    }
}