// ========================================================
// ===============  GESTIÓN DE PROVEEDORES  ===============
// ========================================================

// ===================== FUNCIONES GENERALES =====================

// Mostrar una sección y ocultar las demás
function mostrarSeccion(seccionId) {
  document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
  document.getElementById(seccionId).style.display = 'block';

  if (seccionId === 'proveedor') {
    document.getElementById('formProveedor').style.display = 'none';
    document.getElementById('mensajeExitoProveedor').style.display = 'none';
    document.getElementById('tablaProveedorContainer').style.display = 'block';
    listarProveedores();
  }

  if (seccionId === 'ordenes') {
    document.getElementById('formOrden').style.display = 'none';
    document.getElementById('mensajeExitoOrden').style.display = 'none';
    document.getElementById('tablaOrdenesContainer').style.display = 'block';
    listarOrdenes();
  }
}

// Volver al panel principal
function volverPanel() {
  document.getElementById("mensajeExitoProveedor").style.display = "none";
  document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
}

// ===================== PROVEEDORES =====================

// Mostrar formulario nuevo PROVEEDOR
function mostrarFormularioProveedor() {
  document.getElementById('proveedorForm').reset();
  document.getElementById('mensajeError').style.display = 'none';
  document.getElementById('formProveedor').style.display = 'block';
  document.getElementById('mensajeExitoProveedor').style.display = 'none';
  document.getElementById('tablaProveedorContainer').style.display = 'none';
}

// Cancelar formulario proveedor
function cancelarProveedor() {
  document.getElementById('proveedorForm').reset();
  document.getElementById('formProveedor').style.display = 'none';
  document.getElementById('mensajeError').style.display = 'none';
  document.getElementById('tablaProveedorContainer').style.display = 'block';
}

// ================== LISTAR PROVEEDORES ==================
async function listarProveedores() {
  try {
    const { data, error } = await supabaseClient
      .from('proveedor')
      .select('*')
      .order('dni_cuil');
    if (error) throw error;

    const tbody = document.querySelector('#tablaProveedor tbody');
    tbody.innerHTML = '';

    data.forEach(proveedor => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${proveedor.dni_cuil}</td>
        <td>${proveedor.nombre}</td>
        <td>${proveedor.tipo_proveedor}</td>
        <td>${proveedor.email}</td>
        <td>${proveedor.telefono}</td>
        <td>${proveedor.pref_cont}</td>
        <td>${proveedor.direccion}</td>
        <td>${proveedor.estado}</td>
        <td>${proveedor.alta_id_emp || "-"}</td>
        <td>
          <button class="btn-editar" onclick="editarProveedor('${proveedor.dni_cuil}')">Editar</button>
          <button class="btn-eliminar" onclick="bajaProveedor('${proveedor.dni_cuil}')">Dar de baja</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error listando proveedores:', err);
  }
}

// ================== VALIDACIONES ==================

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarTelefono(telefono) {
  const regex = /^[0-9]{8,15}$/; // hasta 15 dígitos (permite internacionales)
  return regex.test(telefono);
}

function validarDNI(dni) {
  const regex = /^[0-9]{7,8}$/;
  return regex.test(dni);
}

function validarCUIL(cuil) {
  const regex = /^[0-9]{2}-[0-9]{8}-[0-9]$/;
  return regex.test(cuil);
}

function direccionEsValida(direccion) {
  // validación mínima, se puede mejorar
  return direccion && direccion.length >= 5;
}

function mostrarError(mensaje) {
  const div = document.getElementById('mensajeError');
  if (!div) return alert(mensaje); // fallback
  div.innerText = mensaje;
  div.style.display = 'block';
  setTimeout(() => div.style.display = 'none', 4000);
}

// ================== EVENTOS DINÁMICOS ==================

// Cambiar dinámicamente el label de documento
const tipoProveedorSelect = document.getElementById("tipoProveedor");
const documentoLabel = document.getElementById("labelDocumento");
const documentoInput = document.getElementById("documento");

tipoProveedorSelect.addEventListener("change", () => {
  if (tipoProveedorSelect.value === "monotributista") {
    documentoLabel.innerText = "DNI:";
    documentoInput.placeholder = "Ej: 12345678";
    documentoInput.value = "";
  } else if (tipoProveedorSelect.value === "responsable inscripto") {
    documentoLabel.innerText = "CUIL:";
    documentoInput.placeholder = "Ej: 20-12345678-3";
    documentoInput.value = "";
  } else {
    documentoLabel.innerText = "Documento:";
    documentoInput.placeholder = "Seleccione tipo primero";
    documentoInput.value = "";
  }
});

// Restringir campo teléfono solo a números (y 15 máx)
document.getElementById("telefono").addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 15);
});

// ================== EVENTO SUBMIT ==================
document.getElementById("proveedorForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Tomar valores
  const id_proveedor = document.getElementById("id_proveedor").value;
  const nombre = document.getElementById("nombre").value.trim();
  const tipo_proveedor = document.getElementById("tipoProveedor").value;
  const dni_cuil = document.getElementById("documento").value.trim();
  const pref_cont = document.getElementById("preferenciaContacto").value;
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const estado = document.getElementById("estado").value;

  // ============ VALIDACIONES ============
  if (!nombre) return mostrarError("El nombre es obligatorio");
  if (!tipo_proveedor) return mostrarError("Debe seleccionar el tipo de proveedor");

  if (tipo_proveedor === "monotributista" && !validarDNI(dni_cuil)) {
    return mostrarError("Formato incorrecto de DNI. Ej: 12345678");
  }

  if (tipo_proveedor === "responsable inscripto" && !validarCUIL(dni_cuil)) {
    return mostrarError("Formato incorrecto de CUIL. Ej: 20-12345678-3");
  }

  if (!pref_cont) return mostrarError("Debe seleccionar la preferencia de contacto");
  if (!validarEmail(email)) return mostrarError("El email no tiene un formato válido");
  if (!validarTelefono(telefono)) return mostrarError("Formato incorrecto de teléfono. Solo números (8 a 15 dígitos)");
  if (!direccionEsValida(direccion)) return mostrarError("Debe ingresar una dirección válida");

  try {
    // ============ VERIFICAR DUPLICADOS ============
    const { data: existente } = await supabaseClient
      .from('proveedor')
      .select('id_proveedor')
      .eq('dni_cuil', dni_cuil)
      .maybeSingle();

    if (existente && Number(id_proveedor) !== existente.id_proveedor) {
      throw new Error("Ya existe un proveedor con ese DNI/CUIL");
    }

    // ============ CREAR OBJETO ============
    const nuevoProveedor = {
      nombre,
      tipo_proveedor,
      dni_cuil,
      pref_cont,
      email,
      telefono,
      direccion,
      estado
    };

    // ============ CREAR O EDITAR ============
    if (id_proveedor) {
      const { error } = await supabaseClient
        .from("proveedor")
        .update(nuevoProveedor)
        .eq('id_proveedor', id_proveedor);
      if (error) throw error;
      document.getElementById("textoExitoProveedor").innerText = "Proveedor actualizado con éxito";
    } else {
      const { error } = await supabaseClient
        .from("proveedor")
        .insert([nuevoProveedor]);
      if (error) throw error;
      document.getElementById("textoExitoProveedor").innerText = "Proveedor creado con éxito";
    }

    document.getElementById("formProveedor").style.display = "none";
    document.getElementById("mensajeExitoProveedor").style.display = "block";
    listarProveedores();

  } catch (err) {
    console.error("Error:", err);
    mostrarError(err.message || "Error al procesar el proveedor");
  }
});

// ================== EDITAR PROVEEDOR ==================
async function editarProveedor(dni) {
  try {
    const { data, error } = await supabaseClient
      .from('proveedor')
      .select('*')
      .eq('dni_cuil', dni)
      .single();
    if (error) throw error;

    tipoProveedorSelect.value = data.tipo_proveedor;
    documentoInput.value = data.dni_cuil;

    if (data.tipo_proveedor === "monotributista") {
      documentoLabel.innerText = "DNI:";
      documentoInput.placeholder = "Ej: 12345678";
    } else {
      documentoLabel.innerText = "CUIL:";
      documentoInput.placeholder = "Ej: 20-12345678-3";
    }

    document.getElementById('nombre').value = data.nombre;
    document.getElementById('direccion').value = data.direccion;
    document.getElementById('email').value = data.email;
    document.getElementById('telefono').value = data.telefono;
    document.getElementById('preferenciaContacto').value = data.pref_cont;
    document.getElementById('estado').value = data.estado;
    document.getElementById('id_proveedor').value = data.id_proveedor;

    document.getElementById('formProveedor').style.display = 'block';
    document.getElementById('tablaProveedorContainer').style.display = 'none';
  } catch (err) {
    console.error(err);
    mostrarError('Error al cargar datos del proveedor');
  }
}

// ================== DAR DE BAJA PROVEEDOR ==================
async function bajaProveedor(dni) {
  if (!confirm('¿Desea dar de baja este proveedor?')) return;
  try {
    const { error } = await supabaseClient
      .from('proveedor')
      .update({ estado: 'inactivo' })
      .eq('dni_cuil', dni);
    if (error) throw error;
    listarProveedores();
  } catch (err) {
    console.error(err);
    mostrarError('Error al dar de baja el proveedor');
  }
}
