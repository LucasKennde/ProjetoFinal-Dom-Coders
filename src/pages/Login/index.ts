import { Header } from "../../Components/Header";
import { Vitrine } from "../Vitrine";
export const Login = () => {
  const loginHtml = `
    <main class="wrapper login">
        <div class="container">
          <div class="mcDOM">
            <img src="/images/mascoteDOM.png" alt="Mascote">
          </div>
          <div class="formLogin">
            <form id="form">
              <div class="titleForm">
                <h1>Faça o seu login!</h1>
                <span>Preencha as informações abaixo</span>
              </div>
              <label for="username">
                <span>Username</span>
                <input type="text" id="username" name="username">
              </label>
              <label for="password">
                <span>Senha</span>
                <input type="password" id="password" name="password">
              </label>
              <div class="spaceButton">
                <button type="submit" class="btn-login">Log in</button>
                <span>Esqueceu sua senha?</span>
              </div>
              <div class="space">
                <div></div>
                <span>ou continue com</span>
                <div></div>
              </div>
            </form>
          </div>
        </div>
      </main>
    `;

  setTimeout(() => {
    const formulario = document.querySelector('#form');
    const username = document.querySelector<HTMLInputElement>("#username");
    const password = document.querySelector<HTMLInputElement>("#password");

    formulario?.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (username && password) {
        const token = await logar(username.value, password.value);

        if (token) {
          console.log("Login bem-sucedido! Token armazenado.");
          const header = document.querySelector('.header')
          header!.innerHTML = Header(token)
          Vitrine()
        } else {
          console.error("Falha no login! Verifique suas credenciais.");
        }
      } else {
        console.error("Preencha os campos de usuário e senha.");
      }
    });
  }, 0);

  return loginHtml;
};

export const renderizarLogin = () => {
  const app = document.querySelector("#app") as HTMLDivElement
  app.innerHTML = Login();
}

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
    const decodedToken = decodeJWT(token);

    sessionStorage.setItem('token', JSON.stringify(decodedToken));
    console.log('Token salvo no sessionStorage:', decodedToken);

    return decodedToken;

  } catch (error) {
    console.error("Deu bom não! Usuário ou senha incorretos.");
    alert("usuario ou senha incorretos")
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

