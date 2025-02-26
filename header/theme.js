document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const themeOptions = document.querySelectorAll('.theme-option');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const themeDropdownButton = document.getElementById('themeDropdownButton');
    const themeDropdown = document.getElementById('themeDropdown');
    
    // Recuperar el tema guardado en localStorage o usar el tema del sistema por defecto
    const savedTheme = localStorage.getItem('theme') || 'system';
    
    // Toggle del dropdown
    themeDropdownButton.addEventListener('click', function() {
        themeDropdown.classList.toggle('hidden');
    });
    
    // Cerrar dropdown al hacer clic afuera
    document.addEventListener('click', function(event) {
        if (!themeDropdownButton.contains(event.target) && !themeDropdown.contains(event.target)) {
            themeDropdown.classList.add('hidden');
        }
    });
    
    // Función para aplicar tema según la preferencia
    function applyTheme(theme) {
        // Verificar preferencia del sistema
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Limpiar clases de tema
        document.body.classList.remove('dark');
        
        // Aplicar tema
        if (theme === 'dark' || (theme === 'system' && prefersDarkScheme)) {
            document.body.classList.add('dark');
        }
        
        // Actualizar el atributo data-theme para referencia
        document.body.setAttribute('data-theme', theme);
        
        // Marcar opción activa con estilo
        themeOptions.forEach(option => {
            const isActive = option.getAttribute('data-theme') === theme;
            
            // Remover estilos activos de todas las opciones
            option.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'font-medium');
            
            // Aplicar estilo activo si corresponde
            if (isActive) {
                option.classList.add('bg-gray-100', 'dark:bg-gray-700', 'font-medium');
            }
        });
        
        // Actualizar icono y texto del selector
        updateThemeDisplay(theme);
        
        // Guardar preferencia en localStorage
        localStorage.setItem('theme', theme);
    }
    
    // Función para actualizar visualización del selector
    function updateThemeDisplay(theme) {
        // Actualizar icono
        themeIcon.className = ''; // Limpiar clases
        themeIcon.classList.add('fas');
        
        // Ajustar según tema
        switch(theme) {
            case 'light':
                themeIcon.classList.add('fa-sun');
                themeText.textContent = 'Claro';
                break;
            case 'dark':
                themeIcon.classList.add('fa-moon');
                themeText.textContent = 'Oscuro';
                break;
            case 'system':
                themeIcon.classList.add('fa-laptop');
                themeText.textContent = 'Sistema';
                break;
        }
    }
    
    // Aplicar tema guardado al cargar
    applyTheme(savedTheme);
    
    // Escuchar cambios en las opciones de tema
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedTheme = this.getAttribute('data-theme');
            applyTheme(selectedTheme);
            themeDropdown.classList.add('hidden'); // Ocultar dropdown al seleccionar
        });
    });
    
    // Escuchar cambios en el tema del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
        if(localStorage.getItem('theme') === 'system') {
            applyTheme('system');
        }
    });
}); 