import $ from "jquery";

let generateShoppingContent = require('./ShoppingContentHtml');


function generateHomeContent() {
let contentDiv = $('#contentDIVID');
let items = $(`
  <div class="home">
    <div class="homeCenterIm">
        <img src="../src/img/electronics.jpg">
        <div class="saleInfo">
         <p class="header">price drop!</p>
         <p>Up to 40% off!</p>
            <span class="shopNowButton">
            <button type="button" class="btn btn-light" id="homeButtonID" >Shop now</button>
            </span>
        </div>
    </div>
   </div>`);
    contentDiv.append(items);

    $('#homeButtonID').on("click", generateShoppingContent);
}

// module.exports = generateHomeContent;
export default generateHomeContent;
