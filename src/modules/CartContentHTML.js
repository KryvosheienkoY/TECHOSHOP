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
    let length = cart.products.length;
    if (length < 1) {
        let items = $(`<p class="cartInfo">`).text("Your cart is empty :( ");
        contentDiv.append(items);
    }
    else {
        let productCart = $(`<div class="table-responsive">`);
        productCart.append($(`<table class="table" id="productCartGridID">`));
        contentDiv.append(productCart);
        let totalPrice = 0;
        for (let i = 0; i < length; i++) {
            let product = cart.products[i];
            let price=0;
            if(pro)
            totalPrice= totalPrice+ pro
            loadProduct(product.id, product.quantity, productCart);
        }
        $('#productCartGridID').append($(`<tfoot><tr class="totalRow"><td colspan="3">Subtotal</td>' +
        '<td id="totalCell"></td></tfoot>`));
    }
}


function loadProduct(currentProductID, quantity) {
    let urlString = String("https://nit.tron.net.ua/api/product/" + currentProductID);
    console.log(urlString);
    jQuery.ajax({
        url: urlString,
        method: 'get',
        dataType: 'json',
        success: function (json) {
            console.table(json);
            console.log("Loaded product " + currentProductID + " via AJAX!");
           $('#productCartGridID').append(_makeHtmlCartProduct(json, quantity));
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
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
                            }, {quantity}) => {
    let $product = $(`<tr class="productCartInfo">`);
    $product.append($(`<td class="imWrap"><img src="${image_url}" alt="${name}" class="img-fluid product-image"></td>`));
    $product.append($(`<td class="product-title">`).text(name));
    let priceTd = $(`<td class="product-price">`);
    if (special_price == null) {
        priceTd.append($(`<p class="product-price">`).text(price));
    }
    else {
        priceTd.append($(`<p class="product-price old_price">`).text(price));
        priceTd.append($(`<p class="product-price special_price">`).text(special_price));
    }
    $product.append(priceTd);

// <div class="sd-cart-qty" style="white-space: nowrap;">
//         <input type="button" value="-" style="visibility: visible;">
//         <input min="0" class="sd-line-item-qty" size="5" type="text" value="9" name="order[line_items_attributes][0][quantity]" id="order_line_items_attributes_0_quantity" style="width: 24px;" maxlength="5">
//         <input type="button" value="+">
//         </div>
    console.log("quantity - " + quantity);
    $product.append($(`<td class="product-quantity">`).text(quantity));
    return $product;
};


export {
    generateCartContent,
    addToCart
}
