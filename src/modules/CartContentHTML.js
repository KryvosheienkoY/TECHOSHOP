import generateShoppingContent from "./ShoppingContentHtml";
import generateProductPage from "./ProductPageInfoHTML";


let cart;

function initCart() {
    cart = JSON.parse(localStorage.getItem('cart'));
    if (cart == null) {
        cart = {};
        cart.products = [];
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    else {
        setCartChangeCounter();
    }
}


// construct
function Product(id, name, image_url, description, price, special_price, quantity,) {
    this.id = id;
    this.name = name;
    this.image_url = image_url;
    this.description = description;
    this.price = price;
    this.special_price = special_price;
    this.quantity = quantity;
}

function generateEmptyCartView() {
    let contentDiv = $('#contentDIVID');
    contentDiv.empty();
    let items = $(`<p class="cartInfo">`).text("Your cart is empty :( ");
    contentDiv.append(items);
}

function generateSuccessfulModal() {
    let content = $(`<div id="myModal" class="modal">
	<div class="modal-dialog modal-confirm">
		<div class="modal-content">
			<div class="modal-header">
				<div class="icon-box">
					<i class="fas fa-check"></i>
				</div>				
				<p class="modal-title">Awesome!</p>	
			</div>
			<div class="modal-body">
				<p class="text-center">Your order has been confirmed. Check your email for details.</p>
			</div>
			<div class="modal-footer">
				<button class="btn btn-block" data-dismiss="modal" id="modalOKID">OK</button>
			</div>
		</div>
	</div>
</div>     `);
    let contentDiv = $('#contentDIVID');
    contentDiv.append(content);
    // remove attribs
    $('body').removeAttr('style');
}

function cleanCart() {
    cart.products = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    //clean view
    setCartChangeCounter();
    generateShoppingContent();
}

function processOrder() {
//post
    let strData = "name=" + $('#inputNameID').val() + '&' + "email=" + $('#inputEmailID').val() + '&' + "phone=" + $('#inputPhoneNumID').val() + '&';
    // cart products
    cart.products.forEach(function (product) {
        strData += "products[" + product.id + "]=" + product.quantity + '&';
    });
    // my token
    strData += "token=vj_dfNXhyP2f-T0ZxfDW";
    console.log("STRDATA - " + strData);
    $.ajax({
        url: 'https://nit.tron.net.ua/api/order/add',
        method: 'post',
        data: strData,
        dataType: 'json',
        success: function (json) {
            console.log(json);
            //if successful - clean cart
            cleanCart();
        },
    });

}

function generateOrderForm() {
    $('#contentDIVID').append($(`<form>
  <div class="form-row">
    <p class="formHeader">Quick Order</p>
     <div class="form-group">
     <label for="inputName">Name</label>
          <input type="text" class="form-control" id="inputNameID" placeholder="Your Name" required>
     </div>
     <div class="form-group">
     <label for="inputPhoneNum">Phone Number</label>
        <input type="text" placeholder="095234556" pattern="[0-9]{10}"
               class="form-control" id="inputPhoneNumID" required>
     </div>
     <div class="form-group">
        <label for="inputEmail">Email</label>
             <input type="email" class="form-control" id="inputEmailID" placeholder="Email"
             required>
     </div>
  </div>
  <div class="form-row">
      <button type="submit" class="btn orderB" id ="orderBID" >Order</button>
  </div>
</form>`));
    // modal successful order
    generateSuccessfulModal();

    let button = $('#orderBID');
    button.attr('data-toggle', 'modal');
    button.attr('data-target', '#myModal');
    button.on("click", processOrder);
}

function generateCartContent() {
    let contentDiv = $('#contentDIVID');
    let cart = JSON.parse(localStorage.getItem('cart'));
    let length = cart.products.length;
    if (length < 1) {
        generateEmptyCartView();
    }
    else {
        let productCart = $(`<div class="table-responsive">`);
        productCart.append($(`<table class="table" id="productCartGridID">`));
        contentDiv.empty();
        contentDiv.append(productCart);
        console.log("Cart - " + cart);
        for (let i = 0; i < length; i++) {
            let product = cart.products[i];
            $('#productCartGridID').append(_makeHtmlCartProduct(product));
            disableEnableMinusButton(product);
        }
        $('.minusQuantityButton').on("click", minusQ);
        $('.plusQuantityButton').on("click", plusQ);
        $('.product-removeB').on("click", removeProduct);
        console.log("Buttons were inited");
        //submit row
        $('#productCartGridID').append($(`<tfoot><tr class="totalRow"><td colspan="5">Subtotal</td>' +
        '<td id="totalCell" colspan="1"></td></tfoot>`));
        //generate order form
        generateOrderForm();
        // counting total sum
        countTotalCell();
       //  // remove fade & attribs
       // $('.modal-backdrop').remove();
       // let b =$('body');
       //  while(b.attributes.length > 0)
       //      b.removeAttribute(b.attributes[0].name);
    }
}

function countTotalCell() {
    let totalPrice = 0;
    // counting total sum
    let dataRows = $("#productCartGridID tr:not('.totalRow')");
    dataRows.each(function () {
        let valuePrice = parseInt($('td', this).eq(4).text());
        console.log("valuePrice price - " + valuePrice);
        if (!isNaN(valuePrice)) {
            totalPrice = totalPrice + valuePrice;
        }
    });
    $('#totalCell').text(totalPrice);
}


function disableEnableMinusButton(product) {
    let b = "#minusB" + product.id;
    if (product.quantity == 1) {
        $(b).attr("disabled", true);
    }
    else {
        $(b).attr("disabled", false);
    }
}

function removeProduct() {
    //remove tr
    let butID = $(this).attr("id");
    let productID = butID.replace("removeB", '');
    let trID = "#productTR" + productID;
    $(trID).remove();
    //remove from cart
    let i = findInCart(productID);
    cart.products.splice(i, 1);
    //refresh menuBar counter
    setCartChangeCounter();
    //check if cart is not empty
    if (cart.products.length > 0) {
        // refresh total sum
        countTotalCell();
    }
    else {
        //empty cart
        generateEmptyCartView();
    }

}

function increment(i, oldval) {
    return i + +oldval;
}

function minusQ() {
    let butID = $(this).attr("id");
    let productID = butID.replace("minusB", '');
    changeQTD(productID, -1);
}

function plusQ() {
    let butID = $(this).attr("id");
    let productID = butID.replace("plusB", '');
    changeQTD(productID, 1);
}

function changeQTD(productID, num) {
    // i - index of product in array
    let i = findInCart(productID);
    changeQ(i, num);
    let product = cart.products[i];

    // if quantity 1 - disable else enable
    disableEnableMinusButton(product);

    //refresh productCardGrid
    let spanP = $('#spanP' + productID);
    spanP.text(increment(num, spanP.text()));
    let tP = $('#totalPriceP' + productID);
    let price = cart.products[i].price;
    if (product.special_price != null) {
        price = product.special_price;
    }
    tP.text(product.quantity * price);
    // refresh total cell
    countTotalCell();
}

function loadProduct(currentProductID) {
    let urlString = String("https://nit.tron.net.ua/api/product/" + currentProductID);
    console.log(urlString);
    jQuery.ajax({
        url: urlString,
        method: 'get',
        dataType: 'json',
        success: function (json) {
            console.table(json);
            console.log("Loaded product " + currentProductID + " via AJAX!");
            let product = new Product(json.id, json.name, json.image_url,
                json.description, json.price, json.special_price, 1);
            cart.products.push(product);
            console.log("added pr - " + product.name);
            setCartChangeCounter();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
}


function generateModalAddedToCart() {
    let content = $(` <div id="myModalAdded" class="modal">
	<div class="modal-dialog modal-confirm">
		<div class="modal-content">
			<div class="modal-header">
				<div class="icon-box">
					<i class="fas fa-check"></i>
				</div>				
				<p class="modal-title">Added!</p>	
			</div>
			<div class="modal-body">
				<p class="text-center">Product was successfuly added to your cart.</p>
			</div>
			<div class="modal-footer">
				<button class="btn btn-block" data-dismiss="modal" id="modalToCartID">Go to cart</button>
				<button class="btn btn-block" data-dismiss="modal">Continue shopping</button>
			</div>
		</div>
	</div>
</div>`);
    let contentDiv = $('#contentDIVID');
    contentDiv.append(content);
    jQuery.noConflict();
    $('#myModalAdded').modal('show');
    $('#modalToCartID').on("click", function () {
        jQuery.noConflict();
        $('#myModalAdded').modal('hide');
        generateCartContent();
    });
    // remove attribs
    $('body').removeAttr('style');
}

function addToCart(productID) {
    let storageCart = localStorage.getItem('cart');
    if (storageCart) {
        cart = JSON.parse(storageCart);
        console.log("ProductID " + productID);
        // check if product is added
        let i = findInCart(productID);
        if (i == -1) {
            loadProduct(productID);
        }
        else {
            changeQ(i, 1);
        }
        setCartChangeCounter();

        // add popup window
        generateModalAddedToCart();
    }
}

function findInCart(productID) {
    for (let i = 0; i < cart.products.length; i++) {
        let p = cart.products[i];
        if (p.id === productID) {
            return i;
        }
    }
    // -1 if no product was found
    return -1;
}

function changeQ(i, num) {
    let p = cart.products[i];
    let q = p.quantity + num;
    if (q > 0)
        cart.products[i].quantity = q;
}

function setCartChangeCounter() {
    localStorage.setItem('cart', JSON.stringify(cart));
    // change menuBar cart counter
    let prAr = JSON.parse(localStorage.getItem('cart')).products;
    let num = 0;
    prAr.forEach(function (product) {
        num += product.quantity;
    });
    let counter = $('#cartCounter');
    counter.text(num);
}

let _makeHtmlCartProduct = ({
                                id,
                                name,
                                image_url,
                                description,
                                price,
                                special_price,
                                quantity
                            }) => {
    let $product = $(`<tr class="productCartInfo" id="productTR${id}">`);
    $product.append($(`<td class="imWrap"><img src="${image_url}" alt="${name}" class="img-fluid product-image"></td>`));
    let tdTitle = $(`<td>`);
    let title = $(`<a class="product-title" id="title${id}">${name}</a>`);
    title.on("click", generateProductPage.bind(null, title.attr('id')));
    tdTitle.append(title);
    $product.append(tdTitle);
    let priceTd = $(`<td class="product-price">`);
    let totalPrice;
    if (special_price == null) {
        priceTd.append($(`<p class="product-price">`).text(price));
        totalPrice = price * quantity;
    }
    else {
        priceTd.append($(`<p class="product-price old_price">`).text(price));
        priceTd.append($(`<p class="product-price special_price">`).text(special_price));
        totalPrice = special_price * quantity;
    }
    $product.append(priceTd);

    $product.append($(`<td class="sd-cart-qty" style="white-space: nowrap;">
     <button type="button" class="btn btn-xs minusQuantityButton" id="minusB${id}" > - </button>
        <span min="0" class="spanP" id="spanP${id}" style="width: 24px;">${quantity}</span>
      <button type="button" class="btn btn-xs plusQuantityButton" id="plusB${id}">+</button>
        </td>`));
    $product.append($(`<td class="product-total-Price" id="totalPriceP${id}">`).text(totalPrice));
    $product.append($(`<td><button type="button" class="btn btn-xs product-removeB" id="removeB${id}">Remove</button>`));
    return $product;
};


export {
    generateCartContent,
    addToCart,
    initCart
}
