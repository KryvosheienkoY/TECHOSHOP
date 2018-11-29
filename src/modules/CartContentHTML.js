import $ from "jquery";

let cart = {};
cart.products = [];
localStorage.setItem('cart', JSON.stringify(cart));

// construct
function Product(id, quantity) {
    this.id = id;
    this.quantity = quantity;
}


function generateCartContent() {
    let contentDiv = $('#contentDIVID');
    contentDiv.empty();

    let cart = JSON.parse(localStorage.getItem('cart'));
    let length =cart.products.length;
    if(length<1){
        let items = $(`<p class="cartInfo">`).text("Your cart is empty :( ");
        contentDiv.append(items);
    }
    else {
        let productCart=$('<div class="productCartGrid">');
        for (let i = 0; i < length; i++) {
            productCart.append(_makeHtmlCartProduct(cart.products[i]));
        }
        contentDiv.append(productCart);
    }
}

function addToCart(productID) {
    if (localStorage && localStorage.getItem('cart')) {
        let cart = JSON.parse(localStorage.getItem('cart'));
        console.log("ProductID " + productID);
        // check if product is added
        let added = false;
        for (let i = 0; i < cart.products.length; i++) {
            if (cart.products[i].id === productID) {
                cart.products[i].quantity += 1;
                added = true;
                break;
            }
        }
        if (!added) {
            let product = new Product(productID, 1);
            cart.products.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log(localStorage.getItem('cart'));
        // change menuBar cart counter
        let num = JSON.parse(localStorage.getItem('cart')).products.length;
        console.log(num);
        $('#cartCounter').text(num);
    }
}


let _makeHtmlCartProduct = ({
                                id,
                                name,
                                image_url,
                                description,
                                price,
                                special_price,
                            }) => {
    let $product = $(`<div class="productInfoPage">`);
    $product.append($(`<img src="${image_url}" alt="${name}" class="img-fluid product-Bigimage">`));
    $product.append($(`<p class="product-title">`).text(name));
    if (special_price == null) {
        $product.append($(`<span class="product-price">`).text(price));
    }
    else {
        $product.append($(`<p class="product-price old_price">`).text(price));
        $product.append($(`<p class="product-price special_price">`).text(special_price));
    }
    let buyButton = $(`<button type="button" class="product-buy-button btn btn-success"><i class="fas fa-shopping-cart"></i> Buy</button>`);
    buyButton.on("click", addToCart.bind(null, id));
    $product.append(buyButton);
    $product.append($(`<p class="product-description">`).text(description));
    return $product;
};

export {
    generateCartContent,
    addToCart
}
