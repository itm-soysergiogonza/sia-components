// Inicializar todos los tooltips
document.addEventListener('DOMContentLoaded', function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: 'hover focus', // Mostrar en hover y focus
            animation: true, // Animación al mostrar/ocultar
            delay: {
                show: 200, // Retraso antes de mostrar
                hide: 100  // Retraso antes de ocultar
            }
        });
    });

    // Manejar tooltips para opciones del select original
    const petSelect = document.getElementById('petSelect');
    if (petSelect) {
        petSelect.addEventListener('mouseover', function(e) {
            const option = e.target.options[e.target.options.selectedIndex];
            if (option && option.getAttribute('data-bs-toggle') === 'tooltip') {
                const tooltip = bootstrap.Tooltip.getInstance(option);
                if (tooltip) {
                    tooltip.show();
                }
            }
        });

        petSelect.addEventListener('mouseout', function(e) {
            const option = e.target.options[e.target.options.selectedIndex];
            if (option && option.getAttribute('data-bs-toggle') === 'tooltip') {
                const tooltip = bootstrap.Tooltip.getInstance(option);
                if (tooltip) {
                    tooltip.hide();
                }
            }
        });

        petSelect.addEventListener('change', function(e) {
            const option = e.target.options[e.target.options.selectedIndex];
            if (option && option.getAttribute('data-bs-toggle') === 'tooltip') {
                const tooltip = bootstrap.Tooltip.getInstance(option);
                if (tooltip) {
                    tooltip.show();
                }
            }
        });
    }

    // Manejar el select con íconos de ayuda
    const selectWithIcons = document.querySelector('.select-with-icons');
    const hiddenSelect = document.getElementById('petSelectWithIcons');
    
    if (selectWithIcons && hiddenSelect) {
        const optionRows = selectWithIcons.querySelectorAll('.option-row');
        
        // Manejar la selección de opciones
        optionRows.forEach((row, index) => {
            row.addEventListener('click', () => {
                // Remover la clase selected de todas las filas
                optionRows.forEach(r => r.classList.remove('selected'));
                // Agregar la clase selected a la fila clickeada
                row.classList.add('selected');
                // Actualizar el select oculto
                hiddenSelect.selectedIndex = index;
                // Disparar evento change
                const event = new Event('change');
                hiddenSelect.dispatchEvent(event);
            });
        });

        // Sincronizar el estado inicial
        const updateSelectedRow = () => {
            optionRows.forEach((row, index) => {
                if (index === hiddenSelect.selectedIndex) {
                    row.classList.add('selected');
                } else {
                    row.classList.remove('selected');
                }
            });
        };

        // Manejar cambios en el select oculto
        hiddenSelect.addEventListener('change', updateSelectedRow);
        
        // Estado inicial
        updateSelectedRow();
    }
}); 