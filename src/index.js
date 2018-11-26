import './scss/main.scss';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
let currentCategory = 1;



// function addHTML() {
    let _makeHtmlProducts = require('./modules/product-html');
    let _makeHtmlCategories = require('./modules/categories-html');
    jQuery.ajax({
        url: 'https://nit.tron.net.ua/api/product/list',
        method: 'get',
        dataType: 'json',
        success: function (json) {
            console.log('Loaded via AJAX!');
            json.forEach(product => $('.product-grid').append(_makeHtmlProducts(product)));
            console.log('Added to grid');
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
    jQuery.ajax({
        url: 'http://nit.tron.net.ua/api/category/list',
        method: 'get',
        dataType: 'json',
        success: function (json) {
            console.log('Loaded via AJAX!');
            json.forEach(category => $('.categoryList').append(_makeHtmlCategories(category)));
            console.log('Added to list');
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
    // addActiveCategory();
// }

// document.addEventListener("DOMContentLoaded", ready);
$(window).load(function ready() {
    addActiveCategory();
});

function  addActiveCategory() {
    // $('categoryListID').childList[currentCategory].addClass('activePoint');
    // $("ul.categoryList li").eq(currentCategory).addClass("activePoint");
    // $( "#categoryListID li:nth-child($currentCategory)").addClass("activePoint");
    let liArray=document.getElementById('categoryListId').getElementsByTagName('li');
    liArray[currentCategory].classList.add('activePoint');
    console.log('added');
 }