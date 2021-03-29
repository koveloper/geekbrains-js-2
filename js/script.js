'use strict';

const DFLT_GOODS_ITEM = {
	name: 'NEW',
	price: 99,
	description: 'Don\'t miss our new product.',
	images: [],
}

class GoodsItem {

	constructor({id, name, price, description, images} = DFLT_GOODS_ITEM) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.description = description;
		this.images = images;
	}

	getName() {
		return this.name;
	}

	getPrice() {
		return this.price;
	}

	getDescription() {
		return this.description;
	}

	getImages() {
		return this.images;
	}

	getHash() {
		return this.id + '-' + this.name + "-" + this.price + "-" + this.description;
	}

	render(container) {
		if(container) {
			const goodsItem = document.createElement('div');
			goodsItem.setAttribute('class', 'goods-item');
			goodsItem.setAttribute('id', 'gi-' + this.id);
			const goodsItemTitle = document.createElement('h3');
			goodsItemTitle.textContent = this.name;
			goodsItemTitle.setAttribute('style', 'pointer-events: none');
			const goodsItemPrice = document.createElement('p');
			goodsItemPrice.textContent = this.price;
			goodsItemPrice.setAttribute('style', 'pointer-events: none');
			goodsItem.append(goodsItemTitle);
			goodsItem.append(goodsItemPrice);
			container.append(goodsItem);
		}
	}

	isThisItem(target) {
		return target && target.id === 'gi-' + this.id;
	}

	static isGoodsItem(target) {
		return target && target.classList && target.classList.contains('goods-item');
	}

	static getGoodsItemIndex(target) {
		return GoodsItem.isGoodsItem(target) ? parseInt(target.id.replace('gi-', '')) : -1;  
	}
}

class CartItem extends GoodsItem{
	
	constructor(goodsItem = DFLT_CART_ITEM) {
		super(goodsItem);
		this.count = 0;
	}

	add(count = 0) {
		this.count += count;
	}

	getCount() {
		return this.count;
	}

	render(container) {
		//this method will overwrite parent render and used for render in cart only
	}
}

class Cart {

	constructor(container) {
		this.goodsMap = new Map();		
	}

	add(goodsItem, count = 1) {
		if(!this.goodsMap.has(goodsItem.getHash())) {
			this.goodsMap.set(goodsItem.getHash(), new CartItem(goodsItem));
		}
		const it = this.goodsMap.get(goodsItem.getHash());
		it.add(count);
		if(it.getCount() <= 0) {
			this.goodsMap.delete(it.getGoodsItem)
		}
		// console.log(this.getInnerGoodsCost());
		this.renderCompactView(document.querySelector('.cart-button'));
	}	

	getInnerGoodsCost() {
		return [...this.goodsMap.values()].reduce((acc, el) => {return acc + (el.getCount() * el.getPrice())}, 0);
	}

	getInnerGoodsCount() {
		return [...this.goodsMap.values()].reduce((acc, el) => {return acc + el.getCount()}, 0);
	}

	renderCompactView(container) {
		container.textContent = '';
		container.setAttribute('style', 'display: flex; flex-direction: column; align-items: center; justify-content: space-evenly');
		const sign = document.createElement('span');
		sign.textContent = 'Товаров: ' + this.getInnerGoodsCount();
		const cost = document.createElement('span');
		cost.textContent = 'на ' + this.getInnerGoodsCost() + ' р.';
		container.append(sign);
		container.append(cost);
		//this methods will be used for render compact cart view in the HTML page corner
	}

	renderMainView(container) {
		container.innerHTML = '';
		for(let it of this.goodsMap.values()) {
			it.render(container);
		}		
	}
}

class GoodsList {
	
	constructor() {
		this.goods = [];
		this.getContainer().addEventListener('click', (e) => {
			if(GoodsItem.isGoodsItem(e.target)) {
				e.stopPropagation();
				cart.add(this.goods[GoodsItem.getGoodsItemIndex(e.target)], 1);
			}
		});
	}

	getContainer() {
		return document.querySelector('.goods-list');
	}

	add(name = DFLT_GOODS_ITEM.name, price = DFLT_GOODS_ITEM.price, description = DFLT_GOODS_ITEM.description, images = DFLT_GOODS_ITEM.images) {
		const id = this.goods.length;
		this.goods.push(new GoodsItem({id, name, price, description, images}));
	}

	render() {
		const container = this.getContainer();
		container.innerHTML = '';
		this.goods.forEach(it => {it.render(container)});
	}
}

const cart = new Cart();

const goods = new GoodsList();
goods.add('Shirt', 150, 'Classic t-shirt with SubZero from Mortal Combat', []);
goods.add('Socks', 50, 'Classic socks with cat image', []);
goods.add('Jacket', 350, 'Classic jeans jacket', []);
goods.add('Shoes', 650, 'Classic sport shoes', []);
goods.render();
