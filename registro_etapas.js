// === FUNCIONALIDAD GENERAL DEL SPA ===

// Oculta todas las secciones y muestra solo la seleccionada
function mostrarSeccion(idSeccion) {
  // Ocultar todas las secciones
  const secciones = document.querySelectorAll(".seccion");
  secciones.forEach(sec => sec.style.display = "none");

  // Mostrar la sección elegida
  const seccion = document.getElementById(idSeccion);
  if (seccion) {
    seccion.style.display = "block";
  }

  // Si se muestra el registro de etapas, cargar ejemplos
  if (idSeccion === "registroEtapas") {
    cargarEjemplosRegistro();
  }
}



// === CARGA DE ÓRDENES APROBADAS ===
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

async function cargarOrdenesAprobadas() {
  try {
    const { data, error } = await supabaseClient
      .from("orden_produccion")
      .select("numero_op, producto, estado, fecha_emision, motivo")
      .eq("estado", "Aprobada");

    if (error) throw error;

    // Mostrar los datos en la tabla
    const tbody = document.querySelector("#registroTable tbody");
    tbody.innerHTML = ""; // limpiar contenido previo

    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8">No hay órdenes aprobadas.</td></tr>`;
      return;
    }

    data.forEach(op => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${op.numero_op}</td>
        <td>-</td> <!-- Etapa (se elige luego) -->
        <td>-</td> <!-- Operario -->
        <td>${op.fecha_emision || '-'}</td>
        <td>-</td> <!-- Fecha fin -->
        <td>${op.estado}</td>
        <td>${op.motivo || '-'}</td>
        <td><button onclick="seleccionarOP('${op.numero_op}')">Seleccionar</button></td>
      `;
      tbody.appendChild(fila);
    });

  } catch (error) {
    console.error("Error al cargar órdenes aprobadas:", error);
    const tbody = document.querySelector("#registroTable tbody");
    tbody.innerHTML = `<tr><td colspan="8" style="color:red;">Error al cargar datos</td></tr>`;
  }
}



// === OPCIONAL: FUNCIONALIDAD PARA EL BOTÓN "Seleccionar" ===
function seleccionarOP(numero_op) {
  alert(`Orden seleccionada: ${numero_op}`);
  // acá podrías precargar esa OP en el formulario, por ejemplo:
  document.getElementById("opSelect").value = numero_op;
}