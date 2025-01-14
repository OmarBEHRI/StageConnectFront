import axiosInstance from '@/axiosInstance/axiosInstance';

async function uploadAttestation(stageId) {
    // Create a form container
    const formContainer = document.createElement('div');
    formContainer.style.position = 'fixed';
    formContainer.style.top = '50%';
    formContainer.style.left = '50%';
    formContainer.style.transform = 'translate(-50%, -50%)';
    formContainer.style.backgroundColor = '#ffffff';
    formContainer.style.padding = '20px';
    formContainer.style.borderRadius = '8px';
    formContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    formContainer.style.zIndex = '1000';
    formContainer.style.width = '300px';
    formContainer.style.textAlign = 'center';

    // Create a label
    const label = document.createElement('label');
    label.textContent = 'Téléverser l\'Attestation de Stage (PDF, max 4 Go)';
    label.style.display = 'block';
    label.style.marginBottom = '16px';
    label.style.fontSize = '14px';
    label.style.color = '#333333';

    // Create a file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.style.display = 'none';

    // Create a submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Soumettre';
    submitButton.style.marginTop = '16px';
    submitButton.style.padding = '8px 16px';
    submitButton.style.backgroundColor = '#333333';
    submitButton.style.color = '#ffffff';
    submitButton.style.border = 'none';
    submitButton.style.borderRadius = '4px';
    submitButton.style.cursor = 'pointer';
    submitButton.disabled = true; // Disabled by default until a file is selected

    // Create an error message container
    const errorMessage = document.createElement('div');
    errorMessage.style.color = '#ff0000';
    errorMessage.style.fontSize = '12px';
    errorMessage.style.marginTop = '8px';
    errorMessage.style.display = 'none';

    // Create a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Fermer';
    closeButton.style.marginTop = '8px';
    closeButton.style.padding = '8px 16px';
    closeButton.style.backgroundColor = '#cccccc';
    closeButton.style.color = '#333333';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';

    // Append elements to the form container
    formContainer.appendChild(label);
    formContainer.appendChild(input);
    formContainer.appendChild(submitButton);
    formContainer.appendChild(errorMessage);
    formContainer.appendChild(closeButton);

    // Add the form container to the document body
    document.body.appendChild(formContainer);

    // Trigger file input when the label is clicked
    label.onclick = () => input.click();

    // Handle file selection
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size (max 4 GB)
            if (file.size > 4294967296) {
                errorMessage.textContent = 'La taille du fichier dépasse la limite de 4 Go.';
                errorMessage.style.display = 'block';
                submitButton.disabled = true; // Disable submit button if file is too large
            } else {
                errorMessage.style.display = 'none';
                submitButton.disabled = false; // Enable submit button if file is valid
            }
        }
    };

    // Handle form submission
    submitButton.onclick = async () => {
        const file = input.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axiosInstance.post(`/stages/${stageId}/attestation`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    // Success message
                    errorMessage.textContent = 'Attestation de stage téléversée avec succès.';
                    errorMessage.style.color = '#00aa00';
                    errorMessage.style.display = 'block';
                } else {
                    errorMessage.textContent = 'Erreur lors du téléversement de l\'attestation de stage.';
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Erreur:', error);
                errorMessage.textContent = 'Erreur lors du téléversement de l\'attestation de stage.';
                errorMessage.style.display = 'block';
            }
        }
    };

    // Close the form when the close button is clicked
    closeButton.onclick = () => {
        document.body.removeChild(formContainer);
    };
}