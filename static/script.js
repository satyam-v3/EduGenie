document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generateButton');
    const courseTitleInput = document.getElementById('courseTitle');
    const loadingMessage = document.getElementById('loadingMessage');
    const outputContent = document.getElementById('outputContent');
    const copyButton = document.getElementById('copyButton');

    const customAlertModal = document.getElementById('customAlertModal');
    const alertMessage = document.getElementById('alertMessage');
    const closeAlertButton = document.getElementById('closeAlertButton');
    const modalOkButton = document.getElementById('modalOkButton');

    function showAlert(message) {
        alertMessage.textContent = message;
        customAlertModal.style.display = 'block';
    }

    closeAlertButton.addEventListener('click', function () {
        customAlertModal.style.display = 'none';
    });
    modalOkButton.addEventListener('click', function () {
        customAlertModal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === customAlertModal) {
            customAlertModal.style.display = 'none';
        }
    });

    async function generateContent(title) {
        loadingMessage.style.display = 'block';
        outputContent.textContent = 'Generating... Please wait, this might take a moment.';
        copyButton.textContent = 'Copy';

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ course_title: title }),
            });

            const data = await response.json();

            if (response.ok) {
                outputContent.textContent = data.result;
            } else {
                console.error('Error from backend:', data.error);
                outputContent.textContent = `Error: ${data.error || 'Failed to generate content.'}`;
                showAlert(`Error generating content: ${data.error || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Network or fetch error:', error);
            outputContent.textContent = 'Error: Could not connect to the server or a network error occurred.';
            showAlert('Network error: Could not connect to the server. Please ensure the backend is running.');
        } finally {
            loadingMessage.style.display = 'none';
        }
    }

    generateButton.addEventListener('click', function () {
        const title = courseTitleInput.value.trim();
        if (title) {
            generateContent(title);
        } else {
            showAlert("Please enter a course title before generating content.");
        }
    });

    copyButton.addEventListener('click', function () {
        if (outputContent.textContent.trim() === '' || outputContent.textContent.trim() === 'Your generated educational content will appear here. Click "Generate Content" to start.' || outputContent.textContent.startsWith('Generating...')) {
            showAlert("No content to copy yet. Please generate content first.");
            return;
        }

        const range = document.createRange();
        range.selectNode(outputContent);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            } else {
                console.error('Copy command was unsuccessful.');
                copyButton.textContent = 'Failed!';
            }
        } catch (err) {
            console.error('Oops, unable to copy', err);
            copyButton.textContent = 'Error!';
        } finally {
            window.getSelection().removeAllRanges();
        }
    });
});