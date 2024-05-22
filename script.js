const menu = document.getElementById("menu")
const cartbtn = document.getElementById("cart-btn")
const cartmodal = document.getElementById("cart-modal")
const cartitemscontainer = document.getElementById("cart-items")
const carttotal = document.getElementById("cart-total")
const checkoutbtn = document.getElementById("checkout-btn")
const closemodalbtn = document.getElementById("close-modal-btn")
const cartcounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressInputwarn = document.getElementById("address-warn")


let cart = [];


// Abrir o modal do carrinho

cartbtn.addEventListener("click", function(){
    updateCartmodal()
    cartmodal.style.display = "flex" 
    
})

// Fechar o modal quando clicar fora

cartmodal.addEventListener("click", function(event){
   if(event.target === cartmodal){
    cartmodal.style.display = "none"
   }
})

// fechar através do botão fechar
closemodalbtn.addEventListener("click", function(){
    cartmodal.style.display = "none"
})

menu.addEventListener("click",function(event){
    //console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")

    //console.log(parentbutton);

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        //console.log(name)
        //console.log(price)

        //Adicionar no carrinho
        addTocart(name,price)

        
    }

} )

//Função para adicionar no carrinho
function addTocart(name, price)
    {
        const existingItem = cart.find(item => item.name === name)

        if(existingItem){
            //se o item aumenta apenas a quantidade + 1
            existingItem.quantity += 1;
            
        }else{
            cart.push({
                name,
                price,
                quantity:1,
            })
    
        }

        updateCartmodal()

    }

    //Atualiza o carrinho
    function updateCartmodal(){
        cartitemscontainer.innerHTML = "";
        let total = 0;



        cart.forEach(item =>{
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

            cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>${item.quantity}</p>
                <p class="font-bold mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

                    <button class="remove-from-cart-btn" data-name="${item.name}">
                        Remover
                    </button>

        </div>
    `   
      
    total += item.price * item.quantity;

    cartitemscontainer.appendChild(cartItemElement)

        })

        carttotal.textContent = total.toLocaleString("pt-BR",{
            style:"currency",
            currency:"BRL"
        });

        cartcounter.innerHTML = cart.length;

    }


    //Função para remover item do carrinho
    cartitemscontainer.addEventListener("click", function (event){
        if(event.target.classList.contains("remove-from-cart-btn")){
            const name = event.target.getAttribute("data-name")

            removeItemCart(name);
        }
    })

    function removeItemCart(name){
        const index = cart.findIndex(item => item.name === name);

        if(index !== -1){
            const item = cart[index];
            
            if(item.quantity > 1){
                item.quantity -= 1;
                updateCartmodal();
                return;
            }

            cart.splice(index, 1);
            updateCartmodal();
        }

    }

    addressInput.addEventListener("input", function(event){
        let inputValue = event.target.value;

        if(inputValue !== ""){
            addressInput.classList.remove("hidden")
        }

    })

    //Finalizar pedido
    checkoutbtn.addEventListener("click", function(){

        const isOpen = checkRestaurentOpen();
        if(!isOpen){
            Toastify({
                text: "Ops o restaurante está fechado!",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "#ef4444",
                },
            }).showToast();

            return;
        }
        
        if(cart.length === 0) return;
        if(addressInput.value === ""){
            addressInputwarn.classList.remove("hidden") 
            addressInput.classList.add("border-red-500")
            return;
        }

        // Enviar o pedido para api whats
        const cartItems = cart.map((item) => {
            return(
                `${item.name} Quantidade: (${item.quantity}) Preço:R$ ${item.price}`
            )
        }).join("")

        const message = encodeURIComponent(cartItems)
        const phone = "5197704305"

        window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

        cart = [];
        updateCartmodal();

    })

    //Verificar a hora e manipular o card horario
    function checkRestaurentOpen(){
        const data = new Date();
        const hora = data.getHours();
        return hora >= 18 && hora < 23; 

        //true restaurante está aberto
    }

    
const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurentOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
