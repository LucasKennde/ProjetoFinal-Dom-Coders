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

export const toggleModal = (): void => {
    const modal = document.querySelector('.modal-cart') as HTMLElement;
    modal.classList.toggle('showModal');
}

export const modalCart = async (): Promise<void> => {
    const modal = document.querySelector('.modal-cart') as HTMLElement;
    const cartItemsContainer = modal.querySelector('.cart-items') as HTMLElement;
    const subtotal = modal.querySelector('#subtotal') as HTMLElement;
    const total = modal.querySelector('#total') as HTMLElement;

    cartItemsContainer.innerHTML = '';

    const cartItems: CartItem[] = await searchCart();

    if (cartItems && cartItems.length > 0) {
        const productDetails = await getProductDetails(cartItems);
        let valorTotal = 0
        productDetails.forEach((product: Product) => {
            const cartItem = cartItems.find(item => item.productId === product.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            valorTotal += quantity * product.price
            const productElement = document.createElement('div');
            productElement.classList.add('cart-item');
            productElement.innerHTML = `

                <img src="${product.image}" alt="${product.title}" />
                <div class="content-Item">
                    <h3>${product.title}</h3>

                    <div>
                        <span id="price-item">R$ ${product.price.toFixed(2)}</span>
                        <div id="quantity-item">
                            <button> - </button>
                            <span>${quantity}</span>
                            <button> + </button>
                        </div>
                    </div>
                </div>
            `;

            const removeButton = productElement.querySelector('.remove-button');
            removeButton?.addEventListener('click', () => {
                console.log(`Remover ${product.title}`);
            });

            cartItemsContainer.appendChild(productElement);
        });
        subtotal.innerHTML = JSON.stringify(valorTotal)
        total.innerHTML = JSON.stringify(valorTotal)
    } else {
        cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
    }
}

const searchCart = async (): Promise<CartItem[]> => {
    try {
        const response = await fetch(`https://fakestoreapi.com/carts/${token.sub}`);
        const cart = await response.json();
        console.log(cart.products);
        return cart.products;
    } catch (err) {
        console.error(err);
        return [];
    }
}

const getProductDetails = async (cartItems: CartItem[]): Promise<Product[]> => {
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
modalCart()