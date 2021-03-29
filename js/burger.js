'use strict';

const BurgerProperty = {
    size: {
        small: {price: 50, calories: 20, description: 'size SMALL'},
        big: {price: 100, calories: 40, description: 'size XXL'}
    },
    stuff: {
        cheese: {price: 10, calories: 20, description: 'CHEESE'},
        salad: {price: 20, calories: 5, description: 'SALAD'},
        potato: {price: 15, calories: 10, description: 'POTATO'}
    },
    components: {
        spices: {price: 15, calories: 0, description: 'SPICES'},
        mayo: {price: 20, calories: 5, description: 'MAYO'}
    }
}

class BurgerComponent {
    constructor({price, calories, description}) {
        this.price = price;
        this.calories = calories;
        this.description = description;
    }

    set price(value) {
        this._price = value;
    }
    
    get price() {
        return this._price;
    }
    
    set calories(value) {
        this._calories = value;
    }
    
    get calories() {
        return this._calories;;
    }

    toString() {
        return this.description + ' (' + this._price + 'p' + ' / ' + this._calories + 'c)';
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
    
    constructor(size = BurgerProperty.size.small, stuff = BurgerProperty.stuff.cheese) {
        super(size);
        this.components = [new BurgerComponent(stuff)];                
    }

    addComponent(component = BurgerProperty.components.spices) {
        this.components.push(new BurgerComponent(component));
        return this;
    }

    get price() {
        return super.price + this.components.reduce((acc, el) => {return acc + el.price}, 0);
    }

    get calories() {
        return super.calories + this.components.reduce((acc, el) => {return acc + el.calories}, 0);    
    }

    toString() {
        return super.toString() + ' | ' + this.components.join(' + ') + ": \r\n\t" + this.price + 'p / ' + this.calories + 'c';
    }

    static get sizes() {
        return [BurgerProperty.size.small, BurgerProperty.size.big];
    }

    static get stuffs() {
        return [BurgerProperty.stuff.cheese, BurgerProperty.stuff.salad, BurgerProperty.stuff.potato];
    }

    static get components() {
        return [BurgerProperty.components.spices, BurgerProperty.components.mayo];
    }
}

for(let size of Burger.sizes) {
    for(let stuff of Burger.stuffs) {
        const burger = new Burger(size, stuff);
        console.log(burger.toString());
        for(let stuff of Burger.components) {
            burger.addComponent(stuff);
            console.log(burger.toString());
        }
    }
}
