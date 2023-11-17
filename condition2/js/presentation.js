// JavaScript (presentation.js)
const slides = document.querySelectorAll('.slide');
const noteInput = document.getElementById('note-input');
let currentSlide = 0;

// Sample presenter notes for each slide
const sampleNotes = [
    "These are presenter notes for Slide 1.",
    "Presenter notes for Slide 2.",
];

// Load saved notes from local storage or use the sample notes
sampleNotes[currentSlide] = getPresenterNotes(currentSlide);
noteInput.value = sampleNotes[currentSlide];

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        nextSlide();
    } else if (event.key === 'ArrowLeft') {
        previousSlide();
    }
});

noteInput.addEventListener('input', () => {
    // Auto-save presenter notes to local storage
    savePresenterNotes(currentSlide, noteInput.value);
});

function nextSlide() {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateSlide();
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlide();
    }
}

function updateSlide() {
    slides.forEach((slide, index) => {
        slide.style.display = index === currentSlide ? 'block' : 'none';
    });

    // Load saved notes from local storage or use the sample notes
    sampleNotes[currentSlide] = getPresenterNotes(currentSlide);
    noteInput.value = sampleNotes[currentSlide];
}

function savePresenterNotes(slideIndex, notes) {
    localStorage.setItem(`slide_${slideIndex}_notes`, notes);
}

function getPresenterNotes(slideIndex) {
    return localStorage.getItem(`slide_${slideIndex}_notes`) || sampleNotes[slideIndex];
}

updateSlide();e();