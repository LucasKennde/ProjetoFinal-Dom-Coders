
const cartItems = sessionStorage.getItem('cart') ? JSON.parse(sessionStorage.getItem('cart') as string) : null;
export const Header = (token: any) => {
  return `
    <header class="container navbar">
      <nav>
        <div class="logo">
          <img src="/images/LOGO.png" alt>
        </div>
          <ul class="menu">
            <li>Categorias</li>
            <li>Categorias</li>
            <li>Novos Produtos</li>
            <li>Marcas</li>
          </ul>
      </nav>
      <div class="profile">
        <div class="search">
          <img src="/images/iconSearch.png" alt>
          <input type="search" placeholder="Buscar">
        </div>
        <div class="user">
          <div class="icon-cart"><img id="button-cart" src="/images/iconCart.png" alt>
          ${cartItems ? `<div id="quantity-items-cart">${cartItems.length}</div>` : ""}
          
          </div>
          <h3>${token ? "<img src='/images/Vector.png'>" : `<span id="login-btn">Faça seu login</span>`}</h3>
        </div>
      </div>
    </header>
  `;
}
