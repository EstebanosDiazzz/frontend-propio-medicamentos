document.getElementById("medicationAdministrationForm").addEventListener("submit", function (e) {
    e.preventDefault();  // Prevenir el envío del formulario para manejarlo con JavaScript

    // Recolectar los datos del formulario
    const patientId = document.getElementById("patientId").value;
    const medicationCode = document.getElementById("medicationCode").value;
    const medicationDisplay = document.getElementById("medicationDisplay").value;
    const status = document.getElementById("status").value;
    
    // Obtener el valor de effectiveDateTime y asegurarse de que sea válido
    const effectiveDateTime = document.getElementById("effectiveDateTime").value;
    let occurrenceDateTime = null;

    console.log("Fecha de administración recibida:", effectiveDateTime);  // Depuración

    if (effectiveDateTime) {
        // Agregar ":00" al final para incluir los segundos en el formato
        const dateWithSeconds = `${effectiveDateTime}:00`;
        
        // Verificar si la fecha es válida
        const validDate = new Date(dateWithSeconds);
        if (!isNaN(validDate.getTime())) {
            occurrenceDateTime = validDate.toISOString();
        } else {
            console.error("Fecha inválida:", dateWithSeconds);
        }
    } else {
        console.error("Fecha no proporcionada");
    }

    const doseValue = document.getElementById("doseValue").value;
    const route = document.getElementById("route").value;
    const practitionerId = document.getElementById("practitionerId").value;

    // Crear el objeto para enviar al backend
    const medicationAdministrationData = {
        patientId,
        medicationCode,
        medicationDisplay,
        status,
        effectiveDateTime: occurrenceDateTime,  // Usar la fecha con el formato correcto
        doseValue,
        route,
        practitionerId
    };

    // Enviar la solicitud POST al backend
    fetch("https://backend-propio-0z5h.onrender.com/medication_administration", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(medicationAdministrationData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Error en la solicitud");
        }
    })
    .then(data => {
        console.log("Éxito:", data);
    })
    .catch(error => {
        console.error("Error al registrar la administración de medicamento:", error);
    });
});
