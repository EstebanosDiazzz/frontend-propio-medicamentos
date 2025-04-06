document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("medicationAdministrationForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1) Obtener valores del formulario
    const patientId       = document.getElementById("patientId").value;
    const medicationCode  = document.getElementById("medicationCode").value;
    const medicationDisplay = document.getElementById("medicationDisplay").value;
    const status          = document.getElementById("status").value;
    const rawDate         = document.getElementById("effectiveDateTime").value; // "YYYY-MM-DDTHH:mm"
    const doseValue       = parseFloat(document.getElementById("doseValue").value);
    const route           = document.getElementById("route").value;
    const practitionerId  = document.getElementById("practitionerId").value;

    // 2) Convertir a ISO y corregir typo de la librería (un solo 'r')
    let occurrenceDateTime = null;
    if (rawDate) {
      // Añadimos segundos y Z para UTC
      const iso = new Date(rawDate + ":00Z").toISOString();
      occurrenceDateTime = iso;
    }

    // 3) Construir recurso FHIR
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
      // Nota: la librería está esperando 'occurenceDateTime' (sin doble 'r')
      occurenceDateTime: occurrenceDateTime,
      performer: [{
        actor: {
          reference: `Practitioner/${practitionerId}`
        }
      }],
      dosage: {
        text: `${doseValue} mg vía ${route}`,
        route: {
          coding: [{
            system: "http://terminology.hl7.org/CodeSystem/v3-RouteOfAdministration",
            code: route,
            display: document.querySelector(`#route option[value="${route}"]`).textContent
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
        console.error("Backend respondió error:", data);
        alert("Error al registrar: " + data.detail);
      }
    } catch (err) {
      console.error("Fetch falló:", err);
      alert("No se pudo conectar con el backend.");
    }
  });
});
