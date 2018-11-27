import './scss/main.scss';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
var currentCategory = 0;

document.addEventListener("DOMContentLoaded", ready);

function ready() {
    addCategoriesHTML();
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

function addProductsGrid(currentCategory) {
    let _makeHtmlProducts = require('./modules/product-html');
    let urlString = String("https://nit.tron.net.ua/api/product/list/category/" + currentCategory);
    jQuery.ajax({
        url: urlString,
        method: 'get',
        dataType: 'json',
        success: function (json) {
            console.log("Loaded products of category " + currentCategory + " via AJAX!");
            json.forEach(product => $('.product-grid').append(_makeHtmlProducts(product)));
            console.log('Products are added to grid');
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
}

function addCategoriesHTML() {
    // let _makeHtmlCategories = require('./modules/categories-html');
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
}

