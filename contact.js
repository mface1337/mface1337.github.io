// Obfuscate email display
document.getElementById('email-display').textContent = 'mecktech@gmail.com';

const terminalBuffer = document.getElementById('terminal-buffer');
const terminalInput = document.getElementById('terminal-input');
const kaliTerminal = document.getElementById('kali-terminal');
let step = 1; // 1: email, 2: message, 3: confirm
let userEmail = '';
let userMessage = '';
let lastSubmissionTime = 0; // Initialize to 0 for first submission
const RATE_LIMIT_MS = 30000; // 30 seconds

// Sanitization and validation functions
function sanitizeInput(input) {
    // Remove HTML tags, scripts, and dangerous characters, but preserve valid email characters
    return input.replace(/[<>{}]/g, '') // Remove HTML-like characters
               .replace(/(\r\n|\n|\r)/gm, ' ') // Replace newlines with spaces
               .replace(/\s+/g, ' ').trim(); // Normalize spaces
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function appendToBuffer(text) {
    const p = document.createElement('p');
    p.textContent = text;
    terminalBuffer.appendChild(p);
    kaliTerminal.scrollTop = kaliTerminal.scrollHeight;
}

terminalInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const inputValue = terminalInput.value.trim();
        if (inputValue === '') return;

        const sanitizedInput = sanitizeInput(inputValue);
        if (sanitizedInput.length > 500) {
            appendToBuffer('kali@kali:~$ Error: Input too long (max 500 characters).');
            terminalInput.value = '';
            return;
        }

        if (step === 1) {
            // Step 1: Collect email
            if (!validateEmail(sanitizedInput)) {
                appendToBuffer('kali@kali:~$ Error: Invalid email format.');
                appendToBuffer('kali@kali:~$ Enter your email >');
                terminalInput.value = '';
                return;
            }
            userEmail = sanitizedInput;
            appendToBuffer(`kali@kali:~$ Enter your email > ${userEmail}`);
            appendToBuffer('kali@kali:~$ Enter your message >');
            step = 2;
        } else if (step === 2) {
            // Step 2: Collect message
            userMessage = sanitizedInput;
            appendToBuffer(`kali@kali:~$ Enter your message > ${userMessage}`);
            appendToBuffer('kali@kali:~$ Send message? [y/n] >');
            step = 3;
        } else if (step === 3) {
            // Step 3: Confirm and send
            appendToBuffer(`kali@kali:~$ Send message? [y/n] > ${sanitizedInput}`);
            if (sanitizedInput.toLowerCase() === 'y') {
                appendToBuffer('kali@kali:~$ Sending encrypted payload...');
                sendEmail();
            } else {
                appendToBuffer('kali@kali:~$ Transmission aborted.');
                appendToBuffer('kali@kali:~$ Enter your email >');
                step = 1;
            }
        }
        terminalInput.value = '';
    }
});

function sendEmail() {
    const now = Date.now();
    if (now - lastSubmissionTime < RATE_LIMIT_MS) {
        const remainingSeconds = Math.ceil((RATE_LIMIT_MS - (now - lastSubmissionTime)) / 1000);
        appendToBuffer(`kali@kali:~$ Error: Rate limit exceeded. Try again in ${remainingSeconds} seconds.`);
        appendToBuffer('kali@kali:~$ Enter your email >');
        step = 1;
        return;
    }

    const formData = new FormData();
    formData.append('email', 'mecktech@gmail.com'); // Recipient
    formData.append('sender', userEmail); // Sender's email
    formData.append('message', userMessage); // Message

    fetch('https://formspree.io/f/mzzezbzl', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            lastSubmissionTime = now; // Update last submission time
            appendToBuffer('kali@kali:~$ Payload delivered successfully!');
            appendToBuffer('kali@kali:~$ Enter your email >');
            step = 1;
        } else {
            appendToBuffer('kali@kali:~$ Error: Transmission failed. Status: ' + response.status);
            appendToBuffer('kali@kali:~$ Enter your email >');
            step = 1;
            console.error('Formspree Response:', response.status, response.statusText);
        }
    })
    .catch(error => {
        appendToBuffer(`kali@kali:~$ Error: ${error.message}`);
        appendToBuffer('kali@kali:~$ Enter your email >');
        step = 1;
        console.error('Formspree Error:', error);
    });
}

// Easter egg: Hidden command
document.addEventListener('keydown', (event) => {
    if (event.key === 'w' && event.ctrlKey) {
        appendToBuffer('kali@kali:~$ whoami');
        appendToBuffer('kali@kali:~$ Identity: EliteHacker1337');
    }
});

// Ensure expandable images work (if any)
document.querySelectorAll('.expandable').forEach(img => {
    img.addEventListener('click', () => {
        img.classList.toggle('expanded');
    });
});