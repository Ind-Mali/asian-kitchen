// Taking the variable

const cartBtn = document.querySelector(".cart-item-purchase");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart")
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

// cart item
let cart = [];
let buttonsDOM = [];

// getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("data.json");
      let data = await result.json();
      return data;
    } catch (error) {
      console.log(error);

    }
  }
}

// display products
class UI {
  displayProducts(products){
    let restult = "";
    products.forEach(product => {
      restult += `
      <!-- single-item -->

          <div class="products">
            <div class="card img-container" style="width: 18rem;">
              <img src=${product.img} class="card-img-top" alt="products">
              <button class="bag-btn" data-id=${product.id}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
                <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z"/>
                <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg> add to cart </button>
              <div class="card-body">
                <h3 class="card-title">${product.title}</h3>
                <p class="card-text">${product.category}</p>
                <p class="card-text">${product.desc}</p>

              </div>
              <div>
                <h4>${product.price}</h4>
                </div>
            </div>
          </div>

          <!-- end of single item -->

      `
    });
    productsDOM.innerHTML = restult;
  }
  getBagButtons(){
    const btns = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = btns;
    btns.forEach(button =>{
      let id = button.dataset.id;
      let inCart = cart.find(item =>item.id === id);
      if(inCart){
        btns.innerText = "In Cart";
        btns.disabled = true;
      }
      else{
        button.addEventListener("click",event=>{
          event.target.innerText = "In Cart";
          event.target.disabled = true;
          // get product from products
          let cartItem = {...Storage.getProduct(id), amount : 1};
          // add product to the cart
          cart = [...cart, cartItem];
          // save cart in local storage
          Storage.saveCart(cart)
          // set cart values
          this.setCartValues(cart);
          // display cart item
          this.addCartItem(cartItem);
          // show the cart
          this.showCart();
          
        })
      }
    })
  }
  setCartValues(cart){
    let tempTotal = 0.00;
    let itemsTotal = 0.00;
    cart.map(item =>{
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount; 
    })
    cartTotal.innerText = parseFloat(tempTotal.toFixed(1));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item){
    const div = document.createElement("div");
    div.classList.add("cart-item")
    div.innerHTML = `
    <img src="${item.img}" alt="product">            
    <div>
      <h4>${item.title}</h4>
      <h5>${item.price}</h5>
      <span class="remove-item" data-id= ${item.id} >
        remove
      </span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id= ${item.id}></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-chevron-down" data-id= ${item.id}></i>
    </div>
  `
    cartContent.appendChild(div);

  }
  showCart(){
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  setupAPP(){
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click",this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart)
  }
  populateCart(cart){
    cart.forEach(item => {
      this.addCartItem(item);
    })
  }
  hideCart(){
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic(){
    clearCartBtn.addEventListener("click",()=>{
      this.clearCart()
    })
  }
  clearCart(){
    let cartItems = cart.map(item=> item.id);
    cartItems.forEach(id => this.removeItem(id));
    while(cartContent.children.length >0){
      cartContent.removeChild(cartContent.children[0])
    }
    this.hideCart();
  }
  removeItem(id){
    cart = cart.filter(item => item.id !==id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
  }
  getSingleButton(id){
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}
// Local Storage
class Storage {
  static saveProducts(products){
    localStorage.setItem("products",JSON.stringify(products))
  }
  static getProduct(id){
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }
  static saveCart(cart){
    localStorage.setItem("cart",JSON.stringify(cart))
  }
  static getCart(){
    return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI()
  const products = new Products()
  // setup app
  ui.setupAPP();
  //  get all product
  products.getProducts().then(products => {ui.displayProducts(products)
  Storage.saveProducts(products);
  }).then(()=>{
     ui.getBagButtons();
     ui.cartLogic();
  });
});