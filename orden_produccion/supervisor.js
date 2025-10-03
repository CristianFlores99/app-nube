let secciones = document.querySelectorAll('.seccion');
let tablaBody = document.querySelector('#tablaOP tbody');
let ops = [];
let opId = 1;

const recetas = {
  "Patitas congeladas":[{nombre:"Pollo",cantidad:2,unidad:"kg"},{nombre:"Harina",cantidad:0.2,unidad:"kg"},{nombre:"Bolsa plástica",cantidad:1,unidad:"und"}],
  "Alitas congeladas":[{nombre:"Pollo",cantidad:1.5,unidad:"kg"},{nombre:"Sal",cantidad:0.05,unidad:"kg"},{nombre:"Bolsa plástica",cantidad:1,unidad:"und"}]
};

document.addEventListener('DOMContentLoaded',()=>{
  const fechaHoy = new Date().toISOString().split('T')[0];
  document.getElementById('fechaCreacion').value = fechaHoy;
  agregarProducto();
});

function mostrarSeccion(id){
  secciones.forEach(s=>s.classList.remove('activa'));
  document.getElementById(id).classList.add('activa');
}

function agregarProducto(){
  const container = document.getElementById('productosContainer');
  const div = document.createElement('div');
  div.className = 'producto-item';
  let options = '<option value="">--Seleccione producto--</option>';
  Object.keys(recetas).forEach(p=>options+=`<option value="${p}">${p}</option>`);
  div.innerHTML = `
    <h4>Producto</h4>
    <select name="productoNombre[]" required onchange="actualizarMP(this)">${options}</select>
    <input type="number" name="productoCantidad[]" min="1" value="1" required oninput="actualizarMP(this)">
    <select name="productoUnidad[]"><option value="Lote">Lote</option></select>
    <button type="button" onclick="eliminarProducto(this)">❌ Eliminar Producto</button>
    <div class="mp-container">
      <h5>MP Requeridas (calculadas):</h5>
      <div class="mp-list"></div>
    </div>
  `;
  container.appendChild(div);
}

function eliminarProducto(btn){
  btn.parentElement.remove();
  if(document.querySelectorAll('.producto-item').length===0) agregarProducto();
}

function actualizarMP(select){
  const div = select.parentElement;
  const producto = div.querySelector('select').value;
  const cantidad = parseFloat(div.querySelector('input').value)||1;
  const mpDiv = div.querySelector('.mp-list');
  mpDiv.innerHTML='';
  if(recetas[producto]){
    recetas[producto].forEach(mp=>{
      const total = mp.cantidad * cantidad;
      const item = document.createElement('div');
      item.textContent = `${mp.nombre}: ${total} ${mp.unidad}`;
      mpDiv.appendChild(item);
    });
  }
}

document.getElementById('opForm').addEventListener('submit', e=>{
  e.preventDefault();
  const productos = document.querySelectorAll('select[name="productoNombre[]"]');
  const cantidades = document.querySelectorAll('input[name="productoCantidad[]"]');
  productos.forEach((p,i)=>{
    const nombre = p.value;
    const cantidad = cantidades[i].value;
    ops.push({id:opId++, producto:nombre, cantidad, materiaPrima: JSON.stringify(recetas[nombre]||[]), estado:'Pendiente'});
  });
  actualizarTabla();
  cancelarOP();
});

function cancelarOP(){
  document.getElementById('opForm').reset();
  document.getElementById('productosContainer').innerHTML='';
  agregarProducto();
  mostrarSeccion('ordenProduccion');
}

function actualizarTabla(){
  tablaBody.innerHTML='';
  ops.forEach(op=>{
    const row=document.createElement('tr');
    row.innerHTML=`<td>${op.id}</td><td>${op.producto}</td><td>${op.cantidad}</td><td>${op.materiaPrima}</td><td>${op.estado}</td>`;
    tablaBody.appendChild(row);
  });
}
