// Importar MSAL
import * as msal from "@azure/msal-browser";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const passwordInput = form.querySelector('input[type="password"]');
    const togglePassword = passwordInput.nextElementSibling;

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Update icon
        const svg = togglePassword.querySelector('svg');
        if (type === 'password') {
            svg.style.opacity = '1';
        } else {
            svg.style.opacity = '0.7';
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const userData = {
            tipo_usuario: document.querySelector('input[name="tipo_usuario"]:checked').value,
            usuario: formData.get('usuario'),
            password: formData.get('password'),
            remember: formData.get('remember-me') === 'on'
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                window.location.href = '/dashboard';
            } else {
                throw new Error('Error en la autenticación');
            }
        } catch (error) {
            console.error('Error:', error);
            // Aquí puedes mostrar un mensaje de error al usuario
        }
    });

    // Microsoft login button
    const microsoftButton = form.querySelector('button[type="button"]');
    microsoftButton.addEventListener('click', () => {
        // Implementar la lógica de autenticación con Microsoft
        window.location.href = '/auth/microsoft';
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

        // Manejar cambio de tipo de usuario
        const radioButtons = document.querySelectorAll('input[name="tipo_usuario"]');
        const usuarioLabel = document.getElementById('usuario_label');
        const usuarioInput = document.getElementById('usuario');

        function updatePlaceholder(value) {
            if (value === 'estudiante') {
                usuarioLabel.textContent = 'Documento o Usuario';
                usuarioInput.placeholder = 'Ingresa tu documento o usuario';
            } else {
                usuarioLabel.textContent = 'Correo Institucional';
                usuarioInput.placeholder = 'Ingresa tu correo institucional';
            }
        }

        // Inicializar con el valor por defecto
        updatePlaceholder('estudiante');

        // Escuchar cambios en los radio buttons
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                updatePlaceholder(e.target.value);
            });
        });
    });
}); 