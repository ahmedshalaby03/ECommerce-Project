const category_nav_list = document.querySelector(".category_nav_list");
function open_categ_list(){
    category_nav_list.classList.toggle("active")
}
let nav_links = document.querySelector(".nav_links")
function open_Menu(){
    nav_links.classList.toggle("active")
}

const cart = document.querySelector('.cart');

function open_close_cart(e){
    if (e){
        e.preventDefault();
        e.stopPropagation();
    }
    cart.classList.toggle("active");
}

cart.addEventListener("click", function(e){
    e.stopPropagation();
});



fetch('products.json')
.then(response=> response.json())
.then(data => {
    const addToCartButtons = document.querySelectorAll(".btn_add_cart");
    
    addToCartButtons.forEach(button => {
        button.addEventListener("click", (event)=>{
            const productId = event.target.getAttribute('data-id')
            const selectedProduct = data.find(product => product.id == productId)


            addToCart(selectedProduct)

            const allMatchingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`)
            allMatchingButtons.forEach(btn=>{
                btn.classList.add("active");
                btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>Item in cart` ;
            })
        })
    })
    
})

function addToCart(product){
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    cart.push({...product , quantity:1})
    localStorage.setItem('cart', JSON.stringify(cart))
    updateCart()
}

function updateCart() {
    const cartItemsContainer = document.getElementById("cart_items");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const checkout_items = document.getElementById("checkout_items");

    const items_input = document.getElementById("items");
    const total_Price_input = document.getElementById("total_Price");
    const count_Items_input = document.getElementById("count_Items");

    let total_Price = 0;
    let total_Count = 0;

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = "";
    }

    if (checkout_items) {
        checkout_items.innerHTML = "";
    }

    if (items_input) items_input.value = "";
    if (total_Price_input) total_Price_input.value = "";
    if (count_Items_input) count_Items_input.value = "";

    cart.forEach((item, index) => {
        let total_Price_item = item.price * item.quantity;

        total_Price += total_Price_item;
        total_Count += item.quantity;

        // checkout hidden inputs
        if (items_input && total_Price_input && count_Items_input) {
            items_input.value += `${item.name} - price : ${total_Price_item} - count : ${item.quantity}\n`;
            total_Price_input.value = total_Price + 20;
            count_Items_input.value = total_Count;
        }

        if (cartItemsContainer) {
            cartItemsContainer.innerHTML += `
                <div class="item_cart">
                    <img src="${item.img}" alt="">
                    <div class="content">
                        <h4>${item.name}</h4>
                        <p class="price_cart">$${total_Price_item}</p>
                        <div class="quantity_control">
                            <button type="button" class="decrease_quantity" data-index="${index}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button type="button" class="increase_quantity" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button type="button" class="delete_item" data-index="${index}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
        }

        if (checkout_items) {
            checkout_items.innerHTML += `
                <div class="item_cart">
                    <div class="image_name">
                        <img src="${item.img}" alt="">
                        <div class="content">
                            <h4>${item.name}</h4>
                            <p class="price_cart">$${total_Price_item}</p>
                            <div class="quantity_control">
                                <button type="button" class="decrease_quantity" data-index="${index}">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button type="button" class="increase_quantity" data-index="${index}">+</button>
                            </div>
                        </div>
                    </div>

                    <button type="button" class="delete_item" data-index="${index}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
        }
        
    });

    const price_cart_total = document.querySelector(".price_cart_total");
    const count_item_cart = document.querySelector(".Count_item_Cart");
    const count_item_header = document.querySelector(".count_item_header");

    if (price_cart_total) {
        price_cart_total.innerHTML = `$ ${total_Price}`;
    }

    if (count_item_cart) {
        count_item_cart.innerHTML = `${total_Count}`;
    }

    if (count_item_header) {
        count_item_header.innerHTML = `${total_Count}`;
    }

    if (checkout_items) {
        const subtotal_checkout = document.querySelector(".subtotal_checkout");
        const total_checkout = document.querySelector(".total_checkout");

        if (subtotal_checkout) {
            subtotal_checkout.innerHTML = `${total_Price}`;
        }

        if (total_checkout) {
            total_checkout.innerHTML = `${total_Price + 20}`;
        }
    }

    const increaseButtons = document.querySelectorAll(".increase_quantity");
    const decreaseButtons = document.querySelectorAll(".decrease_quantity");
    const deleteButtons = document.querySelectorAll(".delete_item");

    increaseButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const itemIndex = event.currentTarget.getAttribute("data-index");
            increaseQuantity(itemIndex);
        });
    });

    decreaseButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const itemIndex = event.currentTarget.getAttribute("data-index");
            decreaseQuantity(itemIndex);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const itemIndex = event.currentTarget.closest("button").getAttribute("data-index");
            removeFromCart(itemIndex);
        });
    });
}


function increaseQuantity(index){
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    cart[index].quantity += 1
    localStorage.setItem('cart' , JSON.stringify(cart))
    updateCart()
}

function decreaseQuantity(index){
    let cart = JSON.parse(localStorage.getItem('cart')) || []


    if(cart[index].quantity > 1){
        cart[index].quantity -= 1
    }
    localStorage.setItem('cart' , JSON.stringify(cart))
    updateCart()
}


function removeFromCart(index){
    const cart = JSON.parse(localStorage.getItem('cart'))||[];
    const removeProduct = cart.splice(index,1)[0]
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart()
    updateButtonsState(removeProduct.id)
}

function updateButtonsState(productId){
    const allMatchingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`)
    allMatchingButtons.forEach(button => {
        button.classList.remove('active');
        button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>add to cart`

    })
}

updateCart()