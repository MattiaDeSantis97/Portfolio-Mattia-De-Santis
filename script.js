// Dati del CV
const experienceData = [
    {
        role: "Credit Care Specialist",
        company: "Europa Factor Spa",
        period: "2025 - Present",
        description: "Managed portfolio of overdue accounts and negotiated settlements."
    },
    {
        role: "Personal Trainer",
        company: "SSD Fonte Meravigliosa",
        period: "2024 - 2025",
        description: "Managed team and daily problem-solving for facility management."
    },
    {
        role: "Financial and Technical Employee",
        company: "Blitz Antincendio Srl",
        period: "2023 - 2024",
        description: "Operational management of contracts and supplier coordination."
    }
];

const educationData = [
    {
        degree: "Bachelor's in Computer Engineering and AI",
        school: "Epicode Institute of Technology",
        period: "2025 - Present"
    },
    {
        degree: "Master of Sports and Lifestyle Management",
        school: "Rome Business School",
        period: "2023 - 2024"
    },
    {
        degree: "Bachelor's of Sport Sciences",
        school: "University of Foro Italico of Rome",
        period: "2017 - 2023"
    }
];

// Esecuzione al caricamento della pagina
document.addEventListener('DOMContentLoaded', function() {
    
    // Caricamento Dati Resume
    loadExperience();
    loadEducation();
    
    // Logica Hamburger Menu (Mobile)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    // Toggle menu al click dell'icona
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Chiudi il menu quando si clicca su un link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Smooth Scrolling (per navigazione fluida)
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            // Se è un link interno (inizia con #)
            if(targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if(targetSection) {
                    window.scrollTo({
                        // Sottrae 80px per compensare l'header fisso
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Gestione Form (Simulazione)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            if (name) {
                alert(`Grazie ${name}, messaggio inviato con successo!`);
                contactForm.reset();
            }
        });
    }

    console.log("Portfolio di Mattia De Santis caricato.");
});

// Funzione per generare lista Esperienze
function loadExperience() {
    const container = document.getElementById('experience-list');
    if (!container) return;

    experienceData.forEach(function(job) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h4>${job.role}</h4>
            <span>${job.company} | ${job.period}</span>
            <p>${job.description}</p>
        `;
        container.appendChild(card);
    });
}

// Funzione per generare lista Educazione
function loadEducation() {
    const container = document.getElementById('education-list');
    if (!container) return;

    educationData.forEach(function(edu) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h4>${edu.degree}</h4>
            <span>${edu.school} | ${edu.period}</span>
        `;
        container.appendChild(card);
    });
}