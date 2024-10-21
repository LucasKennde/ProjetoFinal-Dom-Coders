import "./style.css"

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


    function adicionarCarrinho(produto: Produto) {
        console.log("produtoAdicionado:", produto)

    }


    async function renderizarProdutos() {
        const vitrine = document.getElementById('app') as HTMLDivElement;

        vitrine.innerHTML = `
        <div class="banner">
        <img src = "/images/banner.png">
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
