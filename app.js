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

    // 2) Convertir fecha a ISO (añadiendo segundos y Z)
    let occurrenceDateTime = null;
    if (rawDate) {
      const dateWithSeconds = rawDate + ":00Z";              // "YYYY-MM-DDTHH:mm:00Z"
      const d = new Date(dateWithSeconds);
      if (!isNaN(d)) occurrenceDateTime = d.toISOString();
      else {
        alert("Fecha inválida");
        return;
      }
    } else {
      alert("Fecha requerida");
      return;
    }

    // 3) Construir recurso FHIR válido
    const medAdmin = {
      resourceType: "MedicationAdministration",
      status: status,
      medicationCodeableConcept: {
        coding: [{
          system: "http://www.nlm.nih.gov/research/umls/rxnorm",
          code: medicationCode,
          display: medicationDisplay
        }],
        text: medicationDisplay
      },
      subject: {
        reference: `Patient/${patientId}`
      },
      occurrenceDateTime: occurrenceDateTime,
      performer: [{
        actor: {
          reference: `Practitioner/${practitionerId}`
        }
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
