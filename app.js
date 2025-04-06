document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("medicationAdministrationForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1) Leer valores del formulario
    const patientId        = document.getElementById("patientId").value;
    const medicationCode   = document.getElementById("medicationCode").value;
    const medicationDisplay= document.getElementById("medicationDisplay").value;
    const status           = document.getElementById("status").value;
    const rawDate          = document.getElementById("effectiveDateTime").value; // "YYYY-MM-DDTHH:mm"
    const doseValue        = parseFloat(document.getElementById("doseValue").value);
    const route            = document.getElementById("route").value;
    const routeDisplay     = document.querySelector(`#route option[value="${route}"]`).textContent;
    const practitionerId   = document.getElementById("practitionerId").value;

    // 2) Convertir fecha a ISO completo
    if (!rawDate) {
      return alert("Debes indicar fecha y hora.");
    }
    const isoDate = new Date(rawDate + ":00Z").toISOString(); // Añade segundos y Z
    if (isNaN(Date.parse(isoDate))) {
      return alert("Formato de fecha inválido.");
    }

    // 3) Construir recurso FHIR
    const medAdmin = {
      resourceType: "MedicationAdministration",
      status: status,
      subject: { reference: `Patient/${patientId}` },
      medication: {
        concept: {
          coding: [{
            system: "http://www.nlm.nih.gov/research/umls/rxnorm",
            code: medicationCode,
            display: medicationDisplay
          }],
          text: medicationDisplay
        }
      },
      occurenceDateTime: isoDate,   // Campo con typo que el backend valida
      performer: [{
        actor: { reference: `Practitioner/${practitionerId}` }  // Asegúrate de que esto sea un string correcto
      }],
      dosage: {
        route: {
          coding: [{
            system: "http://terminology.hl7.org/CodeSystem/v3-RouteOfAdministration",
            code: route,
            display: routeDisplay
          }]
        },
        dose: {
          value: doseValue,
          unit: "mg",
          system: "http://unitsofmeasure.org",
          code: "mg"
        }
      }
    };

    // 4) Enviar al backend
    try {
      const res = await fetch(
        "https://backend-propio-0z5h.onrender.com/medication_administration",
        {
          method: "POST",
          headers: { "Content-Type": "application/fhir+json" },
          body: JSON.stringify(medAdmin),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Administración registrada con ID: " + data._id);
      } else {
        alert("Error: " + (data.detail || res.status));
      }
    } catch (err) {
      console.error(err);
      alert("No se pudo conectar con el servidor.");
    }
  });
});
