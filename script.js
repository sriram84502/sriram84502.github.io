/* -------------------------------------------------------------
   THEME TOGGLE SYSTEM
   ------------------------------------------------------------- */
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// Read cached theme or default to dark
const cachedTheme = localStorage.getItem('sriram-theme') || 'dark';
htmlEl.setAttribute('data-theme', cachedTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        runMatrixTransition(newTheme);
    });
}

function runMatrixTransition(newTheme) {
    const canvas = document.getElementById('theme-transition-canvas');
    if (!canvas) {
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('sriram-theme', newTheme);
        return;
    }

    canvas.style.display = 'block';
    canvas.style.opacity = '1';
    canvas.style.transition = 'opacity 0.2s ease-out';
    
    const ctx = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const chars = "01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%.&*";
    const charArr = chars.split("");
    const fontSize = 16;
    const columns = Math.floor(width / fontSize) + 1;
    const drops = Array(columns).fill(1);

    let isRunning = true;

    function drawMatrixRain() {
        if (!isRunning) return;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#00ff66';
        ctx.font = `bold ${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = charArr[Math.floor(Math.random() * charArr.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            if (Math.random() > 0.98) {
                ctx.fillStyle = '#fff';
            } else {
                ctx.fillStyle = '#00ff66';
            }

            ctx.fillText(text, x, y);

            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        requestAnimationFrame(drawMatrixRain);
    }

    drawMatrixRain();

    // Swap theme classes at exactly 400ms
    setTimeout(() => {
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('sriram-theme', newTheme);
    }, 400);

    // Fade out canvas and stop at 800ms
    setTimeout(() => {
        canvas.style.opacity = '0';
    }, 600);

    setTimeout(() => {
        isRunning = false;
        canvas.style.display = 'none';
    }, 800);
}

/* -------------------------------------------------------------
   MOBILE NAVIGATION DRAWER
   ------------------------------------------------------------- */
const mobileToggleBtn = document.querySelector('.mobile-toggle-btn');
const mobileDrawer = document.querySelector('.mobile-drawer');
const menuIcon = document.getElementById('menu-icon');
const drawerLinks = document.querySelectorAll('.mobile-drawer__link');

mobileToggleBtn.addEventListener('click', () => {
    const isOpen = mobileDrawer.style.display === 'block';
    
    if (isOpen) {
        mobileDrawer.style.display = 'none';
        menuIcon.setAttribute('data-lucide', 'menu');
    } else {
        mobileDrawer.style.display = 'block';
        menuIcon.setAttribute('data-lucide', 'x');
    }
    lucide.createIcons();
});

// Close drawer on clicking any link
drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileDrawer.style.display = 'none';
        menuIcon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
});

/* -------------------------------------------------------------
   DYNAMIC HERO TYPING EFFECT
   ------------------------------------------------------------- */
const typedTextEl = document.getElementById('typed-output');
const roles = [
    'Cybersecurity Analyst',
    'AI Full Stack Developer',
    'Applied ML Researcher',
    'API Penetration Tester'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; // Delete faster
    } else {
        typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100; // Type standard speed
    }

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 1500; // Hold full word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before typing next
    }

    setTimeout(typeEffect, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeEffect, 1000);
});

/* -------------------------------------------------------------
   SPOTLIGHT GRID HOVER EFFECT
   ------------------------------------------------------------- */
const glowCards = document.querySelectorAll('[data-glow]');

glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

/* -------------------------------------------------------------
   STATS COUNTER ANIMATION (Intersection Observer)
   ------------------------------------------------------------- */
const statNumbers = document.querySelectorAll('.stat-number');

const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const targetEl = entry.target;
            const targetVal = parseFloat(targetEl.getAttribute('data-target'));
            let currentVal = 0;
            const isFloat = targetVal % 1 !== 0;
            const increment = isFloat ? 0.1 : Math.ceil(targetVal / 30);
            const duration = 1000; // Total counting time
            const intervals = 30;
            const stepTime = duration / intervals;
            
            const timer = setInterval(() => {
                currentVal += increment;
                if (currentVal >= targetVal) {
                    currentVal = targetVal;
                    clearInterval(timer);
                }
                
                targetEl.textContent = isFloat 
                    ? currentVal.toFixed(1) 
                    : Math.floor(currentVal) + (targetVal === 30 ? '+' : targetVal === 100 ? '%' : '');
            }, stepTime);
            
            observer.unobserve(targetEl);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(num => statsObserver.observe(num));

/* -------------------------------------------------------------
   PROJECTS FILTER SYSTEM
   ------------------------------------------------------------- */
const filterTabs = document.querySelectorAll('.filter-tab');

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Toggle active tabs
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const filterVal = tab.getAttribute('data-filter');
        const currentCards = document.querySelectorAll('.project-card');
        
        currentCards.forEach(card => {
            const categories = (card.getAttribute('data-category') || '').split(' ');
            
            if (filterVal === 'all' || categories.includes(filterVal)) {
                card.style.display = 'flex';
                // Animation trigger
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.display = 'none';
            }
        });
    });
});

/* -------------------------------------------------------------
   INTERACTIVE CANVAS BACKGROUND PARTICLES
   ------------------------------------------------------------- */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let mouse = { x: null, y: null, radius: 100 };

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle blueprint
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce bounds
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    
    draw() {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Populate particles
function initParticles() {
    particlesArray = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 80);
    for (let i = 0; i < count; i++) {
        particlesArray.push(new Particle());
    }
}
initParticles();

// Render loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Match line links
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const opacity = (1 - (distance / 120)) * 0.15;
                ctx.strokeStyle = `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--foreground-raw')}, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* -------------------------------------------------------------
   INTERACTIVE SECURITY CONSOLE (TERMINAL SIMULATOR) & CTF CHALLENGE
   ------------------------------------------------------------- */
const consoleInput = document.getElementById('console-input-field');
const consoleOutputHistory = document.getElementById('console-output-history');
const consoleScreen = document.getElementById('console-screen');

// Commands blueprint
const commands = {
    help: () => `
Available system commands:
  <span class="text-accent">help</span>          - List available commands
  <span class="text-accent">about</span>         - Inspect Sriram's professional background summary
  <span class="text-accent">skills</span>        - Print core full-stack & cybersecurity skillset
  <span class="text-accent">projects</span>      - List completed freelance and commercial projects
  <span class="text-accent">publications</span>  - View scientific research papers and EV Battery work
  <span class="text-accent">api</span>           - Launch 🕷️ API Pentest Simulator sandbox
  <span class="text-accent">tls</span>           - Launch 🛡️ SSL/TLS 1.3 Handshake sandbox
  <span class="text-accent">fhe</span>           - Launch 🔐 FHE CKKS Sandbox
  <span class="text-accent">scan</span>          - Simulate a multi-phase penetration security check
  <span class="text-accent">ctf</span>           - Check the active CTF Security Easter Egg & badges state
  <span class="text-accent">achievements</span>  - Show unlocked CTF badges double-lined table
  <span class="text-accent">inspect</span>       - Run a diagnostic scan for local vulnerabilities
  <span class="text-accent">clear</span>         - Clear the sandbox terminal history
`,
    about: () => `
[System Profile File Loaded]
=======================================
NAME: Sai Sriram Vanapalli
ROLE: Security Analyst at TCS | AI Full-Stack Developer
LOC: Kondapur, Hyderabad, TS, India

An engineering graduate specialized in conducting web application and API 
penetration testing. Bridges the gap between robust codebase security 
(mitigating OWASP Top 10) and building fluid e-commerce environments. 
Holds an academic publication record in Homomorphic Cryptography.
`,
    skills: () => `
[Core Competencies Database]
=======================================
CYBERSECURITY:  API Pentesting, OWASP Top 10, VA/PT, Burp Suite, Nuclei
LANGUAGES:      Python, Java, JavaScript, Dart, SQL
FRONTEND:       React.js, HTML5, CSS3 Grid/Flexbox
BACKEND:        Node.js, Express.js, Django MVC
DATABASE:       MongoDB, Supabase, PostgreSQL
AI & RESEARCH:  RAG Systems, Hugging Face, CKKS Homomorphic Encryption
`,
    projects: () => `
[Active Repositories & Commercial Deployments]
=======================================
* LiveGreen Honey
  - Platform: MERN E-Commerce
  - Integrations: Razorpay Payments, iCarry Logistics
  - AI Element: Hugging Face RAG Chatbot (dynamic support)

* Manscara SkinCare
  - Platform: Scaled MERN Storefront
  - Tech Stack: MongoDB, Express, React, Node, Razorpay

* FlyGrad Platform
  - Category: Educational Consultancy & AI Assist
  - Features: LLM chatbot support using context-aware querying

* APIM YAML Automator (TCS Enterprise Client)
  - Purpose: Postman-to-OpenAPI automated config generator for Azure
`,
    publications: () => `
[Published Scientific Research Papers]
=======================================
1. 2026 - Encrypted Dynamic RVFLN Ensemble Learning for Battery SoH 
   (Transactions on Emerging Telecommunications Technologies)
2. 2025 - EDL-DRVFLNN: Ensemble Deep Learning for Battery Health 
   (Measurement)
3. 2025 - PPDNN-SoH: Privacy-Preserving DNN for Battery Telemetry 
   (Neural Computing and Applications)
4. 2024 - Review of EV Battery Privacy-Preserving Estimations 
   (Computers & Electrical Engineering)
`,
    ctf: () => `
[CTF Audit System Active]
=======================================
CRITICAL CLUE: Sriram has left a hidden entry vector inside the console. 
Run the command <span class="text-accent">inspect</span> to run full local memory diagnostics and check for exposed buffers.
`
};

// Handle console submission
consoleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const inputRaw = consoleInput.value.trim();
        consoleInput.value = '';
        
        if (inputRaw === '') return;
        
        // Print user line
        printLine(`sriram@securescan:~$ ${inputRaw}`, 'console-prompt-echo');
        
        const cmd = inputRaw.toLowerCase();
        
        if (cmd === 'clear') {
            consoleOutputHistory.innerHTML = '';
        } else if (cmd === 'scan') {
            runScanSimulation();
        } else if (cmd === 'inspect') {
            runInspectDiagnostics();
        } else if (cmd === 'hack --buffer-overflow') {
            runBufferOverflowExploit();
        } else if (cmd === 'api' || cmd === 'pentest') {
            printLine('<span class="text-success">[OK]</span> Initializing 🕷️ API Pentest Simulator sandbox modal...');
            openSandboxModal('api-sandbox', '🕷️ API Pentest Simulator');
        } else if (cmd === 'tls' || cmd === 'handshake') {
            printLine('<span class="text-success">[OK]</span> Initializing 🛡️ SSL/TLS 1.3 Handshake sandbox modal...');
            openSandboxModal('tls-sandbox', '🛡️ SSL/TLS 1.3 Handshake');
        } else if (cmd === 'fhe' || cmd === 'ckks') {
            printLine('<span class="text-success">[OK]</span> Initializing 🔐 FHE CKKS Sandbox modal...');
            openSandboxModal('fhe-sandbox', '🔐 FHE CKKS Sandbox');
        } else if (cmd.startsWith('submit ')) {
            const flagInput = inputRaw.substring(7).trim();
            verifySubmittedFlag(flagInput);
        } else if (cmd === 'achievements' || cmd === 'ctf') {
            printLine(renderAchievementsConsole());
            printLine('<span style="color: #64748b; font-size: 0.75rem; font-family: var(--font-mono); margin-top: 4px; display: block;">HINT: Type <span class="text-accent">inspect</span> to scan registry memory, or complete active sandboxes to unlock badges.</span>');
        } else if (commands[cmd]) {
            printLine(commands[cmd]());
        } else {
            printLine(`Command not found: <span class="text-primary">${inputRaw}</span>. Type <span class="text-accent">help</span> for systems checklist.`, 'text-muted');
        }
        
        // Auto scroll console
        consoleScreen.scrollTop = consoleScreen.scrollHeight;
    }
});

function printLine(htmlText, className = '') {
    const line = document.createElement('div');
    line.className = `console-line ${className}`;
    line.innerHTML = htmlText;
    consoleOutputHistory.appendChild(line);
}

// Penetration Scan Simulation
function runScanSimulation() {
    consoleInput.disabled = true;
    printLine('Initializing sandbox penetration scan...');
    
    // Create static scanning loader wrapper
    const loaderLine = document.createElement('div');
    loaderLine.className = 'console-line scanning-loader';
    loaderLine.innerHTML = `
        <span>Audit active: Scanning index portfolios for vulnerabilities...</span>
        <div class="scan-progress-bar">
            <div class="scan-progress-bar-fill" id="scan-bar-fill"></div>
        </div>
    `;
    consoleOutputHistory.appendChild(loaderLine);
    
    const barFill = document.getElementById('scan-bar-fill');
    let width = 0;
    
    const barInterval = setInterval(() => {
        width += 4;
        if (width <= 100) {
            barFill.style.width = `${width}%`;
        } else {
            clearInterval(barInterval);
        }
    }, 80);
    
    const scanSteps = [
        { text: 'Checking workspace ports and CORS headers...', delay: 1000 },
        { text: 'Auditing data assets (MongoDB / Supabase client configurations)... <span class="text-success">[SECURE]</span>', delay: 2000 },
        { text: 'Running SQL Injection & Cross-Site Scripting (XSS) sanity queries... <span class="text-success">[PASS]</span>', delay: 3000 },
        { text: 'Inspecting OWASP API Security Top 10 authentication boundaries... <span class="text-success">[PASS]</span>', delay: 4000 },
        { text: 'Validating FHE homomorphic CKKS telemetry integrity parameters... <span class="text-success">[SECURED]</span>', delay: 5000 },
        { text: '<br><strong class="text-success">SYSTEM AUDIT COMPLETE: 0 vulnerabilities found.</strong> Sriram\'s portfolio index is fully hardened!', delay: 6000 }
    ];
    
    scanSteps.forEach((step, idx) => {
        setTimeout(() => {
            printLine(step.text);
            consoleScreen.scrollTop = consoleScreen.scrollHeight;
            
            // Re-enable console input after last step
            if (idx === scanSteps.length - 1) {
                consoleInput.disabled = false;
                consoleInput.focus();
            }
        }, step.delay);
    });
}

// CTF Step 1: Run diagnostics scan
function runInspectDiagnostics() {
    consoleInput.disabled = true;
    printLine('Running diagnostic scan on system registers...');
    
    setTimeout(() => {
        printLine('Scan Results:');
        printLine('[System Register Mapping]');
        printLine('  Register A: 0x7FFFEE00 (Initialized)');
        printLine('  Register B: 0x7FFFEE08 (Secure)');
        printLine('  Register C: 0x7FFFEE10 <span class="text-primary">[OVERFLOW WARNING - Buffer limit unchecked]</span>');
        printLine('  Payload Address space boundaries have weak validation parameters.');
        printLine('<br><span class="text-accent">HINT:</span> You can try executing a buffer overflow exploit by typing:<br><code class="highlight-code">hack --buffer-overflow</code>');
        consoleScreen.scrollTop = consoleScreen.scrollHeight;
        consoleInput.disabled = false;
        consoleInput.focus();
    }, 1200);
}

// CTF Step 2: Buffer overflow exploit simulation
function runBufferOverflowExploit() {
    consoleInput.disabled = true;
    printLine('Injecting overflow payload at Address 0x7FFFEE10...');
    
    setTimeout(() => {
        printLine('Smashing stack boundaries...');
    }, 800);
    
    setTimeout(() => {
        printLine('Smash Successful! Instruction Pointer (EIP) hijacked to custom address.');
        printLine('Dumping register telemetry metrics...');
    }, 1600);

    setTimeout(() => {
        printLine('Cryptographical flag retrieved successfully:');
        printLine('<span class="text-success" style="font-weight:bold; font-size:1.1rem; letter-spacing:1px;">FLAG{S3CUR1TY_AN4LY5T_EXTR40RD1N41R3}</span>');
        printLine('<br>Type <code class="highlight-code">submit &lt;FLAG&gt;</code> to claim your Secure Coder Badge!');
        consoleScreen.scrollTop = consoleScreen.scrollHeight;
        consoleInput.disabled = false;
        consoleInput.focus();
    }, 2800);
}

// CTF Step 3: Flag verification & modal trigger
function verifySubmittedFlag(flag) {
    if (flag === 'FLAG{S3CUR1TY_AN4LY5T_EXTR40RD1N41R3}') {
        printLine('<span class="text-success" style="font-weight:bold;">Flag accepted! Secure Coder Badge unlocked!</span>');
        unlockBadge('secure_coder', 'Secure Coding Master', 'Congratulations! You successfully exploited the buffer overflow vulnerability and submitted the local cryptographic flag.');
    } else {
        printLine('Incorrect flag. Inspect the terminal payload registers again or try <code class="highlight-code">ctf</code>.', 'text-primary');
    }
}

// Canvas fireworks physics for CTF modal
function triggerExplodingFireworks() {
    const emitter = document.getElementById('particles-emitter');
    emitter.innerHTML = '';
    const rect = emitter.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
    
    // Generate floating visual particles
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = i % 2 === 0 ? 'var(--primary)' : 'var(--accent)';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        emitter.appendChild(particle);
        
        let px = x;
        let py = y;
        let opacity = 1;
        
        const fireworkInterval = setInterval(() => {
            px += vx;
            py += vy + 0.1; // Add gravity
            opacity -= 0.02;
            
            particle.style.left = `${px}px`;
            particle.style.top = `${py}px`;
            particle.style.opacity = opacity;
            
            if (opacity <= 0) {
                clearInterval(fireworkInterval);
                particle.remove();
            }
        }, 16);
    }
}

/* -------------------------------------------------------------
   FLOATING AI ASSISTANT CHATBOT (RAG SIMULATOR)
   ------------------------------------------------------------- */
const chatbotTrigger = document.getElementById('chatbot-trigger');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotInput = document.getElementById('chatbot-input-field');
const chatbotSendBtn = document.getElementById('chatbot-send-btn');
const chatbotMessagesBody = document.getElementById('chatbot-messages-body');

// Toggle chat window open/close
chatbotTrigger.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
    const isVisible = chatbotWindow.classList.contains('active');
    
    const botIcon = chatbotTrigger.querySelector('.bot-icon');
    const closeIcon = chatbotTrigger.querySelector('.close-icon');
    
    if (isVisible) {
        botIcon.style.display = 'none';
        closeIcon.style.display = 'block';
        chatbotTrigger.classList.remove('animate-float');
        chatbotInput.focus();
    } else {
        botIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        chatbotTrigger.classList.add('animate-float');
    }
});

// Chatbot trigger action
chatbotSendBtn.addEventListener('click', processChatSubmission);
chatbotInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') processChatSubmission();
});

function processChatSubmission() {
    const textRaw = chatbotInput.value.trim();
    if (textRaw === '') return;
    
    chatbotInput.value = '';
    
    // Add user bubble
    appendChatMessage(textRaw, 'user');
    
    // Store query text for visualizer and update similarities
    lastRAGQueryText = textRaw;
    updateRAGSimilarityUI(textRaw);
    
    // Trigger canvas redraw & start animation if visualizer is open
    const visualizerPanel = document.getElementById('chatbot-visualizer-body');
    if (visualizerPanel && visualizerPanel.classList.contains('active')) {
        startRAGAnimationLoop();
    }
    
    // Simulated RAG Response Logic
    setTimeout(() => {
        const responseText = queryMockRAGModel(textRaw.toLowerCase());
        appendChatMessage(responseText, 'assistant');
    }, 800);
}

function appendChatMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `chat-msg chat-msg--${sender}`;
    msg.innerHTML = text;
    chatbotMessagesBody.appendChild(msg);
    chatbotMessagesBody.scrollTop = chatbotMessagesBody.scrollHeight;
}

// Simulated NLP match engine reflecting resume vectors
function queryMockRAGModel(query) {
    if (query.includes('tcs') || query.includes('job') || query.includes('work') || query.includes('experience')) {
        return `Sriram has been working as a **Security Analyst** at **Tata Consultancy Services (TCS)** since August 2024. He has successfully conducted penetration testing for over 30 enterprise clients, mitigated OWASP Top 10 vulnerabilities, and built automated OpenAPI onboarding APIs for Azure API Management.`;
    }
    if (query.includes('skills') || query.includes('language') || query.includes('database') || query.includes('frontend') || query.includes('backend')) {
        return `Sriram's core tech stack includes:<br>
        * **Languages:** Python, Java, JavaScript, Dart, SQL<br>
        * **Full-Stack:** MERN Stack (React, Express, Node, MongoDB), Django<br>
        * **Security:** Burp Suite, OWASP ZAP, Wireshark, SQLMap, Nuclei`;
    }
    if (query.includes('project') || query.includes('e-commerce') || query.includes('livegreen') || query.includes('manscara')) {
        return `Sriram has built high-profile freelance e-commerce systems:<br>
        1. **LiveGreen Honey:** MERN-stack shop with Razorpay, logistics integration, and a Hugging Face RAG support chatbot.<br>
        2. **Manscara Skincare:** A scalable storefront for anti-acne men's skincare products built with React, MongoDB, and Express.`;
    }
    if (query.includes('paper') || query.includes('publication') || query.includes('battery') || query.includes('research') || query.includes('ev')) {
        return `Sriram has co-authored **4 peer-reviewed scientific papers** (2024-2026) in prominent journals. His research focuses on **Privacy-Preserving EV Battery State-of-Health prediction** using **Fully Homomorphic Encryption (FHE / CKKS)** and deep ensemble neural networks (EDL-DRVFLNN).`;
    }
    if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('reach')) {
        return `You can reach Sriram directly at **vanapallisaisriram7@gmail.com** or call him at **+91-83095-54288**. There is also a secure SQLite-powered contact form at the bottom of the page!`;
    }
    return `That is a great query! As Sriram's AI Assistant, I'm loaded with his resume indices. Ask me about his **experience at TCS**, his **MERN projects (LiveGreen, Manscara)**, his **B.Tech college**, or his **cryptographical battery papers**!`;
}

/* -------------------------------------------------------------
   CONTACT FORM SECURE AJAX SUBMISSION (Anti-CSRF)
   ------------------------------------------------------------- */
const contactForm = document.getElementById('contact-form');
const feedbackArea = document.getElementById('form-feedback-area');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        feedbackArea.style.display = 'block';
        feedbackArea.className = 'form-response-msg text-accent';
        feedbackArea.textContent = 'Securing transmission & sending...';
        
        const formData = new FormData(contactForm);
        
        // Detect if running in static environment (GitHub Pages or local file)
        const isStaticEnv = window.location.hostname.endsWith('github.io') || window.location.protocol === 'file:';
        
        if (isStaticEnv) {
            setTimeout(() => {
                feedbackArea.className = 'form-response-msg text-success';
                feedbackArea.textContent = 'Simulated secure submission successful! (In a deployed PHP environment, this writes to SQLite via prepared statements).';
                contactForm.reset();
            }, 1000);
            return;
        }
        
        fetch('submit.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(res => {
            if (res.status === 200) {
                feedbackArea.className = 'form-response-msg text-success';
                feedbackArea.textContent = res.body.message;
                contactForm.reset();
            } else {
                feedbackArea.className = 'form-response-msg text-primary';
                feedbackArea.textContent = res.body.message || 'Validation failed.';
            }
        })
        .catch(err => {
            feedbackArea.className = 'form-response-msg text-primary';
            feedbackArea.textContent = 'Network or server offline. Message unsaved.';
        });
    });
}

/* -------------------------------------------------------------
   LIVE GITHUB API & STATS INTEGRATION
   ------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    fetchLiveGitHubRepos();
});

function fetchLiveGitHubRepos() {
    const gitGrid = document.getElementById('github-projects-grid');
    if (!gitGrid) return;
    
    const githubUser = 'sriram84502';
    
    fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=8`)
    .then(res => {
        if (!res.ok) throw new Error('API Rate Limit or offline.');
        return res.json();
    })
    .then(repos => {
        // Filter out fork repositories and sort by stars
        const mainRepos = repos.filter(r => !r.fork).sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 4);
        
        if (mainRepos.length === 0) return;
        
        // Remove any previously appended dynamic cards to prevent duplication on multiple hot reloads
        const existingDynamic = gitGrid.querySelectorAll('.project-card[data-dynamic="true"]');
        existingDynamic.forEach(card => card.remove());
        
        mainRepos.forEach((repo) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-glow', '');
            card.setAttribute('data-dynamic', 'true');
            
            // Map categories dynamically based on repository names and languages
            let category = 'fullstack';
            let icon = 'layers';
            let iconColorClass = 'text-accent';
            let meshClass = 'mock-bg-mesh--alt';
            
            const repoNameLower = repo.name.toLowerCase();
            const repoLangLower = (repo.language || '').toLowerCase();
            
            if (repoNameLower.includes('honey') || repoNameLower.includes('skincare')) {
                category = 'fullstack';
                icon = 'shopping-bag';
                iconColorClass = 'text-primary';
                meshClass = 'mock-bg-mesh';
            } else if (repoNameLower.includes('ai') || repoNameLower.includes('bot') || repoNameLower.includes('rag') || repoLangLower === 'python') {
                category = 'ai';
                icon = 'cpu';
                iconColorClass = 'text-success';
                meshClass = 'mock-bg-mesh--three';
            } else if (repoNameLower.includes('sec') || repoNameLower.includes('vuln') || repoNameLower.includes('script') || ['c++', 'c', 'go', 'rust', 'shell'].includes(repoLangLower)) {
                category = 'security';
                icon = 'shield-check';
                iconColorClass = 'text-primary';
                meshClass = 'mock-bg-mesh';
            } else if (['javascript', 'typescript', 'html', 'css', 'php'].includes(repoLangLower)) {
                category = 'fullstack';
                icon = 'layers';
                iconColorClass = 'text-accent';
                meshClass = 'mock-bg-mesh--alt';
            }
            
            card.setAttribute('data-category', category);
            
            card.innerHTML = `
                <div class="project-image-mock flex-center">
                    <i data-lucide="${icon}" class="mock-img-icon ${iconColorClass}"></i>
                    <div class="mock-bg-mesh ${meshClass}"></div>
                </div>
                <div class="project-info">
                    <div class="project-tags">
                        <span class="tag">${repo.language || 'JavaScript'}</span>
                        <span class="tag">★ ${repo.stargazers_count} Stars</span>
                        <span class="tag">Live Repo</span>
                    </div>
                    <h3 class="project-card-title">${repo.name}</h3>
                    <p class="project-card-description">
                        ${repo.description || 'Public open-source repository loaded live via Sriram\'s profile GitHub developer API feed. Fully documented and interactive codebase.'}
                    </p>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link-active">
                            <i data-lucide="github"></i>
                            <span>Inspect Code</span>
                        </a>
                    </div>
                </div>
            `;
            
            gitGrid.appendChild(card);
        });
        
        // Re-attach card mousemove glows for all cards in grid (including new ones)
        const updatedGlowCards = document.querySelectorAll('[data-glow]');
        updatedGlowCards.forEach(card => {
            // Remove previous event listener if present (safeguard)
            card.removeEventListener('mousemove', handleCardMouseMove);
            card.addEventListener('mousemove', handleCardMouseMove);
        });
        
        lucide.createIcons();
    })
    .catch(err => {
        console.warn('GitHub API failed to load dynamically. Displaying highly optimized offline fallbacks.', err);
    });
}

// Shared mouse move handler for glows
function handleCardMouseMove(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.style.setProperty('--mouse-x', `${x}px`);
    this.style.setProperty('--mouse-y', `${y}px`);
}

/* =============================================================
   INTERACTIVE PORTFOLIO SANDBOXES: FHE, API BOLA, & RAG ENGINE
   ============================================================= */

// Global state trackers
let lastRAGQueryText = null;
let ragAnimationRequest = null;
let fheAnimationTimers = [];
let sohCounterInterval = null;
let apiMitigationApplied = false;
let isFheBootstrapping = false;
let currentFheNoiseBudget = 80.0;

// Mock database documents for the RAG engine representing Sriram's research and work
const ragDocuments = [
    {
        id: "fhe-paper-2026",
        name: "EV CKKS FHE Paper (2026)",
        coord: { x: 180, y: 70 }, // relative dimensions on 300x200 space
        color: "#a855f7", // Purple accent
        keywords: ['paper', 'publication', 'battery', 'research', 'ev', 'fhe', 'ckks', 'neural'],
        chunk: "Sriram's 2026 publication details an Encrypted Dynamic RVFLN Ensemble Learning scheme for EV battery State of Health (SoH) evaluation directly on polynomial ciphertexts under the CKKS cryptographical scheme, verifying privacy-preserving performance with zero leakage."
    },
    {
        id: "edl-paper-2025",
        name: "EDL-DRVFLNN Paper (2025)",
        coord: { x: 70, y: 140 },
        color: "#3b82f6", // Blue
        keywords: ['paper', 'publication', 'battery', 'research', 'ev', 'deep', 'learning'],
        chunk: "Co-authored Transaction paper detailing EDL-DRVFLNN: Ensemble Deep Learning for Battery Health monitoring. Standardizes secure data sharing strategies for lithium-ion battery management in public-cloud infrastructures."
    },
    {
        id: "tcs-resume",
        name: "TCS Security Analyst Resume",
        coord: { x: 230, y: 160 },
        color: "#f59e0b", // Amber / Gold
        keywords: ['tcs', 'job', 'work', 'experience', 'skills', 'language', 'database', 'frontend', 'backend', 'security', 'analyst', 'pentest'],
        chunk: "Sai Sriram Vanapalli works as a Security Analyst at TCS (since August 2024), where he conducts web/API penetration testing for over 30 enterprise financial and retail clients, securing server codebases against OWASP Top 10 vulnerabilities."
    },
    {
        id: "fullstack-projects",
        name: "Full-Stack E-Commerce",
        coord: { x: 110, y: 40 },
        color: "#10b981", // Emerald green
        keywords: ['project', 'e-commerce', 'livegreen', 'manscara', 'skills', 'language', 'database', 'frontend', 'backend', 'mern'],
        chunk: "Sriram developed commercial full-stack platforms: LiveGreen Honey (MERN, integrated Hugging Face AI RAG support, Razorpay, and logistics APIs) and Manscara Skincare (MERN-based men's care automated storefront)."
    }
];

/* -------------------------------------------------------------
   GLASSMORPHIC INTERACTIVE SANDBOX MODAL UTILITIES
   ------------------------------------------------------------- */
function openSandboxModal(sandboxId, titleText) {
    const modal = document.getElementById('sandbox-modal');
    const modalTitle = document.getElementById('sandbox-modal-title');
    const panels = document.querySelectorAll('.sandbox-modal-body .sandbox-panel');
    
    if (!modal) return;
    
    // Set title
    if (modalTitle) {
        modalTitle.innerHTML = titleText;
    }
    
    // Set active sandbox panel inside the modal
    panels.forEach(panel => {
        if (panel.id === sandboxId) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
    
    // Open modal
    modal.classList.add('active');
    
    // Dispatch resize event to trigger layout calculations for canvas/chart dimensions
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 50);
}

function closeSandboxModal() {
    const modal = document.getElementById('sandbox-modal');
    const panels = document.querySelectorAll('.sandbox-modal-body .sandbox-panel');
    
    if (!modal) return;
    
    // Check if tls-sandbox was active to clear running intervals/autoplay
    const tlsPanel = document.getElementById('tls-sandbox');
    if (tlsPanel && tlsPanel.classList.contains('active')) {
        if (typeof clearTlsAutoPlay === 'function') clearTlsAutoPlay();
        if (typeof tlsEncryptedFlowInterval !== 'undefined' && tlsEncryptedFlowInterval) {
            clearInterval(tlsEncryptedFlowInterval);
            tlsEncryptedFlowInterval = null;
        }
    }
    
    // Close modal
    modal.classList.remove('active');
    
    // Remove active from panels
    panels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Restore focus to terminal prompt
    const consoleInput = document.getElementById('console-input-field');
    if (consoleInput) {
        consoleInput.focus();
    }
}

// Initialize wiring when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Sandbox Modal close handlers
    const closeBtn = document.getElementById('sandbox-modal-close-btn');
    const modalOverlay = document.getElementById('sandbox-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSandboxModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            // Close only if click is directly on the backdrop, not inside the modal window
            if (e.target === modalOverlay) {
                closeSandboxModal();
            }
        });
    }
    
    // ESC key close support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('sandbox-modal');
            if (modal && modal.classList.contains('active')) {
                closeSandboxModal();
            }
        }
    });

    // 1. PLAYGROUND HUB TABS SWITCHING
    const playTabs = document.querySelectorAll('.playground-tab');
    const sandboxPanels = document.querySelectorAll('.sandbox-panel');
    
    if (playTabs.length > 0) {
        playTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Reset active tabs
                playTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Reset active panels
                const targetId = tab.getAttribute('data-target');
                sandboxPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === targetId) {
                        panel.classList.add('active');
                    }
                });
                
                // If switching away from TLS, clear autoplay and timers
                if (targetId !== 'tls-sandbox') {
                    if (typeof clearTlsAutoPlay === 'function') clearTlsAutoPlay();
                    if (typeof tlsEncryptedFlowInterval !== 'undefined' && tlsEncryptedFlowInterval) {
                        clearInterval(tlsEncryptedFlowInterval);
                        tlsEncryptedFlowInterval = null;
                    }
                }
            });
        });
    }

    // 2. FHE CKKS SLIDERS & GAUGE CONTROLLERS
    const voltageSlider = document.getElementById('fhe-voltage-slider');
    const tempSlider = document.getElementById('fhe-temp-slider');
    const resSlider = document.getElementById('fhe-res-slider');
    
    const voltageVal = document.getElementById('fhe-voltage-val');
    const tempVal = document.getElementById('fhe-temp-val');
    const resVal = document.getElementById('fhe-res-val');
    
    if (voltageSlider && tempSlider && resSlider) {
        const handleFheInput = () => {
            const v = parseFloat(voltageSlider.value);
            const t = parseFloat(tempSlider.value);
            const r = parseFloat(resSlider.value);
            
            if (voltageVal) voltageVal.textContent = `${v.toFixed(2)} V`;
            if (tempVal) tempVal.textContent = `${t.toFixed(1)} °C`;
            if (resVal) resVal.textContent = `${r.toFixed(2)} mΩ`;
            
            updateCKKSCiphertextDisplay(v, t, r);
            updateFHEKeysAndNoise(v, t, r);
            debounceFHEEvaluation(v, t, r);
        };
        
        voltageSlider.addEventListener('input', handleFheInput);
        tempSlider.addEventListener('input', handleFheInput);
        resSlider.addEventListener('input', handleFheInput);
        
        handleFheInput();

        const bootstrapBtn = document.getElementById('fhe-bootstrap-btn');
        if (bootstrapBtn) {
            bootstrapBtn.addEventListener('click', () => {
                if (isFheBootstrapping) return;
                isFheBootstrapping = true;
                bootstrapBtn.disabled = true;
                const originalText = bootstrapBtn.innerHTML;
                bootstrapBtn.innerHTML = '<i data-lucide="refresh-cw" class="rotate-bootstrap-active" style="width: 12px; height: 12px; display: inline-block;"></i> Bootstrapping...';
                lucide.createIcons();

                setTimeout(() => {
                    voltageSlider.value = 3.70;
                    tempSlider.value = 25.0;
                    resSlider.value = 2.10;

                    isFheBootstrapping = false;
                    handleFheInput();

                    bootstrapBtn.disabled = false;
                    bootstrapBtn.innerHTML = originalText;
                    lucide.createIcons();

                    const fheHexLog = document.getElementById('fhe-hex-log');
                    if (fheHexLog) {
                        fheHexLog.innerHTML = `<span style="color: #10b981; font-weight: bold;">[SYSTEM SUCCESS] Ciphertext Bootstrapping Complete. Noise reduced back to nominal &lt; 0.001 dB.</span><br>` + fheHexLog.innerHTML;
                    }
                }, 1500);
            });
        }

        const downloadKeysBtn = document.getElementById('fhe-download-keys-btn');
        if (downloadKeysBtn) {
            downloadKeysBtn.addEventListener('click', () => {
                const v = parseFloat(voltageSlider.value);
                const t = parseFloat(tempSlider.value);
                const r = parseFloat(resSlider.value);
                
                const keyData = {
                    metadata: {
                        owner: "Sai Sriram Vanapalli",
                        project: "FHE Battery Telemetry Sandbox",
                        timestamp: new Date().toISOString(),
                        cryptography_scheme: "CKKS (Fully Homomorphic Encryption)"
                    },
                    plaintext_telemetry_snapshot: {
                        voltage_V: v,
                        temperature_C: t,
                        internal_resistance_mOhm: r
                    },
                    ckks_noise_telemetry: {
                        current_noise_budget_dB: currentFheNoiseBudget,
                        noise_depleted: (80.0 - currentFheNoiseBudget).toFixed(2),
                        warning_triggered: currentFheNoiseBudget < 20.0
                    },
                    cryptographic_keys: {
                        secret_key_s: document.getElementById('fhe-key-secret') ? document.getElementById('fhe-key-secret').textContent : "Unknown",
                        public_key_pk: {
                            c0_poly_hash: "0x" + (v * 777 >>> 0).toString(16).toUpperCase(),
                            c1_poly_hash: "0x" + (t * 888 >>> 0).toString(16).toUpperCase(),
                            modulus_q: "0xFFFFFFFFFFFFC90F..."
                        },
                        relinearization_key_rlk: document.getElementById('fhe-key-rlk') ? document.getElementById('fhe-key-rlk').textContent : "Unknown",
                        galois_keys_gk: "16 Galois rotation elements (Curve25519 standard)"
                    }
                };

                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(keyData, null, 4));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `sriram_fhe_ckks_keys_${Math.floor(Date.now() / 1000)}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
            });
        }
    }

    // 3. API BOLA PENTEST SIMULATOR
    const apiSendBtn = document.getElementById('api-send-btn');
    const apiUrlInput = document.getElementById('api-url-input');
    const apiMitigateBtn = document.getElementById('api-mitigate-btn');
    
    if (apiSendBtn) {
        apiSendBtn.addEventListener('click', triggerAPIMockRequest);
    }
    if (apiUrlInput) {
        apiUrlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') triggerAPIMockRequest();
        });
    }
    if (apiMitigateBtn) {
        apiMitigateBtn.addEventListener('click', () => {
            apiMitigationApplied = !apiMitigationApplied;
            toggleAPIMitigationState();
        });
    }
    // Set initial simulator view state
    triggerAPIMockRequest();

    // 4. CHATBOT FLOATING DRAWER TABS
    const chatbotTabChat = document.getElementById('chatbot-tab-chat');
    const chatbotTabVisualizer = document.getElementById('chatbot-tab-visualizer');
    const chatbotMsgBody = document.getElementById('chatbot-messages-body');
    const chatbotVisBody = document.getElementById('chatbot-visualizer-body');
    
    if (chatbotTabChat && chatbotTabVisualizer && chatbotMsgBody && chatbotVisBody) {
        chatbotTabChat.addEventListener('click', () => {
            chatbotTabChat.classList.add('active');
            chatbotTabVisualizer.classList.remove('active');
            chatbotMsgBody.style.display = 'flex';
            chatbotVisBody.classList.remove('active');
            
            // Terminate RAG canvas animation loop to preserve CPU
            if (ragAnimationRequest) {
                cancelAnimationFrame(ragAnimationRequest);
                ragAnimationRequest = null;
            }
        });
        
        chatbotTabVisualizer.addEventListener('click', () => {
            chatbotTabVisualizer.classList.add('active');
            chatbotTabChat.classList.remove('active');
            chatbotMsgBody.style.display = 'none';
            chatbotVisBody.classList.add('active');
            
            // Draw vector canvas immediately and launch dynamic rendering loop
            drawRAGVectorSpace(lastRAGQueryText);
            startRAGAnimationLoop();
        });
    }
    
    // Set default similarity leaderboard
    updateRAGSimilarityUI(null);

    // Initializations for Phase 5 & 7 Enhancements
    initJWTDebugger();
    initTlsSandbox();
    initRAGSliders();
    initCTFBadgeState();
    
    // Phase 7 Elite Upgrades
    initRAGCanvasInteraction();
    initScholarObserver();
    initTlsTabs();
});

/* =============================================================
   FHE SANDBOX MATHEMATICS & ANIMATIONS HANDLERS
   ============================================================= */

// Simple 150ms debounce utility for network wave transitions
let fheDebounceTimer = null;
function debounceFHEEvaluation(v, t, r) {
    clearTimeout(fheDebounceTimer);
    fheDebounceTimer = setTimeout(() => {
        // Battery State of Health equation based on Sriram's publication physics:
        // High internal resistance degrades SoH. Extreme temperatures decrease SoH.
        let calculatedSoh = 99.5 - (r - 1.2) * 11.5 - Math.max(0, t - 25) * 0.25 - Math.max(0, 25 - t) * 0.05;
        // Bound between 10% and 100%
        calculatedSoh = Math.max(10, Math.min(100, calculatedSoh));
        
        runFHEEvaluationAnimation(v, t, r, calculatedSoh);
    }, 150);
}

// Generate premium CKKS simulated dual-polynomial coefficient hex arrays
function updateCKKSCiphertextDisplay(v, t, r) {
    const fheHexLog = document.getElementById('fhe-hex-log');
    if (!fheHexLog) return;
    
    const hex1 = (Math.sin(v) * 0xffffffff >>> 0).toString(16).toUpperCase().padStart(8, '0');
    const hex2 = (Math.cos(t) * 0xffffffff >>> 0).toString(16).toUpperCase().padStart(8, '0');
    const hex3 = (Math.sin(r) * 0xffffffff >>> 0).toString(16).toUpperCase().padStart(8, '0');
    const hex4 = ((Math.sin(v) + Math.cos(t)) * 0xffffffff >>> 0).toString(16).toUpperCase().padStart(8, '0');
    
    fheHexLog.innerHTML = `c₀ = [0x${hex1}... (1024 poly coefficients) ...0x${hex2}]<br>c₁ = [0x${hex3}... (1024 poly coefficients) ...0x${hex4}]`;
}

// Clear all active setTimeout handles in step transitions
function clearFheAnimations() {
    fheAnimationTimers.forEach(t => clearTimeout(t));
    fheAnimationTimers = [];
}

// Sequential activation wave from inputs, through links & hidden nodes, to predicted output node
function runFHEEvaluationAnimation(voltage, temp, resistance, soh) {
    clearFheAnimations();
    
    const nodeH1 = document.getElementById('node-h1');
    const nodeH2 = document.getElementById('node-h2');
    const nodeH3 = document.getElementById('node-h3');
    const nodeOutput = document.getElementById('node-output');
    
    const layer1Links = [
        'link-v-h1', 'link-v-h2', 'link-v-h3',
        'link-t-h1', 'link-t-h2', 'link-t-h3',
        'link-r-h1', 'link-r-h2', 'link-r-h3'
    ].map(id => document.getElementById(id));
    
    const layer2Links = [
        'link-h1-o', 'link-h2-o', 'link-h3-o', 'link-t-o'
    ].map(id => document.getElementById(id));
    
    // Step 1: Deactivate layer 2 elements immediately
    [nodeH1, nodeH2, nodeH3, nodeOutput].forEach(n => { if (n) n.classList.remove('active'); });
    layer2Links.forEach(l => { 
        if (l) {
            l.classList.remove('active');
            l.classList.remove('active-accent');
        }
    });
    
    // Step 2: Trigger layer 1 links activation
    layer1Links.forEach(l => { if (l) l.classList.add('active'); });
    
    // Step 3: Trigger hidden layer nodes activation
    fheAnimationTimers.push(setTimeout(() => {
        [nodeH1, nodeH2, nodeH3].forEach(n => { if (n) n.classList.add('active'); });
    }, 400));
    
    // Step 4: Trigger layer 2 connections activation
    fheAnimationTimers.push(setTimeout(() => {
        layer2Links.forEach(l => { if (l) l.classList.add('active-accent'); });
    }, 800));
    
    // Step 5: Activate Output & Decrypt state capacity
    fheAnimationTimers.push(setTimeout(() => {
        if (nodeOutput) nodeOutput.classList.add('active');
        updateFHEDecryptedResult(soh);
    }, 1200));
}

// Draw decrypted capacity radial filling gauge and count up SoH percentages
function updateFHEDecryptedResult(targetSoh) {
    const percentEl = document.getElementById('fhe-soh-percent');
    const statusEl = document.getElementById('fhe-soh-status');
    const gaugeFill = document.getElementById('fhe-gauge-fill');
    
    // Update SVG circumference fill. Total length is 377
    if (gaugeFill) {
        const offset = 377 * (1 - targetSoh / 100);
        gaugeFill.style.strokeDashoffset = offset;
    }
    
    // Smooth count up/down calculation text
    if (percentEl) {
        clearInterval(sohCounterInterval);
        let currentSoh = parseInt(percentEl.textContent) || 0;
        if (currentSoh === 0) currentSoh = 50; // nominal start point
        
        const diff = targetSoh - currentSoh;
        if (diff === 0) {
            percentEl.textContent = `${Math.round(targetSoh)}%`;
        } else {
            const steps = 15;
            let step = 0;
            sohCounterInterval = setInterval(() => {
                step++;
                const val = currentSoh + (diff * (step / steps));
                percentEl.textContent = `${Math.round(val)}%`;
                if (step >= steps) {
                    percentEl.textContent = `${Math.round(targetSoh)}%`;
                    clearInterval(sohCounterInterval);
                }
            }, 30);
        }
    }
    
    // Health status label mapping
    if (statusEl) {
        if (targetSoh >= 90) {
            statusEl.textContent = "Optimal Health (Excellent)";
            statusEl.style.color = "#10b981"; // Emerald
        } else if (targetSoh >= 80) {
            statusEl.textContent = "Healthy (Nominal Operations)";
            statusEl.style.color = "#3b82f6"; // Blue
        } else if (targetSoh >= 70) {
            statusEl.textContent = "Degraded Capacity (Service Suggested)";
            statusEl.style.color = "var(--primary)"; // Amber / Gold
        } else {
            statusEl.textContent = "Critical Aging (Replacement Recommended)";
            statusEl.style.color = "#ef4444"; // Red
        }
    }
}

/* =============================================================
   API BOLA PENTEST SIMULATOR CONTROLLER
   ============================================================= */

// Apply or disable mitigation state changes
function toggleAPIMitigationState() {
    const apiMitigateBtn = document.getElementById('api-mitigate-btn');
    const apiMitigateBtnText = document.getElementById('api-mitigate-btn-text');
    const apiCodeDiffBox = document.getElementById('api-code-diff-box');
    const apiReqHeaders = document.getElementById('api-request-headers');
    const apiExplainer = document.getElementById('api-mitigation-explainer');
    
    if (apiMitigationApplied) {
        // Mitigated state UI modifications
        if (apiMitigateBtn) {
            apiMitigateBtn.style.borderColor = "#10b981";
            const icon = apiMitigateBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'shield-check');
                icon.className = 'text-success';
            }
        }
        if (apiMitigateBtnText) apiMitigateBtnText.textContent = "Disable Secure Mitigation";
        if (apiCodeDiffBox) apiCodeDiffBox.classList.add('active');
        
        if (apiExplainer) {
            apiExplainer.innerHTML = `BOLA Mitigated: Session claims JWT validated. Sriram's remediation strategy secures queries by decoding identity claims directly from cryptographically signed session tokens instead of relying on client-supplied parameters.`;
        }
        if (apiReqHeaders) {
            apiReqHeaders.value = JSON.stringify({
                "Accept": "application/json",
                "Authorization": "Bearer static_jwt_session_token_user_84",
                "X-BOLA-Protection": "JWT-Claims-Enforced",
                "User-Agent": "SecuredPentestTool/1.0.4",
                "Origin": "sriram-portfolio"
            }, null, 2);
        }
    } else {
        // Vulnerable state UI modifications
        if (apiMitigateBtn) {
            apiMitigateBtn.style.borderColor = "rgba(var(--primary-raw), 0.3)";
            const icon = apiMitigateBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'shield-alert');
                icon.className = 'text-primary';
            }
        }
        if (apiMitigateBtnText) apiMitigateBtnText.textContent = "Apply Secure Mitigation";
        if (apiCodeDiffBox) apiCodeDiffBox.classList.remove('active');
        
        if (apiExplainer) {
            apiExplainer.innerHTML = `Currently simulating a vulnerable <strong>BOLA (Broken Object Level Authorization)</strong> database check. The server returns record payloads without validating session identity checks.`;
        }
        if (apiReqHeaders) {
            apiReqHeaders.value = JSON.stringify({
                "Accept": "application/json",
                "Authorization": "Bearer static_jwt_session_token_user_84",
                "User-Agent": "SecuredPentestTool/1.0.4",
                "Origin": "sriram-portfolio"
            }, null, 2);
        }
    }
    
    lucide.createIcons();
    // Refresh the mock HTTP response log output
    triggerAPIMockRequest();
}

// Evaluate simulated requests
function triggerAPIMockRequest() {
    const apiUrlInput = document.getElementById('api-url-input');
    const apiResponseStatus = document.getElementById('api-response-status');
    const apiResponseBody = document.getElementById('api-response-body');
    const apiAlertBanner = document.getElementById('api-alert-banner');
    const apiAlertText = document.getElementById('api-alert-text');
    
    if (!apiUrlInput || !apiResponseBody) return;
    
    const urlVal = apiUrlInput.value.trim();
    let queryUserId = null;
    
    // Parse target parameters
    try {
        const match = urlVal.match(/user_id=(\d+)/);
        if (match) {
            queryUserId = parseInt(match[1]);
        }
    } catch (err) {
        console.warn("Failed to parse URL query values", err);
    }
    
    if (queryUserId === null) {
        // Invalid query layout
        if (apiResponseStatus) {
            apiResponseStatus.textContent = "400 Bad Request";
            apiResponseStatus.className = "api-status-badge status-none";
        }
        apiResponseBody.textContent = JSON.stringify({
            "error": "Bad Request",
            "reason": "Missing or malformed user_id parameter in query path."
        }, null, 2);
        
        if (apiAlertBanner) {
            apiAlertBanner.className = "api-alert-banner api-alert-banner--danger";
        }
        if (apiAlertText) {
            apiAlertText.textContent = "Request Failed: Missing or invalid parameters in request route.";
        }
        return;
    }
    
    // Update live JWT and verify its integrity
    const jwtInfo = typeof updateLiveJWT === 'function' ? updateLiveJWT() : null;
    if (jwtInfo && !jwtInfo.isValid) {
        if (apiResponseStatus) {
            apiResponseStatus.textContent = "401 Unauthorized";
            apiResponseStatus.className = "api-status-badge status-none";
        }
        apiResponseBody.textContent = JSON.stringify({
            "error": "Unauthorized",
            "reason": "JWT signature verification failed. The session token signature is invalid or tampered.",
            "mitigation_applied": apiMitigationApplied,
            "timestamp": new Date().toISOString()
        }, null, 2);
        
        if (apiAlertBanner) apiAlertBanner.className = "api-alert-banner api-alert-banner--danger";
        if (apiAlertText) apiAlertText.textContent = "Unauthorized: Invalid JWT signature check failed. Blocked data flow.";
        return;
    }
    
    const jwtUserId = jwtInfo ? jwtInfo.payload.id : null;
    
    // Handle mock API responses
    if (apiMitigationApplied) {
        // SECURE MITIGATION ON
        if (queryUserId === 84 && jwtUserId === 84) {
            // Authorized profile access (Self)
            if (apiResponseStatus) {
                apiResponseStatus.textContent = "200 OK";
                apiResponseStatus.className = "api-status-badge status-200";
            }
            apiResponseBody.textContent = JSON.stringify({
                "status": "success",
                "user": {
                    "id": 84,
                    "name": "Sai Sriram Vanapalli",
                    "role": "Premium Security Analyst",
                    "account_balance": "$12,450.80",
                    "tcs_clearance_level": "L2_PENTESTER",
                    "authenticity_validation": "SUCCESS"
                }
            }, null, 2);
            
            if (apiAlertBanner) apiAlertBanner.className = "api-alert-banner api-alert-banner--secure";
            if (apiAlertText) apiAlertText.textContent = "BOLA Shield Active: Request verified successfully. Access authorized for User 84.";
            
            // Unlock API Security Auditor badge!
            if (typeof unlockBadge === 'function') {
                unlockBadge('api_bola', 'API Security Auditor', 'Congratulations! You successfully audited the API Simulator, activated secure JWT Claims enforcement mitigation, and secured the gateway against BOLA exploits!');
            }
        } else {
            // Blocked unauthorized access attempt (BOLA check working!)
            if (apiResponseStatus) {
                apiResponseStatus.textContent = "403 Forbidden";
                apiResponseStatus.className = "api-status-badge status-none";
            }
            
            let blockReason = "BOLA security policy block: Identity claims retrieved from JWT do not match the requested resource ID";
            if (queryUserId === jwtUserId && jwtUserId !== 84) {
                blockReason = `Security policy block: Ephemeral session claim (User ${jwtUserId}) is not authorized to access production Gateway resources.`;
            }
            
            apiResponseBody.textContent = JSON.stringify({
                "error": "Access Denied",
                "reason": blockReason,
                "action_logged": "LOGGED_TO_SIEM_AUDIT",
                "attempted_id": queryUserId,
                "session_id": jwtUserId,
                "mitigation_applied": true,
                "timestamp": new Date().toISOString()
            }, null, 2);
            
            if (apiAlertBanner) apiAlertBanner.className = "api-alert-banner api-alert-banner--secure";
            if (apiAlertText) apiAlertText.textContent = `BOLA Shield Active: Blocked unauthorized data leak attempt on User ID ${queryUserId} (403 Forbidden).`;
        }
    } else {
        // VULNERABLE STATE ON
        if (queryUserId === 84) {
            if (apiResponseStatus) {
                apiResponseStatus.textContent = "200 OK";
                apiResponseStatus.className = "api-status-badge status-200";
            }
            apiResponseBody.textContent = JSON.stringify({
                "status": "success",
                "user": {
                    "id": 84,
                    "name": "Sai Sriram Vanapalli",
                    "role": "Premium Security Analyst",
                    "account_balance": "$12,450.80",
                    "tcs_clearance_level": "L2_PENTESTER"
                }
            }, null, 2);
            
            if (apiAlertBanner) apiAlertBanner.className = "api-alert-banner api-alert-banner--danger";
            if (apiAlertText) apiAlertText.textContent = "Endpoint Vulnerable: Dashboard loaded successfully, but BOLA checks are disabled.";
        } else if (queryUserId === 1) {
            // Leaked CEO record!
            if (apiResponseStatus) {
                apiResponseStatus.textContent = "200 OK (LEAKED)";
                apiResponseStatus.className = "api-status-badge status-200";
            }
            apiResponseBody.textContent = JSON.stringify({
                "status": "success",
                "user": {
                    "id": 1,
                    "name": "K. Krithivasan",
                    "role": "Chief Executive Officer & MD (TCS)",
                    "account_balance": "$9,450,000.00",
                    "private_keys_archived": true,
                    "vault_passphrase": "REDACTED_TCS_GLOBAL_VAULT_KEY_2026_FHE",
                    "clearance_level": "L5_SYS_ADMIN"
                }
            }, null, 2);
            
            if (apiAlertBanner) apiAlertBanner.className = "api-alert-banner api-alert-banner--danger";
            if (apiAlertText) apiAlertText.textContent = `BOLA EXPLOIT SUCCESSFUL: Leaked highly sensitive data for CEO (User ID 1)!`;
        } else {
            // Leaked general mock record
            if (apiResponseStatus) {
                apiResponseStatus.textContent = "200 OK (LEAKED)";
                apiResponseStatus.className = "api-status-badge status-200";
            }
            apiResponseBody.textContent = JSON.stringify({
                "status": "success",
                "user": {
                    "id": queryUserId,
                    "name": "Anonymous Enterprise Client",
                    "role": "External Audit Consultant",
                    "account_balance": "$5,600.00",
                    "clearance_level": "L1_AUDITOR",
                    "restricted_data_leak": "BOLA EXPLOIT SUCCESSFUL"
                }
            }, null, 2);
            
            if (apiAlertBanner) apiAlertBanner.className = "api-alert-banner api-alert-banner--danger";
            if (apiAlertText) apiAlertText.textContent = `BOLA EXPLOIT SUCCESSFUL: Leaked unauthorized details for User ID ${queryUserId}!`;
        }
    }
}

/* =============================================================
   RAG 2D VECTOR EMBEDDING ENGINE VISUALIZER
   ============================================================= */

// Calculate 2D query projections based on semantic context match weights
function getQueryVectorCoordinate(queryText) {
    let bestDoc = null;
    let maxMatches = 0;
    
    ragDocuments.forEach(doc => {
        let matches = 0;
        doc.keywords.forEach(kw => {
            if (queryText.includes(kw)) {
                matches++;
            }
        });
        if (matches > maxMatches) {
            maxMatches = matches;
            bestDoc = doc;
        }
    });
    
    if (bestDoc && maxMatches > 0) {
        // Map close to the matching document with slight noise so it is a distinct point
        return {
            x: bestDoc.coord.x + (Math.random() * 20 - 10),
            y: bestDoc.coord.y + (Math.random() * 20 - 10),
            matchedDocId: bestDoc.id
        };
    }
    
    // Default fallback coordinate centered in first quadrant
    return { x: 150, y: 100, matchedDocId: null };
}

// Compute standard cosine similarity in positive coordinates relative to origin (20, 180)
function calculateCosineSimilarity(q, d) {
    const ox = 20;
    const oy = 180;
    
    const qx = q.x - ox;
    const qy = oy - q.y; // Invert Y since canvas coordinates increase downwards
    
    const dx = d.x - ox;
    const dy = oy - d.y;
    
    const dotProduct = qx * dx + qy * dy;
    const magQ = Math.sqrt(qx * qx + qy * qy);
    const magD = Math.sqrt(dx * dx + dy * dy);
    
    if (magQ === 0 || magD === 0) return 0;
    
    const sim = dotProduct / (magQ * magD);
    return Math.max(0, Math.min(1, sim));
}

// Render the glowing 2D Vector Embedding Coordinate grid
function drawRAGVectorSpace(activeQueryText = null) {
    const canvas = document.getElementById('rag-vector-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set internal resolution scaled by retina DPI factor for super sharp texts
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    
    // Deep slate background matching premium terminal themes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw visual grid layout
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 25;
    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    const ox = 25;
    const oy = height - 20;
    
    // Draw 2D Quadrant Axes
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ox, 10);
    ctx.lineTo(ox, oy);
    ctx.lineTo(width - 10, oy);
    ctx.stroke();
    
    // Draw Grid Quadrant Labels
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.font = '8px monospace';
    ctx.fillText('Dim 2 (Semantic Weight)', ox + 6, 16);
    ctx.fillText('Dim 1 (Index Weight)', width - 110, oy - 6);
    
    // Calculate matching coordinates
    let queryCoord = null;
    let matchedDocId = null;
    if (activeQueryText) {
        queryCoord = getQueryVectorCoordinate(activeQueryText.toLowerCase());
        matchedDocId = queryCoord.matchedDocId;
    }
    
    // Scaling helpers mapping bounding box coordinates cleanly
    const scaleX = (x) => ox + (x / 300) * (width - ox - 35);
    const scaleY = (y) => oy - (y / 200) * (oy - 20);
    
    const scaledDocs = ragDocuments.map(doc => ({
        ...doc,
        screenX: scaleX(doc.coord.x),
        screenY: scaleY(doc.coord.y)
    }));
    
    let scaledQuery = null;
    if (queryCoord) {
        scaledQuery = {
            x: scaleX(queryCoord.x),
            y: scaleY(queryCoord.y)
        };
    }
    
    // Fetch slider parameters
    const cutoffSlider = document.getElementById('rag-cutoff-slider');
    const kSlider = document.getElementById('rag-k-slider');
    const cutoffVal = parseFloat(cutoffSlider ? cutoffSlider.value : 0.45);
    const kVal = parseInt(kSlider ? kSlider.value : 3);
    
    // Calculate scores and ranks
    const docScores = scaledDocs.map(doc => {
        const score = queryCoord ? calculateCosineSimilarity(queryCoord, doc) : 0;
        return {
            ...doc,
            score: score
        };
    });
    
    // Sort in descending order to assign ranks
    docScores.sort((a, b) => b.score - a.score);
    
    // 1. Draw distance evaluation lines
    if (scaledQuery) {
        docScores.forEach((doc, idx) => {
            const isRetrieved = idx < kVal && doc.score >= cutoffVal;
            const isNearest = idx === 0 && doc.score >= cutoffVal;
            
            if (!isRetrieved) return; // Only draw paths for active retrieved nodes
            
            ctx.beginPath();
            ctx.moveTo(scaledQuery.x, scaledQuery.y);
            ctx.lineTo(doc.screenX, doc.screenY);
            
            if (isNearest) {
                ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)'; // glowing green path
                ctx.lineWidth = 2;
                ctx.setLineDash([]);
            } else {
                ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)'; // dotted grey paths
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        });
    }
    
    // 2. Plot Document Database Nodes
    docScores.forEach((doc, idx) => {
        const score = doc.score;
        const isNearest = queryCoord && idx === 0 && score >= cutoffVal;
        const isRetrieved = queryCoord && idx < kVal && score >= cutoffVal;
        const isFaded = queryCoord && score < cutoffVal;
        
        ctx.save();
        if (isFaded) {
            ctx.globalAlpha = 0.15; // completely fade nodes below threshold
        }
        
        if (isNearest) {
            // Nearest neighbor pulsing glowing ring
            ctx.beginPath();
            ctx.arc(doc.screenX, doc.screenY, 11, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
            ctx.fill();
        }
        
        ctx.beginPath();
        ctx.arc(doc.screenX, doc.screenY, 5.5, 0, 2 * Math.PI);
        ctx.fillStyle = doc.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        
        // Node labels adjusting for bounding box boundaries
        ctx.fillStyle = isNearest ? '#ffffff' : (isRetrieved ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)');
        ctx.font = isNearest ? 'bold 8.5px monospace' : '8px monospace';
        let textX = doc.screenX + 8;
        let textY = doc.screenY + 3;
        if (textX + 110 > width) {
            textX = doc.screenX - 118;
        }
        ctx.fillText(doc.name, textX, textY);
        ctx.restore();
    });
    
    // 3. Draw active Query Vector dot with continuous micro-pulse halo
    if (scaledQuery) {
        const pulse = 7 + Math.abs(Math.sin(Date.now() / 250) * 4.5);
        ctx.beginPath();
        ctx.arc(scaledQuery.x, scaledQuery.y, pulse, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.18)'; // Rose glow
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(scaledQuery.x, scaledQuery.y, 4.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#f43f5e';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 8px monospace';
        ctx.fillText('Query Vector', scaledQuery.x + 8, scaledQuery.y - 4);
    }
}

// Recalculate cosine similarities and update sidebar leaderboard details
function updateRAGSimilarityUI(activeQueryText) {
    const chunkDisplay = document.getElementById('rag-chunk-display');
    const similarityList = document.getElementById('rag-similarity-list');
    
    const cutoffSlider = document.getElementById('rag-cutoff-slider');
    const kSlider = document.getElementById('rag-k-slider');
    const cutoffVal = parseFloat(cutoffSlider ? cutoffSlider.value : 0.45);
    const kVal = parseInt(kSlider ? kSlider.value : 3);
    
    if (!activeQueryText) {
        if (chunkDisplay) {
            chunkDisplay.innerHTML = `<span style="color: var(--muted)">Query: [No active search]<br>Retrieval context: Ready. Input a question to trigger vector math sweeps...</span>`;
        }
        if (similarityList) {
            similarityList.innerHTML = ragDocuments.map(doc => `
                <div class="rag-similarity-item">
                    <span class="rag-similarity-name">${doc.name}</span>
                    <span class="rag-similarity-score">Cos: 0.0000</span>
                </div>
            `).join('');
        }
        return;
    }
    
    const queryCoord = getQueryVectorCoordinate(activeQueryText.toLowerCase());
    
    const docScores = ragDocuments.map(doc => {
        const score = calculateCosineSimilarity(queryCoord, doc);
        return {
            name: doc.name,
            score: score,
            id: doc.id,
            chunk: doc.chunk
        };
    });
    
    // Sort similarity items in descending order
    docScores.sort((a, b) => b.score - a.score);
    
    let bestDoc = null;
    
    if (similarityList) {
        similarityList.innerHTML = docScores.map((ds, idx) => {
            const isRetrieved = idx < kVal && ds.score >= cutoffVal;
            const isFaded = ds.score < cutoffVal;
            const isHighest = idx === 0 && ds.score >= cutoffVal;
            
            if (isHighest) {
                bestDoc = ds;
            }
            
            let statusText = `Cos: ${ds.score.toFixed(4)}`;
            let textStyle = '';
            
            if (isHighest) {
                textStyle = 'style="color: var(--accent); font-weight: 700; border: 1px solid rgba(var(--accent-raw), 0.3); background: rgba(var(--accent-raw), 0.06);"';
            } else if (isRetrieved) {
                textStyle = 'style="color: var(--primary); font-weight: 600;"';
            } else if (isFaded) {
                textStyle = 'style="opacity: 0.35;"';
                statusText = `Filtered (< ${cutoffVal.toFixed(2)})`;
            } else {
                // Above threshold but rank > K
                textStyle = 'style="opacity: 0.65;"';
                statusText = `Rank #${idx + 1} (> K)`;
            }
            
            return `
                <div class="rag-similarity-item" ${textStyle}>
                    <span class="rag-similarity-name">${ds.name}</span>
                    <span class="rag-similarity-score">${statusText}</span>
                </div>
            `;
        }).join('');
    }
    
    if (chunkDisplay) {
        if (bestDoc) {
            chunkDisplay.innerHTML = `<span class="tag" style="background-color: rgba(var(--accent-raw), 0.15); color: var(--accent); font-size: 0.7rem; padding: 2px 6px; border: 1px solid rgba(var(--accent-raw), 0.2); display: inline-block; margin-bottom: 6px;">INDEX MATCH: ${bestDoc.id.toUpperCase()}</span>
<p style="font-size: 0.85rem; line-height: 1.4; color: var(--text-light); margin: 0;">"${bestDoc.chunk}"</p>`;
        } else {
            chunkDisplay.innerHTML = `<span class="tag" style="background-color: rgba(239, 68, 68, 0.15); color: #ef4444; font-size: 0.7rem; padding: 2px 6px; border: 1px solid rgba(239, 68, 68, 0.2); display: inline-block; margin-bottom: 6px;">NO RETRIEVED CONTEXT</span>
<p style="font-size: 0.85rem; line-height: 1.4; color: var(--text-muted); margin: 0;">No matching documents were found above the current Cosine Similarity Cutoff threshold of ${cutoffVal.toFixed(2)}.</p>`;
        }
    }
}

// Infinite animation loop for micro-animations on RAG canvas
function startRAGAnimationLoop() {
    if (ragAnimationRequest) cancelAnimationFrame(ragAnimationRequest);
    
    function tick() {
        const visualizerPanel = document.getElementById('chatbot-visualizer-body');
        if (visualizerPanel && visualizerPanel.classList.contains('active')) {
            drawRAGVectorSpace(lastRAGQueryText);
            ragAnimationRequest = requestAnimationFrame(tick);
        }
    }
    tick();
}

window.addEventListener('resize', () => {
    const visualizerPanel = document.getElementById('chatbot-visualizer-body');
    if (visualizerPanel && visualizerPanel.classList.contains('active')) {
        drawRAGVectorSpace(lastRAGQueryText);
    }
});

/* =============================================================
   JWT DEBUGGER & CRYPTOGRAPHIC VERIFICATION ENGINE
   ============================================================= */

let sriramSecret = "srirams_hyper_secure_key_2026";

function base64urlEncode(str) {
    const b64 = btoa(unescape(encodeURIComponent(str)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlDecode(str) {
    let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) {
        b64 += '=';
    }
    try {
        return decodeURIComponent(escape(atob(b64)));
    } catch (e) {
        return atob(b64);
    }
}

function mockHmacSha256(headerAndPayload, secret) {
    let hash = 0;
    const combined = headerAndPayload + "." + secret;
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16) + (combined.length * 17).toString(16);
    return base64urlEncode(hex + "_signature");
}

function updateLiveJWT() {
    const headerEditor = document.getElementById('jwt-header-editor');
    const payloadEditor = document.getElementById('jwt-payload-editor');
    const signatureVal = document.getElementById('jwt-signature-val');
    const validationBadge = document.getElementById('jwt-validation-badge');
    const reqHeadersArea = document.getElementById('api-request-headers');

    if (!headerEditor || !payloadEditor || !signatureVal || !validationBadge) {
        return { isValid: false, payload: { id: null } };
    }

    const headerText = headerEditor.value.trim();
    const payloadText = payloadEditor.value.trim();

    let headerObj, payloadObj;
    try {
        headerObj = JSON.parse(headerText);
    } catch(e) {
        validationBadge.textContent = "BAD HEADER";
        validationBadge.className = "api-status-badge status-none";
        validationBadge.style.backgroundColor = "#ef4444";
        return { isValid: false, payload: { id: null } };
    }

    try {
        payloadObj = JSON.parse(payloadText);
    } catch(e) {
        validationBadge.textContent = "BAD PAYLOAD";
        validationBadge.className = "api-status-badge status-none";
        validationBadge.style.backgroundColor = "#ef4444";
        return { isValid: false, payload: { id: null } };
    }

    const headerEncoded = base64urlEncode(JSON.stringify(headerObj));
    const payloadEncoded = base64urlEncode(JSON.stringify(payloadObj));
    
    const currentSig = signatureVal.value.trim();
    const expectedSig = mockHmacSha256(headerEncoded + "." + payloadEncoded, sriramSecret);
    
    const isValid = (currentSig === expectedSig);
    
    if (isValid) {
        validationBadge.textContent = "VALID";
        validationBadge.className = "api-status-badge status-200";
        validationBadge.style.backgroundColor = "#10b981";
    } else {
        validationBadge.textContent = "INVALID / TAMPERED";
        validationBadge.className = "api-status-badge status-none";
        validationBadge.style.backgroundColor = "#ef4444";
    }

    if (reqHeadersArea) {
        try {
            const headers = JSON.parse(reqHeadersArea.value);
            const token = headerEncoded + "." + payloadEncoded + "." + currentSig;
            headers["Authorization"] = "Bearer " + token;
            reqHeadersArea.value = JSON.stringify(headers, null, 2);
        } catch(e) {
            // fallback
        }
    }

    return {
        isValid: isValid,
        header: headerObj,
        payload: payloadObj,
        token: headerEncoded + "." + payloadEncoded + "." + currentSig
    };
}

function signJWT() {
    const headerEditor = document.getElementById('jwt-header-editor');
    const payloadEditor = document.getElementById('jwt-payload-editor');
    const signatureVal = document.getElementById('jwt-signature-val');

    if (!headerEditor || !payloadEditor || !signatureVal) return;

    try {
        const headerObj = JSON.parse(headerEditor.value.trim());
        const payloadObj = JSON.parse(payloadEditor.value.trim());
        
        const headerEncoded = base64urlEncode(JSON.stringify(headerObj));
        const payloadEncoded = base64urlEncode(JSON.stringify(payloadObj));
        
        const sig = mockHmacSha256(headerEncoded + "." + payloadEncoded, sriramSecret);
        signatureVal.value = sig;
        
        updateLiveJWT();
        triggerAPIMockRequest();
    } catch(e) {
        alert("Cannot sign: Invalid JSON syntax in Header or Payload.");
    }
}

function initJWTDebugger() {
    const apiTabHeaders = document.getElementById('api-tab-headers');
    const apiTabJwt = document.getElementById('api-tab-jwt');
    const apiContentHeaders = document.getElementById('api-content-headers');
    const apiContentJwt = document.getElementById('api-content-jwt');
    
    if (apiTabHeaders && apiTabJwt && apiContentHeaders && apiContentJwt) {
        apiTabHeaders.addEventListener('click', () => {
            apiTabHeaders.classList.add('active');
            apiTabHeaders.style.color = '#ffffff';
            apiTabHeaders.style.borderBottomColor = 'var(--accent)';
            
            apiTabJwt.classList.remove('active');
            apiTabJwt.style.color = 'var(--text-muted)';
            apiTabJwt.style.borderBottomColor = 'transparent';
            
            apiContentHeaders.style.display = 'block';
            apiContentJwt.style.display = 'none';
        });
        
        apiTabJwt.addEventListener('click', () => {
            apiTabJwt.classList.add('active');
            apiTabJwt.style.color = '#ffffff';
            apiTabJwt.style.borderBottomColor = 'var(--accent)';
            
            apiTabHeaders.classList.remove('active');
            apiTabHeaders.style.color = 'var(--text-muted)';
            apiTabHeaders.style.borderBottomColor = 'transparent';
            
            apiContentHeaders.style.display = 'none';
            apiContentJwt.style.display = 'flex';
            
            updateLiveJWT();
        });
    }

    const headerEditor = document.getElementById('jwt-header-editor');
    const payloadEditor = document.getElementById('jwt-payload-editor');
    const signatureVal = document.getElementById('jwt-signature-val');
    const signBtn = document.getElementById('jwt-sign-btn');

    if (headerEditor) {
        headerEditor.addEventListener('input', () => {
            updateLiveJWT();
            triggerAPIMockRequest();
        });
    }
    if (payloadEditor) {
        payloadEditor.addEventListener('input', () => {
            updateLiveJWT();
            triggerAPIMockRequest();
        });
    }
    if (signBtn) {
        signBtn.addEventListener('click', signJWT);
    }
    
    if (headerEditor && payloadEditor && signatureVal) {
        try {
            const hEnc = base64urlEncode(JSON.stringify(JSON.parse(headerEditor.value)));
            const pEnc = base64urlEncode(JSON.stringify(JSON.parse(payloadEditor.value)));
            signatureVal.value = mockHmacSha256(hEnc + "." + pEnc, sriramSecret);
        } catch(e) {}
    }
    updateLiveJWT();
}

/* =============================================================
   SSL/TLS 1.3 CRYPTOGRAPHIC HANDSHAKE VISUALIZER
   ============================================================= */

let currentTlsStep = 0;
let tlsAutoPlayInterval = null;
let tlsEncryptedFlowInterval = null;

function spawnTlsPacket(direction, label, color) {
    const container = document.querySelector('.tls-diagram-container');
    if (!container) return;
    
    const packet = document.createElement('div');
    packet.className = 'tls-dynamic-packet';
    
    packet.style.position = 'absolute';
    packet.style.padding = '4px 10px';
    packet.style.borderRadius = '20px';
    packet.style.fontSize = '0.65rem';
    packet.style.fontWeight = 'bold';
    packet.style.fontFamily = 'var(--font-mono)';
    packet.style.whiteSpace = 'nowrap';
    packet.style.pointerEvents = 'none';
    packet.style.zIndex = '10';
    packet.style.boxShadow = '0 0 10px rgba(255,255,255,0.2)';
    packet.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    const isMobile = window.innerWidth <= 768;
    const lineOffset = isMobile ? 40 : 65;
    const packetWidth = 100;
    
    const startLeft = direction === 'client-to-server' ? `${lineOffset}px` : `calc(100% - ${lineOffset}px - ${packetWidth}px)`;
    const endLeft = direction === 'client-to-server' ? `calc(100% - ${lineOffset}px - ${packetWidth}px)` : `${lineOffset}px`;
    
    packet.style.left = startLeft;
    packet.style.opacity = '0';
    packet.style.transform = 'scale(0.8)';
    
    if (direction === 'client-to-server') {
        packet.textContent = label || 'ClientHello ➔';
        packet.style.backgroundColor = color || 'rgba(59, 130, 246, 0.9)';
        packet.style.color = '#ffffff';
        packet.style.border = '1px solid ' + (color || '#3b82f6');
        
        let topVal = '150px';
        if (label && label.includes('Payload')) {
            topVal = '285px';
        } else if (currentTlsStep === 4) {
            topVal = '285px';
        }
        packet.style.top = topVal;
    } else {
        packet.textContent = label || '⮨ ServerHello + Cert';
        packet.style.backgroundColor = color || 'rgba(16, 185, 129, 0.9)';
        packet.style.color = '#ffffff';
        packet.style.border = '1px solid ' + (color || '#10b981');
        
        let topVal = '195px';
        if (label && label.includes('Ack')) {
            topVal = '285px';
        } else if (currentTlsStep === 4) {
            topVal = '285px';
        }
        packet.style.top = topVal;
    }
    
    container.appendChild(packet);
    
    setTimeout(() => {
        packet.style.opacity = '1';
        packet.style.transform = 'scale(1)';
        packet.style.left = endLeft;
    }, 50);
    
    setTimeout(() => {
        packet.style.opacity = '0';
        setTimeout(() => {
            packet.remove();
        }, 300);
    }, 1250);
}

function updateTlsUI() {
    const logBox = document.getElementById('tls-log-box');
    const clientKey = document.getElementById('tls-client-key-indicator');
    const serverKey = document.getElementById('tls-server-key-indicator');
    const clientNode = document.getElementById('tls-node-client');
    const serverNode = document.getElementById('tls-node-server');
    
    const step1 = document.getElementById('tls-step-1');
    const step2 = document.getElementById('tls-step-2');
    const step3 = document.getElementById('tls-step-3');
    const step4 = document.getElementById('tls-step-4');
    
    const btnPrev = document.getElementById('tls-btn-prev');
    const btnNext = document.getElementById('tls-btn-next');
    const btnAuto = document.getElementById('tls-btn-auto');
    const btnReset = document.getElementById('tls-btn-reset');
    
    if (!logBox) return;

    // Phase 7: Live update Wireshark sniffer hexadecimal stream log
    if (typeof updateWiresharkSnifferUI === 'function') {
        updateWiresharkSnifferUI(currentTlsStep);
    }

    const steps = [step1, step2, step3, step4];
    steps.forEach(st => {
        if (st) {
            st.style.opacity = '0.4';
            st.style.background = 'rgba(255,255,255,0.02)';
            st.style.borderColor = 'rgba(255,255,255,0.05)';
            st.style.color = 'var(--text-muted)';
        }
    });

    if (clientKey) clientKey.style.visibility = 'hidden';
    if (serverKey) serverKey.style.visibility = 'hidden';
    if (clientNode) {
        clientNode.style.animation = 'none';
    }
    if (serverNode) {
        serverNode.style.animation = 'none';
    }

    if (btnPrev) btnPrev.disabled = (currentTlsStep === 0);
    if (btnNext) {
        if (currentTlsStep === 4) {
            btnNext.disabled = true;
            btnNext.innerHTML = 'Completed <i data-lucide="check" style="width: 14px; height: 14px; margin-left: 4px;"></i>';
        } else {
            btnNext.disabled = false;
            btnNext.innerHTML = 'Next Step <i data-lucide="chevron-right" style="width: 14px; height: 14px; margin-left: 4px;"></i>';
        }
        lucide.createIcons();
    }

    if (tlsEncryptedFlowInterval) {
        clearInterval(tlsEncryptedFlowInterval);
        tlsEncryptedFlowInterval = null;
    }

    switch (currentTlsStep) {
        case 0:
            logBox.innerHTML = `<span style="color: var(--text-muted)">[SYSTEM INFO] Click "Next Step" or "Auto" to initiate a secure SSL/TLS 1.3 handshake negotiation...</span>`;
            break;
            
        case 1:
            if (step1) {
                step1.style.opacity = '1.0';
                step1.style.background = 'rgba(59, 130, 246, 0.08)';
                step1.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                step1.style.color = '#ffffff';
            }
            if (clientKey) {
                clientKey.style.visibility = 'visible';
                clientKey.textContent = 'x = 0x5F3E';
            }
            if (clientNode) {
                clientNode.style.animation = 'pulseKeyShare 2s infinite ease-in-out';
            }
            
            spawnTlsPacket('client-to-server');
            
            logBox.innerHTML = `
<span style="color: var(--text-muted)">[HANDSHAKE START] SSL/TLS 1.3 Handshake triggered.</span>
<span style="color: #3b82f6">[CLIENT] Generated ephemeral private key x = 0x5F3E</span>
<span style="color: #3b82f6">[CLIENT] Computed Diffie-Hellman public key share:
  A = G^x mod P
    = 2^0x5F3E mod 0xFFFFFFFFFFFFC90F...
    = <span style="color: var(--accent); font-weight: bold;">0x7E9A4B...</span></span>
<span style="color: #ffffff">[CLIENT] Serialized ClientHello and broadcasted packet to remote gateway:
  • Cipher Suite Support: TLS_AES_256_GCM_SHA384
  • Key Share: Curve25519 / DH Group 14
  • Version compatibility: TLS 1.3 (RFC 8446)</span>
            `.trim();
            break;
            
        case 2:
            if (step1) step1.style.opacity = '0.7';
            if (step2) {
                step2.style.opacity = '1.0';
                step2.style.background = 'rgba(16, 185, 129, 0.08)';
                step2.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                step2.style.color = '#ffffff';
            }
            if (clientKey) {
                clientKey.style.visibility = 'visible';
                clientKey.textContent = 'x = 0x5F3E';
            }
            if (serverKey) {
                serverKey.style.visibility = 'visible';
                serverKey.textContent = 'y = 0xAA9C';
            }
            if (serverNode) {
                serverNode.style.animation = 'pulseKeyShareServer 2s infinite ease-in-out';
            }
            
            spawnTlsPacket('server-to-client');
            
            logBox.innerHTML = `
<span style="color: #10b981">[SERVER] Received ClientHello. Gateway negotiated TLS 1.3 protocol interface.</span>
<span style="color: #10b981">[SERVER] Generated ephemeral private key y = 0xAA9C</span>
<span style="color: #10b981">[SERVER] Computed Diffie-Hellman public key share:
  B = G^y mod P
    = 2^0xAA9C mod 0xFFFFFFFFFFFFC90F...
    = <span style="color: var(--accent); font-weight: bold;">0xBC34F1...</span></span>
<span style="color: #ffffff">[SERVER] Serialized ServerHello response:
  • Selected Cipher Suite: TLS_AES_256_GCM_SHA384
  • Server Key Share: Curve25519 / DH Group 14 (0xBC34F1...)
  • Certificate Identity: CN=sai-sriram-gateway.tcs.com
  • Signature: SHA256withRSA verifying gateway authentication.</span>
            `.trim();
            break;
            
        case 3:
            if (step1) step1.style.opacity = '0.7';
            if (step2) step2.style.opacity = '0.7';
            if (step3) {
                step3.style.opacity = '1.0';
                step3.style.background = 'rgba(245, 158, 11, 0.08)';
                step3.style.borderColor = 'rgba(245, 158, 11, 0.2)';
                step3.style.color = '#ffffff';
            }
            if (clientKey) {
                clientKey.style.visibility = 'visible';
                clientKey.textContent = 'x = 0x5F3E';
            }
            if (serverKey) {
                serverKey.style.visibility = 'visible';
                serverKey.textContent = 'y = 0xAA9C';
            }
            if (clientNode) {
                clientNode.style.animation = 'pulseKeyShare 2s infinite ease-in-out';
            }
            if (serverNode) {
                serverNode.style.animation = 'pulseKeyShareServer 2s infinite ease-in-out';
            }
            
            logBox.innerHTML = `
<span style="color: var(--accent)">[COMPUTATION] Handshake packets exchanged. Computing symmetrical session keys:</span>
<span style="color: #3b82f6">[CLIENT] S = B^x mod P
    = (0xBC34F1...)^0x5F3E mod 0xFFFFFFFFFFFFC90F...
    = <span style="color: #10b981; font-weight: bold;">0xD4B87E...</span></span>
<span style="color: #10b981">[SERVER] S = A^y mod P
    = (0x7E9A4B...)^0xAA9C mod 0xFFFFFFFFFFFFC90F...
    = <span style="color: #10b981; font-weight: bold;">0xD4B87E...</span></span>
<span style="color: #10b981; font-weight: bold;">[SUCCESS] Cryptographic Shared Secrets Match! (S_Client == S_Server)</span>
<span style="color: #ffffff">[KDF] Derived symmetric encryption keys using HKDF:
  • Client Write Key (Symmetric AES-GCM): 0x8E1256...
  • Server Write Key (Symmetric AES-GCM): 0x9F4C7A...
  • Perfect Forward Secrecy: ACTIVE</span>
            `.trim();
            break;
            
        case 4:
            if (step1) step1.style.opacity = '0.7';
            if (step2) step2.style.opacity = '0.7';
            if (step3) step3.style.opacity = '0.7';
            if (step4) {
                step4.style.opacity = '1.0';
                step4.style.background = 'rgba(16, 185, 129, 0.12)';
                step4.style.borderColor = '#10b981';
                step4.style.color = '#ffffff';
            }
            if (clientKey) {
                clientKey.style.visibility = 'visible';
                clientKey.textContent = 'x = 0x5F3E';
            }
            if (serverKey) {
                serverKey.style.visibility = 'visible';
                serverKey.textContent = 'y = 0xAA9C';
            }
            
            triggerTlsEncryptedDataFlow();
            
            logBox.innerHTML = `
<span style="color: #10b981; font-weight: bold;">[SECURE SESSION ACTIVE] Handshake completed successfully.</span>
<span style="color: #ffffff">[CLIENT] Sent Finished authentication block (Encrypted with S_Client)</span>
<span style="color: #ffffff">[SERVER] Sent Finished authentication block (Encrypted with S_Server)</span>
<span style="color: #10b981; font-weight: bold;">[STATUS] All further data transferred between Client and Server is now encrypted with the symmetrical session key. Zero plain-text leaks possible.</span>
<span style="color: var(--accent); font-weight: bold;">[CONGRATULATIONS] You successfully executed a full SSL/TLS 1.3 handshake and secured the channel against eavesdropping!</span>
            `.trim();
            
            if (typeof unlockBadge === 'function') {
                unlockBadge('tls_handshake', 'TLS Protocol Master', 'Congratulations! You successfully executed a full SSL/TLS 1.3 cryptographic handshake and derived symmetric session keys!');
            }
            break;
    }
    
    logBox.scrollTop = logBox.scrollHeight;
}

function triggerTlsEncryptedDataFlow() {
    if (tlsEncryptedFlowInterval) clearInterval(tlsEncryptedFlowInterval);
    
    spawnTlsPacket('client-to-server', 'Encrypted Payload ➔', '#10b981');
    setTimeout(() => {
        if (currentTlsStep === 4) {
            spawnTlsPacket('server-to-client', '⮨ Encrypted Ack', '#3b82f6');
        }
    }, 700);

    tlsEncryptedFlowInterval = setInterval(() => {
        if (currentTlsStep !== 4) {
            clearInterval(tlsEncryptedFlowInterval);
            tlsEncryptedFlowInterval = null;
            return;
        }
        spawnTlsPacket('client-to-server', 'Encrypted Payload ➔', '#10b981');
        setTimeout(() => {
            if (currentTlsStep === 4) {
                spawnTlsPacket('server-to-client', '⮨ Encrypted Ack', '#3b82f6');
            }
        }, 700);
    }, 2000);
}

function clearTlsAutoPlay() {
    if (tlsAutoPlayInterval) {
        clearInterval(tlsAutoPlayInterval);
        tlsAutoPlayInterval = null;
    }
    const btnAuto = document.getElementById('tls-btn-auto');
    if (btnAuto) {
        btnAuto.innerHTML = '<i data-lucide="play" style="width: 14px; height: 14px; margin-right: 4px;"></i> Auto';
        lucide.createIcons();
    }
}

function initTlsSandbox() {
    const btnPrev = document.getElementById('tls-btn-prev');
    const btnNext = document.getElementById('tls-btn-next');
    const btnAuto = document.getElementById('tls-btn-auto');
    const btnReset = document.getElementById('tls-btn-reset');
    
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            clearTlsAutoPlay();
            if (currentTlsStep > 0) {
                currentTlsStep--;
                updateTlsUI();
            }
        });
    }
    
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            clearTlsAutoPlay();
            if (currentTlsStep < 4) {
                currentTlsStep++;
                updateTlsUI();
            }
        });
    }
    
    if (btnAuto) {
        btnAuto.addEventListener('click', () => {
            if (tlsAutoPlayInterval) {
                clearTlsAutoPlay();
            } else {
                btnAuto.innerHTML = '<i data-lucide="pause" style="width: 14px; height: 14px; margin-right: 4px;"></i> Pause';
                lucide.createIcons();
                
                if (currentTlsStep === 4) {
                    currentTlsStep = 0;
                    updateTlsUI();
                }
                
                tlsAutoPlayInterval = setInterval(() => {
                    if (currentTlsStep < 4) {
                        currentTlsStep++;
                        updateTlsUI();
                    } else {
                        clearTlsAutoPlay();
                    }
                }, 3000);
            }
        });
    }
    
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            clearTlsAutoPlay();
            currentTlsStep = 0;
            updateTlsUI();
        });
    }
    
    updateTlsUI();
}

/* =============================================================
   RAG PARAMETER CONTROLLERS
   ============================================================= */

function initRAGSliders() {
    const cutoffSlider = document.getElementById('rag-cutoff-slider');
    const kSlider = document.getElementById('rag-k-slider');
    const cutoffValText = document.getElementById('rag-cutoff-val');
    const kValText = document.getElementById('rag-k-val');
    
    if (cutoffSlider) {
        cutoffSlider.addEventListener('input', () => {
            if (cutoffValText) cutoffValText.textContent = parseFloat(cutoffSlider.value).toFixed(2);
            drawRAGVectorSpace(lastRAGQueryText);
            updateRAGSimilarityUI(lastRAGQueryText);
        });
    }
    if (kSlider) {
        kSlider.addEventListener('input', () => {
            if (kValText) kValText.textContent = kSlider.value;
            drawRAGVectorSpace(lastRAGQueryText);
            updateRAGSimilarityUI(lastRAGQueryText);
        });
    }
}

/* =============================================================
   CTF PERSISTENCE & CONSOLE ACHIEVEMENTS TABLE
   ============================================================= */

function getUnlockedBadges() {
    try {
        const data = localStorage.getItem('sriram_ctf_badges');
        return data ? JSON.parse(data) : {};
    } catch (e) {
        return {};
    }
}

function unlockBadge(badgeKey, title, description) {
    const unlocked = getUnlockedBadges();
    if (!unlocked[badgeKey]) {
        unlocked[badgeKey] = {
            unlockedAt: new Date().toISOString(),
            title: title,
            description: description
        };
        try {
            localStorage.setItem('sriram_ctf_badges', JSON.stringify(unlocked));
        } catch (e) {
            console.error("Failed to save to localStorage", e);
        }
        
        const modal = document.getElementById('ctf-achievement-modal');
        if (modal) {
            const modalTitle = modal.querySelector('.ctf-modal-title');
            const modalDesc = modal.querySelector('.ctf-modal-desc');
            if (modalTitle) modalTitle.textContent = title.toUpperCase();
            if (modalDesc) modalDesc.textContent = description;
            
            modal.style.display = 'flex';
            if (typeof triggerExplodingFireworks === 'function') {
                triggerExplodingFireworks();
            }
        }
    }
}

function initCTFBadgeState() {
    // Carry over secure coding badge from localStorage if it's already set in another session
}

function renderAchievementsConsole() {
    const unlocked = getUnlockedBadges();
    
    const badgesList = [
        {
            key: 'secure_coder',
            title: 'SECURE CODING MASTER',
            desc: 'Unlocked via buffer overflow flag verification',
            lockedDesc: 'Locked. Exploit buffer overflow in inspect console and submit flag'
        },
        {
            key: 'api_bola',
            title: 'API SECURITY AUDITOR',
            desc: 'Unlocked via BOLA security gateway claim mitigation',
            lockedDesc: 'Locked. Enable API secure mitigation and verify authorized gateway'
        },
        {
            key: 'tls_handshake',
            title: 'TLS PROTOCOL MASTER',
            desc: 'Unlocked via TLS 1.3 handshake sequence completion',
            lockedDesc: 'Locked. Step through the TLS 1.3 handshake visualizer'
        }
    ];

    let unlockedCount = 0;
    badgesList.forEach(b => {
        if (unlocked[b.key]) unlockedCount++;
    });

    const percent = Math.round((unlockedCount / badgesList.length) * 100);
    const barWidth = 20;
    const filledWidth = Math.round((unlockedCount / badgesList.length) * barWidth);
    const emptyWidth = barWidth - filledWidth;
    const progressBar = '█'.repeat(filledWidth) + '░'.repeat(emptyWidth);

    function padLine(leftPartText, totalInsideWidth = 74) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = leftPartText;
        const visualText = tempDiv.textContent || tempDiv.innerText || "";
        const visualLength = visualText.length;
        const paddingCount = Math.max(0, totalInsideWidth - visualLength);
        return leftPartText + ' '.repeat(paddingCount);
    }

    let output = '';
    output += `<span style="color: var(--accent); font-family: var(--font-mono); font-weight: bold; white-space: pre; display: block; line-height: 1.2;">`;
    output += `╔══════════════════════════════════════════════════════════════════════════╗<br>`;
    output += `║               🏆 SAI SRIRAM'S PORTFOLIO CTF ACHIEVEMENTS 🏆             ║<br>`;
    output += `╠══════════════════════════════════════════════════════════════════════════╣<br>`;
    output += `║${padLine(' ')}║<br>`;
    
    badgesList.forEach(b => {
        const isUnlocked = !!unlocked[b.key];
        const marker = isUnlocked ? `<span style="color: #10b981; font-weight: bold;">[✔]</span>` : `<span style="color: #64748b;">[ ]</span>`;
        const titleColor = isUnlocked ? '#ffffff' : '#64748b';
        const descText = isUnlocked ? b.desc : b.lockedDesc;
        const descColor = isUnlocked ? 'var(--text-light)' : '#64748b';

        output += `║${padLine(`  ${marker} <span style="color: ${titleColor}; font-weight: bold;">${b.title}</span>`)}║<br>`;
        output += `║${padLine(`      └─ <span style="color: ${descColor}; font-size: 0.70rem;">${descText}</span>`)}║<br>`;
        output += `║${padLine(' ')}║<br>`;
    });

    output += `╠══════════════════════════════════════════════════════════════════════════╣<br>`;
    output += `║${padLine(' ')}║<br>`;
    const completionStr = `Completion: [${progressBar}] ${percent}% (${unlockedCount}/${badgesList.length} Badges Unlocked)`;
    output += `║${padLine(`  <span style="color: #ffffff; font-weight: bold;">${completionStr}</span>`)}║<br>`;
    output += `║${padLine(' ')}║<br>`;
    output += `╚══════════════════════════════════════════════════════════════════════════╝`;
    output += `</span>`;

    return output;
}

// Phase 7: FHE Cryptographic Key Vault & Noise budget updater
function updateFHEKeysAndNoise(v, t, r) {
    if (isFheBootstrapping) return;

    const noiseValEl = document.getElementById('fhe-noise-val');
    const noiseBarEl = document.getElementById('fhe-noise-bar');
    const noiseWarningEl = document.getElementById('fhe-noise-warning');
    const keySecretEl = document.getElementById('fhe-key-secret');
    const keyRlkEl = document.getElementById('fhe-key-rlk');

    let noise = 80.0 - (Math.abs(v - 3.70) * 20.0) - (Math.abs(t - 25.0) * 1.1) - ((r - 1.20) * 9.0);
    noise = Math.max(0.0, Math.min(80.0, noise));

    if (noiseValEl) {
        noiseValEl.textContent = `${noise.toFixed(1)} dB`;
        if (noise < 20.0) {
            noiseValEl.style.color = '#ef4444';
        } else if (noise < 50.0) {
            noiseValEl.style.color = '#f59e0b';
        } else {
            noiseValEl.style.color = '#10b981';
        }
    }

    if (noiseBarEl) {
        noiseBarEl.style.width = `${(noise / 80.0) * 100}%`;
    }

    if (noiseWarningEl) {
        noiseWarningEl.style.display = noise < 20.0 ? 'block' : 'none';
    }

    const secretKeySeed = Math.floor((v * 1245 + t * 67 + r * 9) * 1000);
    const secretKeyHex = "0x" + secretKeySeed.toString(16).toUpperCase().substring(0, 4) + "..." + (secretKeySeed * 3).toString(16).toUpperCase().substring(0, 4);
    
    const relinKeySeed = Math.floor((v * 9876 + t * 54 + r * 3) * 1000);
    const relinKeyHex = "0x" + relinKeySeed.toString(16).toUpperCase().substring(0, 4) + "..." + (relinKeySeed * 7).toString(16).toUpperCase().substring(0, 4);

    if (keySecretEl) keySecretEl.textContent = secretKeyHex;
    if (keyRlkEl) keyRlkEl.textContent = relinKeyHex;

    currentFheNoiseBudget = noise;
}

// Phase 7: RAG vector space slide-out drawer management
function openRAGDrawer(doc) {
    const drawer = document.getElementById('rag-node-drawer');
    const titleEl = document.getElementById('rag-drawer-title');
    const textEl = document.getElementById('rag-drawer-text');
    const embeddingsEl = document.getElementById('rag-drawer-embeddings');
    const scoreValEl = document.getElementById('rag-drawer-score-val');

    if (titleEl) titleEl.textContent = doc.name;
    if (textEl) textEl.textContent = doc.chunk;

    if (embeddingsEl) {
        const floats = [];
        const seed = doc.name.length;
        for (let i = 0; i < 40; i++) {
            floats.push((Math.sin(i * seed) * 0.15).toFixed(6));
        }
        embeddingsEl.textContent = `[${floats.join(', ')}, \n... \n${(Math.cos(seed) * 0.12).toFixed(6)}]`;
    }

    if (scoreValEl) {
        let score = 0.8932;
        if (lastRAGQueryText) {
            const queryCoord = getQueryVectorCoordinate(lastRAGQueryText.toLowerCase());
            score = calculateCosineSimilarity(queryCoord, doc);
        } else {
            const defaults = {
                "fhe-paper-2026": 0.9412,
                "edl-paper-2025": 0.8765,
                "tcs-resume": 0.9124,
                "fullstack-projects": 0.8543
            };
            score = defaults[doc.id] || 0.8932;
        }
        scoreValEl.textContent = score.toFixed(4);
    }

    if (drawer) {
        drawer.classList.add('active');
    }
}

// Phase 7: RAG Canvas click coordinate mapping & hover indicators
function initRAGCanvasInteraction() {
    const canvas = document.getElementById('rag-vector-canvas');
    if (!canvas) return;

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        let clickedDoc = null;
        let minDistance = 15;

        const width = rect.width;
        const height = rect.height;
        const ox = 25;
        const oy = height - 20;

        const scaleX = (x) => ox + (x / 300) * (width - ox - 35);
        const scaleY = (y) => oy - (y / 200) * (oy - 20);

        ragDocuments.forEach(doc => {
            const screenX = scaleX(doc.coord.x);
            const screenY = scaleY(doc.coord.y);
            const dist = Math.hypot(clickX - screenX, clickY - screenY);
            if (dist < minDistance) {
                minDistance = dist;
                clickedDoc = doc;
            }
        });

        if (clickedDoc) {
            openRAGDrawer(clickedDoc);
        }
    });

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const width = rect.width;
        const height = rect.height;
        const ox = 25;
        const oy = height - 20;

        const scaleX = (x) => ox + (x / 300) * (width - ox - 35);
        const scaleY = (y) => oy - (y / 200) * (oy - 20);

        let overNode = false;
        ragDocuments.forEach(doc => {
            const screenX = scaleX(doc.coord.x);
            const screenY = scaleY(doc.coord.y);
            const dist = Math.hypot(mouseX - screenX, mouseY - screenY);
            if (dist < 15) {
                overNode = true;
            }
        });

        canvas.style.cursor = overNode ? 'pointer' : 'default';
    });

    const drawerCloseBtn = document.getElementById('rag-drawer-close-btn');
    const drawerOverlay = document.getElementById('rag-node-drawer');
    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', () => {
            if (drawerOverlay) drawerOverlay.classList.remove('active');
        });
    }
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', (e) => {
            if (e.target === drawerOverlay) {
                drawerOverlay.classList.remove('active');
            }
        });
    }
}

// Phase 7: Google Scholar metrics observer with count-up animations
function initScholarObserver() {
    const target = document.querySelector('.publications-metrics-grid');
    if (!target) return;

    const animateCount = (el, targetVal, durationMs) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
            el.textContent = Math.floor(progress * targetVal);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = targetVal;
            }
        };
        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const citationsEl = document.getElementById('scholar-citations');
                const hindexEl = document.getElementById('scholar-hindex');
                const i10indexEl = document.getElementById('scholar-i10index');

                if (citationsEl) animateCount(citationsEl, 42, 1500);
                if (hindexEl) animateCount(hindexEl, 4, 1500);
                if (i10indexEl) animateCount(i10indexEl, 2, 1500);

                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    observer.observe(target);
}

// Phase 7: Wireshark style split pane tabs controller
function initTlsTabs() {
    const tabDetails = document.getElementById('tls-tab-details');
    const tabWireshark = document.getElementById('tls-tab-wireshark');
    const panelDetails = document.getElementById('tls-panel-details');
    const panelWireshark = document.getElementById('tls-panel-wireshark');

    if (tabDetails && tabWireshark && panelDetails && panelWireshark) {
        tabDetails.addEventListener('click', () => {
            tabDetails.classList.add('active');
            tabDetails.style.color = 'var(--accent)';
            tabDetails.style.borderBottomColor = 'var(--accent)';
            
            tabWireshark.classList.remove('active');
            tabWireshark.style.color = 'var(--text-muted)';
            tabWireshark.style.borderBottomColor = 'transparent';

            panelDetails.style.display = 'flex';
            panelWireshark.style.display = 'none';
        });

        tabWireshark.addEventListener('click', () => {
            tabWireshark.classList.add('active');
            tabWireshark.style.color = 'var(--accent)';
            tabWireshark.style.borderBottomColor = 'var(--accent)';
            
            tabDetails.classList.remove('active');
            tabDetails.style.color = 'var(--text-muted)';
            tabDetails.style.borderBottomColor = 'transparent';

            panelWireshark.style.display = 'flex';
            panelDetails.style.display = 'none';
        });
    }
}

// Phase 7: Wireshark live packet stream generator and inspect view
function updateWiresharkSnifferUI(step) {
    const streamEl = document.getElementById('tls-wireshark-stream');
    if (!streamEl) return;

    if (step === 0) {
        streamEl.innerHTML = `<div style="color: #64748b; font-style: italic;">[CONSOLE] Awaiting active handshake packets...</div>`;
        return;
    }

    const packets = {
        1: `
            <div class="wireshark-packet" style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="toggleWiresharkPacketDetail('pkt-1')">
                    <span style="color: #3b82f6; font-weight: bold;">[Frame #1] Client Hello (Client ➔ Server)</span>
                    <span style="font-size: 0.65rem; color: var(--text-muted);">512 Bytes</span>
                </div>
                <div style="font-family: monospace; font-size: 0.7rem; color: #94a3b8; background: #07090b; padding: 8px; border-radius: 4px; margin-top: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.03);" onclick="toggleWiresharkPacketDetail('pkt-1')">
                    <span style="color: #f59e0b; font-weight: bold;">16 03 03 02 00</span> <span style="color: #10b981; font-weight: bold;">01 00 01 FC 03 03</span> 5F 3E 00 00 20 7E 9A 4B 8F C2 93 AA BC E4 D5 ...
                </div>
                <div id="pkt-1" class="wireshark-detail" style="display: none; padding: 8px; margin-top: 6px; border-left: 2px solid #3b82f6; background: rgba(59, 130, 246, 0.04); font-size: 0.7rem; color: #cbd5e1; line-height: 1.4;">
                    <strong>▼ Frame 1: 512 bytes on wire</strong><br>
                    &nbsp;&nbsp;▼ Transmission Control Protocol, Src Port: 52148, Dst Port: 443<br>
                    &nbsp;&nbsp;▼ Transport Layer Security<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;▼ TLSv1.3 Record Layer: Handshake Protocol: Client Hello<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content Type: Handshake (22)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Version: TLS 1.2 (0x0303)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Length: 507<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼ Handshake Protocol: Client Hello<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Handshake Type: Client Hello (1)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Version: TLS 1.3 (0x0304)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Client Random: 5F3E0000207E9A4B8FC293AABCE4D5...<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cipher Suites (1 suite): TLS_AES_256_GCM_SHA384 (0x1302)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼ Extension: key_share (Curve25519)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Group: x25519 (29)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Key Exchange: 0x7E9A4B...
                </div>
            </div>
        `,
        2: `
            <div class="wireshark-packet" style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="toggleWiresharkPacketDetail('pkt-2')">
                    <span style="color: #10b981; font-weight: bold;">[Frame #2] Server Hello &amp; Certificates (Server ➔ Client)</span>
                    <span style="font-size: 0.65rem; color: var(--text-muted);">1420 Bytes</span>
                </div>
                <div style="font-family: monospace; font-size: 0.7rem; color: #94a3b8; background: #07090b; padding: 8px; border-radius: 4px; margin-top: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.03);" onclick="toggleWiresharkPacketDetail('pkt-2')">
                    <span style="color: #f59e0b; font-weight: bold;">16 03 03 05 8C</span> <span style="color: #10b981; font-weight: bold;">02 00 00 4C 03 03</span> AA 9C 00 00 20 BC 34 F1 99 DA 7B D9 CF E1 2A ...
                </div>
                <div id="pkt-2" class="wireshark-detail" style="display: none; padding: 8px; margin-top: 6px; border-left: 2px solid #10b981; background: rgba(16, 185, 129, 0.04); font-size: 0.7rem; color: #cbd5e1; line-height: 1.4;">
                    <strong>▼ Frame 2: 1420 bytes on wire</strong><br>
                    &nbsp;&nbsp;▼ Transmission Control Protocol, Src Port: 443, Dst Port: 52148<br>
                    &nbsp;&nbsp;▼ Transport Layer Security<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;▼ TLSv1.3 Record Layer: Handshake Protocol: Server Hello<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content Type: Handshake (22)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Version: TLS 1.2 (0x0303)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Length: 1415<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼ Handshake Protocol: Server Hello<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Handshake Type: Server Hello (2)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Version: TLS 1.3 (0x0304)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Server Random: AA9C000020BC34F199DA7BD9CFE12A...<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Selected Cipher: TLS_AES_256_GCM_SHA384 (0x1302)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼ Extension: key_share (Curve25519)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Group: x25519 (29)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Key Exchange: 0xBC34F1...<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼ Certificates (CN=sai-sriram-gateway.tcs.com)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Verified Signature: SHA256withRSA verifying gateway authentication
                </div>
            </div>
        `,
        3: `
            <div class="wireshark-packet" style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="toggleWiresharkPacketDetail('pkt-3')">
                    <span style="color: #f59e0b; font-weight: bold;">[Frame #3] Client Key Exchange &amp; Derivation (Local Processing)</span>
                    <span style="font-size: 0.65rem; color: var(--text-muted);">Internal Event</span>
                </div>
                <div style="font-family: monospace; font-size: 0.7rem; color: #94a3b8; background: #07090b; padding: 8px; border-radius: 4px; margin-top: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.03);" onclick="toggleWiresharkPacketDetail('pkt-3')">
                    <span style="color: #f43f5e; font-weight: bold;">[HKDF-Derive]</span> Input: S_Shared_Secret (0xD4B87E...) -> Derived ClientWriteKey (0x8E1256...)
                </div>
                <div id="pkt-3" class="wireshark-detail" style="display: none; padding: 8px; margin-top: 6px; border-left: 2px solid #f59e0b; background: rgba(245, 158, 11, 0.04); font-size: 0.7rem; color: #cbd5e1; line-height: 1.4;">
                    <strong>▼ Key Derivation Milestone</strong><br>
                    &nbsp;&nbsp;▼ Local Cryptographic Processor<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;Symmetrical Shared Secret: 0xD4B87E...<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;▼ HKDF Extract &amp; Expand (RFC 5869)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PRK (Pseudorandom Key) = HMAC-SHA256(Salt, S_Shared_Secret)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Client Write Key = HKDF-Expand(PRK, "c e traffic", 32) -> 0x8E1256...<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Server Write Key = HKDF-Expand(PRK, "s e traffic", 32) -> 0x9F4C7A...<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Symmetric Encryption Engine initialized (AES-256-GCM)
                </div>
            </div>
        `,
        4: `
            <div class="wireshark-packet" style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="toggleWiresharkPacketDetail('pkt-4')">
                    <span style="color: var(--accent); font-weight: bold;">[Frame #4] Application Data (Bi-directional Encrypted Stream)</span>
                    <span style="font-size: 0.65rem; color: var(--text-muted);">98 Bytes</span>
                </div>
                <div style="font-family: monospace; font-size: 0.7rem; color: #94a3b8; background: #07090b; padding: 8px; border-radius: 4px; margin-top: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.03);" onclick="toggleWiresharkPacketDetail('pkt-4')">
                    <span style="color: #a855f7; font-weight: bold;">17 03 03 00 62</span> <span style="color: #60a5fa; font-weight: bold;">[AES-GCM Encrypted Payload]</span> 3D E4 8C 9F 10 A2 84 BC 92 F0 11 D3 ...
                </div>
                <div id="pkt-4" class="wireshark-detail" style="display: none; padding: 8px; margin-top: 6px; border-left: 2px solid var(--accent); background: rgba(168, 85, 247, 0.04); font-size: 0.7rem; color: #cbd5e1; line-height: 1.4;">
                    <strong>▼ Frame 4: 98 bytes on wire</strong><br>
                    &nbsp;&nbsp;▼ Transmission Control Protocol, Src Port: 52148, Dst Port: 443<br>
                    &nbsp;&nbsp;▼ Transport Layer Security<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;▼ TLSv1.3 Record Layer: Encrypted Application Data<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content Type: Application Data (23)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Version: TLS 1.2 (0x0303)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Length: 93<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼ Encrypted Application Data: 3DE48C9F10A284BC92F011D3...<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Decrypted Plaintext: "GET /admin/stats HTTP/1.1\\r\\nHost: sai-sriram.tcs.com\\r\\n..."<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Decryption status: AUTHENTIC (Tag verified successfully)
                </div>
            </div>
        `
    };

    let accumulatedHTML = "";
    for (let i = 1; i <= step; i++) {
        if (packets[i]) {
            accumulatedHTML += packets[i];
        }
    }
    streamEl.innerHTML = accumulatedHTML;
    streamEl.scrollTop = streamEl.scrollHeight;
}

window.toggleWiresharkPacketDetail = function(id) {
    const detailEl = document.getElementById(id);
    if (detailEl) {
        const isHidden = detailEl.style.display === 'none' || !detailEl.style.display;
        detailEl.style.display = isHidden ? 'block' : 'none';
    }
};


