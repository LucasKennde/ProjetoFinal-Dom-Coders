import './style.css';
import { renderLogin } from './components/Login.js';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>Bem-vindo ao E-commerce</h1>
`;

renderLogin(); 


