// Array donde guardo las tareas

const agregarBoton = document.getElementById('boton-agregar');
const nombreTareaInput = document.getElementById('nombre-tarea');
let tareas = [];
// Agregar tarea DOM + LocalStorage

guardarTareasEnLocalStorage = () => {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

if (agregarBoton) {
    agregarBoton.addEventListener('click', () => {
        if (nombreTareaInput.value.trim() === '') return;
        const tarea = {
            id: Date.now(),
            nombre: nombreTareaInput.value.trim(),
            completada: false,
        };
        tareas.push(tarea);
        guardarTareasEnLocalStorage();
        crearTareaEnDOM(tarea);
        nombreTareaInput.value = '';
    });
} else {
    console.error('No se encontró el botón de agregar (`boton-agregar`) en el DOM.');
}

function crearTareaEnDOM(tarea) {
    const li = document.createElement('li');
    li.dataset.id = tarea.id;
    li.innerHTML =  `
        <label style="${tarea.completada ? 'text-decoration: line-through; color: gray;' : ''}">
            ${tarea.nombre}
        </label>
        <button class="boton-completar">Completar</button>
        <button class="boton-eliminar">Eliminar</button>
    `;
    document.querySelector('.contenedor-tareas ul').appendChild(li);
}

// Cargar tareas desde LocalStorage al iniciar la página

document.addEventListener('DOMContentLoaded', () => {
    const tareasGuardadas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas = tareasGuardadas;
    tareasGuardadas.forEach(tarea => crearTareaEnDOM(tarea));
});

// eliminar tarea DOM + LocalStorage

document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target) return;

    if (target.classList.contains('boton-eliminar')) {
        const tareaAEliminar = target.closest('li');
        if (!tareaAEliminar) return;
        const tareaId = Number(tareaAEliminar.dataset.id);
        tareas = tareas.filter(tarea => tarea.id !== tareaId);
        guardarTareasEnLocalStorage();
        tareaAEliminar.remove();
    }

    if (target.classList.contains('boton-completar')) {
        const li = target.closest('li');
        if (!li) return;
        const tareaId = Number(li.dataset.id);
        const tarea = tareas.find(t => t.id === tareaId);
        if (!tarea) return;
        tarea.completada = !tarea.completada;
        const label = li.querySelector('label');
        if (label) {
            if (tarea.completada) {
                label.style.textDecoration = 'line-through';
                label.style.color = 'gray';
            } else {
                label.style.textDecoration = '';
                label.style.color = '';
            }
        }
        guardarTareasEnLocalStorage();
    }
});