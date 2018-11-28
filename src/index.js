import './scss/main.scss';
import $ from 'jquery';

// let generateHomeContent = require('./modules/HomeContentHtml');
import generateHomeContent from './modules/HomeContentHtml';
import generateShoppingContent from './modules/ShoppingContentHtml';

console.log(generateHomeContent);

window.jQuery = $;
window.$ = $;

document.addEventListener("DOMContentLoaded", ready);
function ready() {
    initMenuBar();
    generateHomeContent();

}
function initMenuBar() {
    $('#menuHomeID').on("click", generateHomeContent);
    $('#menuShoppingID').on("click", generateShoppingContent);

}
// function generateHomeContent() {
//     let contentDiv = $('#contentDIVID');
//     let items = $(`
//   <div class="home">
//     <div class="homeCenterIm">
//         <img src="../src/img/electronics.jpg">
//         <div class="saleInfo">
//          <p class="header">price drop!</p>
//          <p>Up to 40% off!</p>
//             <span class="shopNowButton">
//             <button type="button" class="btn btn-light" id="homeButtonID" >Shop now</button>
//             </span>
//         </div>
//     </div>
//    </div>`);
//     contentDiv.empty();
//     contentDiv.append(items);
//     $('#homeButtonID').on("click", generateShoppingContent);
// }


let currentCategory = 0;

// function generateShoppingContent() {
//     generateShoppingHTML();
//     addCategoriesHTML();
// }

function generateShoppingHTML() {

    let contentDiv = $('#contentDIVID');
    let items = $(`
            <div class="shopping">
                <div class="leftbar">
                    <!-- Categories -->
                    <p class=" header">Categories</p>
                    <ul class="categoryList" id="categoryListID"></ul>
                </div>
             <div class="productsRightPart">
                <div class="container">
                   <div class="row product-grid"></div>
                </div>
             </div>
            </div>`);
    contentDiv.empty();
    contentDiv.append(items);
}


function changeActiveCategory() {
    let k = currentCategory - 1;
    $("ul.categoryList li").eq(k).removeClass("activePoint");
    let num = $(this).attr("id");
    if (num === undefined)
        num = 1;
    currentCategory = num;
    k = currentCategory - 1;
    $("ul.categoryList li").eq(k).addClass("activePoint");
    $('.product-grid').empty();
    addProductsGrid(currentCategory);
}

let _makeHtmlInfoProduct = ({
                             id,
                             name,
                             image_url,
                             description,
                             price,
                             special_price,
                         }) => {
    let $product = $(`<div class="productInfoPage">`);
    $product.append($(`<img src="${image_url}" alt="${name}" class="img-fluid product-Bigimage">`));
    $product.append($(`<p class="product-title">${name}</p>`));
    if (special_price == null) {
        $product.append($(`<span class="product-price">`).text(price));
    }
    else {
        $product.append($(`<p class="product-price old_price">`).text(price));
        $product.append($(`<p class="product-price special_price">`).text(special_price));
    }
    $product.append($(`<button type="button" class="product-buy-button btn btn-success"><i class="fas fa-shopping-cart"></i> Buy</button>`));
    $product.append($(`<p class="product-discription">`).text(description));
    $product.append($(`</div>`));
    return $product;

};


function addProduct(currentProductID) {
    let urlString = String("https://nit.tron.net.ua/api/product/" + currentProductID);
    jQuery.ajax({
        url: urlString,
        method: 'get',
        dataType: 'json',
        success: function (json) {
            console.log("Loaded product" + currentProductID + " via AJAX!");
            json.forEach(product => $('.productInfoPage').append(_makeHtmlInfoProduct(product)));
            console.log('Products are added to grid');
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
}


function addProductsGrid(currentCategory) {
    let urlString = String("https://nit.tron.net.ua/api/product/list/category/" + currentCategory);
    jQuery.ajax({
        url: urlString,
        method: 'get',
        dataType: 'json',
        success: function (json) {
            console.log("Loaded products of category " + currentCategory + " via AJAX!");
            json.forEach(product => $('.product-grid').append(_makeHtmlProducts(product)));
            let ar= $('.product-title-clickable');
            // for (let i = 0; i < ar.length; ++i) {
            //     // do something with `substr[i]`
            //     ar[i].on("click", generateProductPage);
            // }
            // $.each( ar,function() {
            //     this.on("click", generateProductPage);
            // });
            console.log('Products are added to grid');
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
}


function addCategoriesHTML() {
    jQuery.ajax({
        url: 'http://nit.tron.net.ua/api/category/list',
        method: 'get',
        dataType: 'json',
        success: function (json) {
            console.log('Loaded categories via AJAX!');
            json.forEach(category => $('.categoryList').append(_makeHtmlCategories(category)));
            console.log('Added to list');
            // choosing current active category - by default - 0 (all)
            changeActiveCategory();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
}

let _makeHtmlCategories = ({
                               id,
                               name,
                               description,
                           }) => {
    let $category = $(`<li class="category" id="${id}" about="${description}"></li>`);
    $category.append($(`<a> ${name} </a>`));
    $category.on("click", changeActiveCategory);
    return $category;
};

let _makeHtmlProducts = ({
                             id,
                             name,
                             image_url,
                             description,
                             price,
                             special_price,
                         }) => {
    let $product = $(`<div class="card col-xs-9 col-sm-5 col-md-3" data-product-id="${id}">`);
    $product.append($(`<img src="${image_url}" alt="${name}" class="img-fluid product-image">`));
    $product.append($(`<a class="product-title product-title-clickable">${name}</a>`));
    if (special_price == null) {
        $product.append($(`<span class="product-price">`).text(price));
    }
    else {
        $product.append($(`<p class="product-price old_price">`).text(price));
        $product.append($(`<p class="product-price special_price">`).text(special_price));
    }
    $product.append($(`<button type="button" class="product-buy-button btn btn-success"><i class="fas fa-shopping-cart"></i> Buy</button>`));
    return $product;
};

function generateProductPage() {
    let num =$(this).attr("id");
    console.log(num);
    let contentDiv = $('#contentDIVID');
    let items = $(` 
  <div class="productPage">
   <p class="backToShopping"><i class="fas fa-arrow-left"></i></p>
  
</div>`);
    contentDiv.empty();
    contentDiv.append(items);
    addProduct(num);
}