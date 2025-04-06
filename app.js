document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('medicationAdministrationForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const patientId = document.getElementById('patientId').value;
        const medicationCode = document.getElementById('medicationCode').value;
        const medicationDisplay = document.getElementById('medicationDisplay').value;
        const status = document.getElementById('status').value; 
        const effectiveDateTime = document.getElementById('effectiveDateTime').value;  // Asegúrate de tener el campo correcto
        const doseValue = parseFloat(document.getElementById('doseValue').value);
        const route = document.getElementById('route').value;
        const practitionerId = document.getElementById('practitionerId').value;

        // Crear el objeto MedicationAdministration en formato FHIR
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
            occurrenceDateTime: effectiveDateTime,  // Asegúrate de enviar esto como "occurrenceDateTime"
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

        // Enviar los datos al backend
        fetch('https://backend-propio-0z5h.onrender.com/medication_administration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(medicationAdministration)
        })
        .then(response => response.json())
        .then(data => {
            if (data._id) {
                alert('¡Medicación registrada correctamente!');
            } else {
                alert('Error al registrar la medicación.');
            }
        })
        .catch(error => {
            console.error('Error al registrar la medicación:', error);
            alert('Hubo un problema al registrar la medicación.');
        });
    });
});
