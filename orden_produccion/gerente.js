const tablaBody = document.querySelector('#tablaOP tbody');
let ops = [
    {id:1, producto:'Mermelada', cantidad:100, materiaPrima:'Frutilla', estado:'Pendiente'},
    {id:2, producto:'Jugo', cantidad:50, materiaPrima:'Naranja', estado:'Pendiente'}
];

function mostrarSeccion(id){
    document.querySelectorAll('.seccion').forEach(s=>s.classList.remove('activa'));
    document.getElementById(id).classList.add('activa');
}

function actualizarTabla(){
    tablaBody.innerHTML='';
    ops.forEach(op=>{
        const row = document.createElement('tr');
        let acciones = op.estado==='Pendiente'?`<button class="aprobar" onclick="aprobarOP(${op.id})">Aprobar</button> <button class="rechazar" onclick="rechazarOP(${op.id})">Rechazar</button>`:'';
        row.innerHTML=`<td>${op.id}</td><td>${op.producto}</td><td>${op.cantidad}</td><td>${op.materiaPrima}</td><td>${op.estado}</td><td>${acciones}</td>`;
        tablaBody.appendChild(row);
    });
}

function aprobarOP(id){
    const op = ops.find(o=>o.id===id);
    if(op) op.estado='Aprobada';
    actualizarTabla();
}

function rechazarOP(id){
    const op = ops.find(o=>o.id===id);
    if(op) op.estado='Rechazada';
    actualizarTabla();
}

actualizarTabla();
