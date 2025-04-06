document.getElementById("medicationAdministrationForm").addEventListener("submit", async function (event) {
    event.preventDefault();  // Prevenir el envío tradicional del formulario

    const patientId = document.getElementById("patientId").value;
    const medicationCode = document.getElementById("medicationCode").value;
    const medicationDisplay = document.getElementById("medicationDisplay").value;
    const status = document.getElementById("status").value;
    const effectiveDateTime = document.getElementById("effectiveDateTime").value;
    const doseValue = document.getElementById("doseValue").value;
    const route = document.getElementById("route").value;
    const practitionerId = document.getElementById("practitionerId").value;

    const occurrenceDateTime = new Date(effectiveDateTime).toISOString();  // Asegúrate de que esté en formato ISO

    const medicationAdministration = {
        resourceType: "MedicationAdministration",
        status: status,
        medication: { 
            code: {
                coding: [{
                    system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                    code: medicationCode,
                    display: medicationDisplay
                }],
                text: medicationDisplay
            }
        },
        subject: {
            reference: `Patient/${patientId}`
        },
        occurrenceDateTime: occurrenceDateTime,  // Usa el nombre correcto
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

    try {
        const response = await fetch("https://backend-propio-0z5h.onrender.com/medication_administration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(medicationAdministration)
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Registro exitoso:", data);
        } else {
            const errorData = await response.json();
            console.error("Error al registrar:", errorData);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
});
