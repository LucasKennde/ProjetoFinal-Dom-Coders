export const renderLogin = () => {
    const loginForm = `
      <form id="login-form">
        <label for="email">Email:</label>
        <input type="email" id="email" required />

        <label for="password">Senha:</label>
        <input type="password" id="password" required />
        
        <button type="submit">Entrar</button>
      </form>
      <div id="error-message" style="color: red;"></div>
    `;

    document.querySelector('#app').innerHTML += loginForm;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = ''; 

        try {
            const token = await authenticateUser(email, password);
            sessionStorage.setItem('authToken', token); 
            
            console.log('Usuário autenticado com sucesso!', token);
        } catch (error) {
            errorMessage.textContent = error.message; 
        }
    });
};


const authenticateUser = async (email, password) => {
    const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
    });

    if (!response.ok) {
        throw new Error('Email ou senha inválidos.');
    }

    const data = await response.json();
    return data.token; 
};
