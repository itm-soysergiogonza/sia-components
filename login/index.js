// Importar MSAL
import * as msal from "@azure/msal-browser";

document.addEventListener('DOMContentLoaded', function() {
    // Manejar el botón de mostrar/ocultar contraseña
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function() {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            
            // Cambiar el ícono
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Manejar el formulario de login
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aquí iría la lógica de validación y envío del formulario
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            // Ejemplo de validación básica
            if (!username || !password) {
                alert('Por favor complete todos los campos');
                return;
            }

            // Aquí se enviaría la información al servidor
            console.log('Datos del formulario:', { username, password, rememberMe });
        });
    }

    // Manejar botones de redes sociales
    const socialButtons = document.querySelectorAll('.social-login .btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Aquí iría la lógica de autenticación con redes sociales
            console.log('Iniciando sesión con:', this.textContent.trim());
        });
    });

    // Configuración de MSAL
    const msalConfig = {
        auth: {
            clientId: "TU_CLIENT_ID", // Reemplazar con tu Client ID de Azure
            authority: "https://login.microsoftonline.com/TU_TENANT_ID", // Reemplazar con tu Tenant ID
            redirectUri: window.location.origin,
        },
        cache: {
            cacheLocation: "sessionStorage",
            storeAuthStateInCookie: false,
        }
    };

    // Inicializar MSAL
    const msalInstance = new msal.PublicClientApplication(msalConfig);

    // Scopes para la solicitud de acceso
    const loginRequest = {
        scopes: ["User.Read"]
    };

    // Función para manejar el inicio de sesión con Microsoft
    async function signInWithMicrosoft() {
        try {
            // Intenta iniciar sesión
            const loginResponse = await msalInstance.loginPopup(loginRequest);
            console.log("Login exitoso:", loginResponse);

            // Obtener el token
            const token = loginResponse.accessToken;

            // Obtener información del usuario
            const response = await fetch('https://graph.microsoft.com/v1.0/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const userData = await response.json();

            // Aquí puedes manejar la autenticación exitosa
            handleSuccessfulLogin({
                email: userData.mail || userData.userPrincipalName,
                name: userData.displayName,
                id: userData.id
            });

        } catch (error) {
            console.error("Error durante el inicio de sesión:", error);
            // Manejar el error apropiadamente
            handleLoginError(error);
        }
    }

    // Función para manejar el login exitoso
    function handleSuccessfulLogin(userData) {
        // Guardar la información del usuario
        sessionStorage.setItem('userInfo', JSON.stringify(userData));
        
        // Redirigir al usuario a la página principal o dashboard
        window.location.href = '/dashboard';
    }

    // Función para manejar errores de login
    function handleLoginError(error) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-danger';
        errorMessage.textContent = 'Error al iniciar sesión. Por favor, intente nuevamente.';
        document.querySelector('.login-container').prepend(errorMessage);
    }

    // Event Listeners
    document.addEventListener('DOMContentLoaded', () => {
        // Botón de Microsoft SSO
        document.getElementById('signInWithMicrosoft').addEventListener('click', signInWithMicrosoft);

        // ... existing event listeners ...
    });
}); 