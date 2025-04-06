document.getElementById('medicationAdministrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const patientId = document.getElementById('patientId').value;
    const medicationCode = document.getElementById('medicationCode').value;
    const medicationDisplay = document.getElementById('medicationDisplay').value;
    const status = document.getElementById('status').value;
    const effectiveDateTime = document.getElementById('effectiveDateTime').value;
    const doseValue = parseFloat(document.getElementById('doseValue').value);
    const route = document.getElementById('route').value;
    const practitionerId = document.getElementById('practitionerId').value;

    // Crear el objeto MedicationAdministration en formato FHIR
    const medicationAdministration = {
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
        effectiveDateTime: effectiveDateTime,
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

    // Enviar los datos usando Fetch API
    fetch('https://backend-propio-6d0z.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/fhir+json'
        },
        body: JSON.stringify(medicationAdministration)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Éxito:', data);
        alert('Administración de medicamento registrada exitosamente.');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al registrar la administración del medicamento.');
    });
});
