const modal = document.querySelector('.modal-cart') as HTMLElement;
const cartItemsContainer = modal.querySelector('.cart-items') as HTMLElement;
const subtotal = modal.querySelector('#subtotal') as HTMLElement;
const total = modal.querySelector('#total') as HTMLElement;

interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
}

interface CartItem {
    productId: number;
    quantity: number;
}

const token = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token') as string) : null;

export const toggleModal = () => {
    const modal = document.querySelector('.modal-cart') as HTMLElement;
    modal.classList.toggle('showModal');
}


const DisplayModal = async () => {
    const cartItems: CartItem[] = sessionStorage.getItem('cart') ? JSON.parse(sessionStorage.getItem('cart') as string) : await searchCart();

    cartItemsContainer.innerHTML = '';
    const productDetails = await getProductDetails(cartItems);
    let valorTotal = 0;

    productDetails.forEach((product: Product) => {
        const cartItem = cartItems.find(item => item.productId === product.id);
        if (!cartItem) return;

        const quantity = cartItem.quantity;
        valorTotal += quantity * product.price;

        const productElement = document.createElement('div');
        productElement.classList.add('cart-item');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" />
            <div class="content-Item">
                <h3>${product.title}</h3>
                <div>
                    <span id="price-item">R$ ${product.price.toFixed(2)}</span>
                    <div id="quantity-item">
                        <button class="decrease-quantity"> - </button>
                        <span class="item-quantity">${quantity}</span>
                        <button class="increase-quantity"> + </button>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(productElement);

        const decreaseBtn = productElement.querySelector('.decrease-quantity') as HTMLButtonElement;
        const increaseBtn = productElement.querySelector('.increase-quantity') as HTMLButtonElement;

        decreaseBtn.addEventListener('click', () => {
            updateQuantity(product.id, -1);
        });
        increaseBtn.addEventListener('click', () => {
            updateQuantity(product.id, 1);
        });
    });

    // Atualiza o subtotal e total
    subtotal.innerHTML = `R$ ${valorTotal.toFixed(2)}`;
    total.innerHTML = `R$ ${valorTotal.toFixed(2)}`;
};

const updateQuantity = (productId: number, change: number) => {
    const cartItems = JSON.parse(sessionStorage.getItem('cart') as string) as CartItem[];
    const cartItemIndex = cartItems.findIndex(item => item.productId === productId);

    if (cartItemIndex !== -1) {
        const cartItem = cartItems[cartItemIndex];
        cartItem.quantity += change;

        if (cartItem.quantity <= 0) {
            cartItems.splice(cartItemIndex, 1);
        }

        sessionStorage.setItem('cart', JSON.stringify(cartItems));

        DisplayModal();
    }
};




export const searchCart = async () => {
    try {
        const response = await fetch(`https://fakestoreapi.com/carts/${token.sub}`);
        const cart = await response.json();
        sessionStorage.setItem('cart', JSON.stringify(cart.products))
        return cart.products;
    } catch (err) {
        console.error(err);
        return [];
    }
}


export const getProductDetails = async (cartItems: CartItem[]): Promise<Product[]> => {
    const productDetails: Product[] = [];

    for (const item of cartItems) {
        try {
            const response = await fetch(`https://fakestoreapi.com/products/${item.productId}`);
            const product = await response.json();
            productDetails.push(product);
        } catch (err) {
            console.error(`Erro ao buscar o produto com ID ${item.productId}:`, err);
        }
    }

    return productDetails;
}
DisplayModal()