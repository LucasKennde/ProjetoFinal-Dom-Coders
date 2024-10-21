import { Header } from "./Components/Header";
import { renderizarLogin } from "./pages/Login";
import { Vitrine } from "./pages/Vitrine";
import { toggleModal } from "./Components/Modal";

const token = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token') as string) : null;

const header = document.querySelector('.header')
header!.innerHTML = Header(token)

const modalButton = document.getElementById('button-cart');
const loginButton = document.getElementById('login-btn');

modalButton!.addEventListener('click', toggleModal);

if (loginButton) {
    loginButton.addEventListener('click', renderizarLogin);
}



if (token) {
    Vitrine();
} else {
    renderizarLogin();
}



Vitrine()
