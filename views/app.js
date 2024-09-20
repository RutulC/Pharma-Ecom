import axios from "axios";
let addToCart = document.querySelectorAll(".add-to-cart");

// function updateCart(prod) {
//   axios.post("/update-cart", prod).then((res) => {
//     console.log(res);
//   });
}

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // console.log(e);
    let prod = JSON.parse(btn.dataset.product);
    updateCart(prod);
    // console.log(prod)
  });
});
