const formulario = document.querySelector('#form');
const username = document.querySelector<HTMLInputElement>("#username");
const password = document.querySelector<HTMLInputElement>("#password");

async function logar(username: string, password: string): Promise<string | undefined> {
  try {
    const response = await fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao fazer login');
    }

    const data = await response.json();
    const token = data.token;


    sessionStorage.setItem('token', token);
    console.log('Token salvo no sessionStorage:', token);


    const decodedToken = decodeJWT(token);
    console.log('Token decodificado:', decodedToken);

    return token;

  } catch (error) {
    console.error("Deu bom não! Usuário ou senha incorretos.");
    return undefined;
  }
}


function decodeJWT(token: string): any {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonPayload);
}


if (username && password) {
  formulario?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = await logar(username.value, password.value);

    if (token) {
      console.log("Login bem-sucedido! Token armazenado.");
    } else {
      console.error("Falha no login! Verifique suas credenciais.");
    }
  });
}

export interface Produto {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: Rating
}

export interface Rating {
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
  const vitrine = document.getElementById('vitrine') as HTMLDivElement;





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
    vitrine.appendChild(produtoElement)

    console.log(produto)
  })
}
renderizarProdutos()






