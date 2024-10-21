import { searchCart } from "../../Components/Modal";
import "./style.css"



const token = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token') as string) : null;

export const Vitrine = () => {
    interface Produto {
        id: number
        title: string
        price: number
        description: string
        category: string
        image: string
        rating: Rating
    }

    interface Rating {
        rate: number
        count: number
    }

    const buscarDados = 'https://fakestoreapi.com/products';

    async function fetchProducts() {
        const response = await fetch(buscarDados);
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }
        const resultado = await response.json();
        console.log(resultado)
        return resultado as Produto[];

    };


    async function adicionarCarrinho(produto: Produto) {
        const cartItems = sessionStorage.getItem('cart') ? JSON.parse(sessionStorage.getItem('cart') as string) : await searchCart();

        if (token) {
            const existingProductIndex = cartItems.findIndex((item: { productId: number }) => item.productId === produto.id);

            if (existingProductIndex > -1) {
                cartItems[existingProductIndex].quantity += 1;
            } else {
                const newItem = {
                    "productId": produto.id,
                    "quantity": 1
                };
                cartItems.push(newItem);
            }
            sessionStorage.setItem('cart', JSON.stringify(cartItems));
        } else {
            alert("Você precisa estar logado para adicionar produtos ao carrinho");
        }
    }



    async function renderizarProdutos() {
        const vitrine = document.getElementById('app') as HTMLDivElement;

        vitrine.innerHTML = `
        <div class="banner">
        <img src = "/images/banner.png">
        </div>
        <div class="category">
        <h1><div id="target"></div>Produtos</h1>
        <select>
        <option>Mais relevantes</option>
        <option>Menor Preço</option>
        <option>Maior Preço</option>
        <option>Melhor Avaliação</option>
        </select>
        </div>
        <div class="grid-produtos">
        
        </div>
        `
        const gridProdutos = document.querySelector('.grid-produtos') as HTMLDivElement

        const produtos = await fetchProducts();

        produtos.forEach(produto => {
            const produtoElement = document.createElement('div');
            // produtoElement.innerHTML = JSON.stringify(produto)
            produtoElement.innerHTML = `
        <img src="${produto.image}" alt="">
        <h2>${produto.title}</h2>
        <div>
          <p>R$${produto.price}</p>       
          <button class="adicionar">Adicionar ao carrinho</button>
        </div>
      `
            const button = produtoElement.querySelector(".adicionar") as HTMLButtonElement
            button.addEventListener("click", (event) => adicionarCarrinho(produto))
            gridProdutos.appendChild(produtoElement)

        })
    }
    renderizarProdutos()
}
