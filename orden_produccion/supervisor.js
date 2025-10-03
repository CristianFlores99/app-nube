const secciones = document.querySelectorAll('.seccion');
const tablaBody = document.querySelector('#tablaOP tbody');
let opId = 1;
let ops = [];

document.getElementById('formOP').addEventListener('submit', e=>{
    e.preventDefault();
    const producto = document.getElementById('producto').value;
    const cantidad = document.getElementById('cantidad').value;
    const materiaPrima = document.getElementById('materiaPrima').value;

    const op = { id:opId++, producto, cantidad, materiaPrima, estado:'Pendiente' };
    ops.push(op);
    actualizarTabla();
    e.target.reset();
});

function mostrarSeccion(id){
    secciones.forEach(s=>s.classList.remove('activa'));
    document.getElementById(id).classList.add('activa');
}

function actualizarTabla(){
    tablaBody.innerHTML='';
    ops.forEach(op=>{
        const row = document.createElement('tr');
        row.innerHTML=`<td>${op.id}</td><td>${op.producto}</td><td>${op.cantidad}</td><td>${op.materiaPrima}</td><td>${op.estado}</td>`;
        tablaBody.appendChild(row);
    });
}
