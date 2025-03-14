// Obfuscate email display
document.getElementById('email-display').textContent = 'mecktech@gmail.com';

const terminalBuffer = document.getElementById('terminal-buffer');
const terminalInput = document.getElementById('terminal-input');
const kaliTerminal = document.getElementById('kali-terminal');
const promptElement = document.querySelector('.prompt'); // Select the prompt span
let step = 1; // 1: email, 2: message, 3: confirm
let userEmail = '';
let userMessage = '';
let lastSubmissionTime = 0; // Initialize to 0 for first submission
const RATE_LIMIT_MS = 30000; // 30 seconds
let isRoot = false; // Track if user has escalated to root
let expectingPassword = false; // Track if waiting for sudo password

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

function updatePrompt() {
    const username = isRoot ? 'root@kali' : 'kali@kali';
    promptElement.textContent = `${username}:~$ `;
}

function clearTerminal() {
    while (terminalBuffer.firstChild) {
        terminalBuffer.removeChild(terminalBuffer.firstChild);
    }
    isRoot = false; // Reset root status
    expectingPassword = false; // Reset password expectation
    updatePrompt(); // Reset prompt to kali@kali
    appendToBuffer(`${promptElement.textContent} Enter your email >`);
    step = 1;
    userEmail = '';
    userMessage = '';
}

// Fetch user's IP address using geo.ipify.org API with API key
async function getIPAddress() {
    try {
        const apiKey = 'at_Mu5GGmXo9PuV4x6J0dohJUr2TP10X'; // Your API key
        const response = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=${apiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.ip || 'No IP available'; // Extract IP from response
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return 'Unable to retrieve IP address'; // Fallback message
    }
}

terminalInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const inputValue = terminalInput.value.trim();
        if (inputValue === '') return;

        const sanitizedInput = sanitizeInput(inputValue);
        if (sanitizedInput.length > 500) {
            appendToBuffer(`${promptElement.textContent} Error: Input too long (max 500 characters).`);
            terminalInput.value = '';
            return;
        }

        // Check for clear command
        if (sanitizedInput.toLowerCase() === 'clear') {
            clearTerminal();
            terminalInput.value = '';
            return;
        }

        // Check for sudo su password prompt
        if (expectingPassword) {
            appendToBuffer(`[sudo] password for kali: ${sanitizedInput}`);
            if (sanitizedInput.toLowerCase() === 'kali') {
                isRoot = true;
                updatePrompt();
                appendToBuffer(`${promptElement.textContent} Enter your email >`);
                step = 1;
            } else {
                appendToBuffer(`${promptElement.textContent} Sorry, try again.`);
                appendToBuffer(`${promptElement.textContent} Enter your email >`);
                step = 1;
            }
            expectingPassword = false;
            terminalInput.value = '';
            return;
        }

        // Check for Easter eggs
        const command = sanitizedInput.toLowerCase();
        if (command === 'whoami') {
            appendToBuffer(`${promptElement.textContent} whoami`);
            appendToBuffer(`${promptElement.textContent} Identity: EliteHacker1337`);
            appendToBuffer(`${promptElement.textContent} Enter your email >`);
            step = 1;
            terminalInput.value = '';
            return;
        }

        if (command === 'sudo su') {
            appendToBuffer(`${promptElement.textContent} sudo su`);
            appendToBuffer('[sudo] password for kali:');
            expectingPassword = true;
            terminalInput.value = '';
            return;
        }

        if (command === 'iwconfig' || command === 'ifconfig') {
            appendToBuffer(`${promptElement.textContent} ${command}`);
            const ipAddress = await getIPAddress();
            appendToBuffer(`${promptElement.textContent} eth0: inet ${ipAddress}  netmask 255.255.255.0`);
            appendToBuffer(`${promptElement.textContent} Enter your email >`);
            step = 1;
            terminalInput.value = '';
            return;
        }

        if (command === 'nmap') {
            appendToBuffer(`${promptElement.textContent} nmap`);
            appendToBuffer(`${promptElement.textContent} Starting Nmap 7.91 ( https://nmap.org )`);
            appendToBuffer(`${promptElement.textContent} Nmap scan report for localhost (127.0.0.1)`);
            appendToBuffer(`${promptElement.textContent} PORT   STATE SERVICE`);
            appendToBuffer(`${promptElement.textContent} 22/tcp open  ssh`);
            appendToBuffer(`${promptElement.textContent} 80/tcp open  http`);
            appendToBuffer(`${promptElement.textContent} Nmap done: 1 IP address (1 host up)`);
            appendToBuffer(`${promptElement.textContent} Enter your email >`);
            step = 1;
            terminalInput.value = '';
            return;
        }

        if (command === 'metasploit') {
            appendToBuffer(`${promptElement.textContent} metasploit`);
            appendToBuffer(`${promptElement.textContent} [*] Starting the Metasploit Framework console...`);
            appendToBuffer(`${promptElement.textContent} =[ metasploit v6.0.1-dev ]`);
            appendToBuffer(`${promptElement.textContent} + -- --=[ 2000 exploits - 1100 auxiliary - 350 post ]`);
            appendToBuffer(`${promptElement.textContent} msf6 > Ready to exploit! (Not really, this is a demo)`);
            appendToBuffer(`${promptElement.textContent} Enter your email >`);
            step = 1;
            terminalInput.value = '';
            return;
        }

        if (command === 'aircrack-ng') {
            appendToBuffer(`${promptElement.textContent} aircrack-ng`);
            appendToBuffer(`${promptElement.textContent} Aircrack-ng 1.6`);
            appendToBuffer(`${promptElement.textContent} [00:00:01] Captured 1337 packets`);
            appendToBuffer(`${promptElement.textContent} Cracking WPA2 key... (Just kidding!)`);
            appendToBuffer(`${promptElement.textContent} Enter your email >`);
            step = 1;
            terminalInput.value = '';
            return;
        }

        // Proceed with email submission form logic
        if (step === 1) {
            // Step 1: Collect email
            if (!validateEmail(sanitizedInput)) {
                appendToBuffer(`${promptElement.textContent} Error: Invalid email format.`);
                appendToBuffer(`${promptElement.textContent} Enter your email >`);
                terminalInput.value = '';
                return;
            }
            userEmail = sanitizedInput;
            appendToBuffer(`${promptElement.textContent} Enter your email > ${userEmail}`);
            appendToBuffer(`${promptElement.textContent} Enter your message >`);
            step = 2;
        } else if (step === 2) {
            // Step 2: Collect message
            userMessage = sanitizedInput;
            appendToBuffer(`${promptElement.textContent} Enter your message > ${userMessage}`);
            appendToBuffer(`${promptElement.textContent} Send message? [y/n] >`);
            step = 3;
        } else if (step === 3) {
            // Step 3: Confirm and send
            appendToBuffer(`${promptElement.textContent} Send message? [y/n] > ${sanitizedInput}`);
            if (sanitizedInput.toLowerCase() === 'y') {
                appendToBuffer(`${promptElement.textContent} Sending encrypted payload...`);
                sendEmail();
            } else {
                appendToBuffer(`${promptElement.textContent} Transmission aborted.`);
                appendToBuffer(`${promptElement.textContent} Enter your email >`);
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
        appendToBuffer(`${promptElement.textContent} Error: Rate limit exceeded. Try again in ${remainingSeconds} seconds.`);
        appendToBuffer(`${promptElement.textContent} Enter your email >`);
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
            appendToBuffer(`${promptElement.textContent} Payload delivered successfully!`);
            appendToBuffer(`${promptElement.textContent} Enter your email >`);
            step = 1;
        } else {
            appendToBuffer(`${promptElement.textContent} Error: Transmission failed. Status: ${response.status}`);
            appendToBuffer(`${promptElement.textContent} Enter your email >`);
            step = 1;
            console.error('Formspree Response:', response.status, response.statusText);
        }
    })
    .catch(error => {
        appendToBuffer(`${promptElement.textContent} Error: ${error.message}`);
        appendToBuffer(`${promptElement.textContent} Enter your email >`);
        step = 1;
        console.error('Formspree Error:', error);
    });
}

// Ensure expandable images work (if any)
document.querySelectorAll('.expandable').forEach(img => {
    img.addEventListener('click', () => {
        img.classList.toggle('expanded');
    });
});