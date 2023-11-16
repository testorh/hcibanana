class SlidesComponent extends HTMLElement {
    constructor() {
        super();
        this.subjects = {
            introtoit: {
                slides: ["./images/introtoit/page1.png", "./images/introtoit/page2.png",
                "./images/introtoit/page3.png","./images/introtoit/page4.png",
                "./images/introtoit/page5.png","./images/introtoit/page6.png" /* more images */]
            },
            databasedesign: {
                slides: ["./images/databasedesign/page1.png", "./images/databasedesign/page2.png",
                "./images/databasedesign/page3.png","./images/databasedesign/page4.png",
                "./images/databasedesign/page5.png","./images/databasedesign/page6.png" /* more images */]
            },
            ethics: {
                slides: ["./images/ethics/page1.png", "./images/ethics/page2.png",
                "./images/ethics/page3.png","./images/ethics/page4.png",
                "./images/ethics/page5.png","./images/ethics/page6.png" /* more images */]
            }
        };
        this.urlParams = new URLSearchParams(window.location.search);
        this.subject = this.urlParams.get('subject');
        this.currentSlide = 1;
    }

    connectedCallback() {
        this.innerHTML = `
        <div class="slides">
        <!-- Navigation bar -->
        <div id="navBar" class="nav-bar">
          <span id="slideNumber">Slide 1/1</span>
          <div class="nav-buttons">
            <button id="prevButton" class="nav-button" onclick="this.getRootNode().host.changeSlide(-1)">
                <i class='fa fa-caret-left'></i>
            </button>
            <button id="nextButton" class="nav-button" onclick="this.getRootNode().host.changeSlide(1)">
            <i class='fa fa-caret-right'></i>
            </button>
          </div>
        </div>
        <!-- Display your slides here -->
        <div id="slidesContainer"></div>
      </div>
        `;
        this.initializeSlides();
        const slidebar = this.querySelector("#navBar");
        const slideImage = this.querySelector(".img-slide");
        const slide = this.querySelector(".slide");
        const slidesContainer = this.querySelector(".slidesContainer");
        console.log("Slide is ");
        console.log(slide);
        this.attachResizeObserver();
    }
    attachResizeObserver(){

        const slidebar = this.querySelector("#navBar");
        const slidesContainer = this.querySelector(".slidesContainer");
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const target = entry.target;
                const { width, height } = target.getBoundingClientRect();
                // console.log(target);
                // console.log(target.getBoundingClientRect());
                slidebar.style.width = width * 0.9;
            }
        });
        resizeObserver.observe(slidesContainer);
    }

    initializeSlides() {
        this.prevButton = this.querySelector('#prevButton');
        this.nextButton = this.querySelector('#nextButton');

        // Disable the previous button initially
        this.prevButton.disabled = true;
        if (this.subject && this.subjects[this.subject]) {
            this.updateSlides();
        }
    }

    updateSlides() {
        var slidesContainer = this.querySelector('#slidesContainer');
        slidesContainer.innerHTML = ''; // Clear the container
        this.attachResizeObserver();
        var totalSlides = this.subjects[this.subject].slides.length;

        // Add all slides to the container
        for (var i = 0; i < totalSlides; i++) {
            var slide = document.createElement('div');
            slide.className = 'slide';
            slide.id = 'slide' + (i + 1); // Add an id to each slide

            var img = document.createElement('img');
            img.src = this.subjects[this.subject].slides[i];
            img.className = 'img-slide'; // Add the class to the image

            var buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            var feedbackButton = document.createElement('button');
            feedbackButton.innerHTML = '<img src="./images/feedback.jpeg" alt="Feedback">';
            feedbackButton.className = 'icon-button';
            feedbackButton.onclick = function() { /* Add your feedback function here */ };

            var noteButton = document.createElement('button');
            noteButton.innerHTML = '<img src="./images/note.jpeg" alt="Note">';
            noteButton.className = 'icon-button';
            noteButton.onclick = function() { /* Add your note function here */ };

            buttonContainer.appendChild(feedbackButton);
            buttonContainer.appendChild(noteButton);

            slide.appendChild(img);
            slide.appendChild(buttonContainer);

            slidesContainer.appendChild(slide);
            // Update the slide number in the navigation bar
        this.querySelector('#slideNumber').innerText = 'Slide ' + this.currentSlide + '/' + totalSlides;
    }
}

    changeSlide(direction) {
        // Update the current slide number
        this.currentSlide += direction;

        // Disable the previous button if the current slide is the first slide
        this.prevButton.disabled = (this.currentSlide === 1);

        // Disable the next button if the current slide is the last slide
        this.nextButton.disabled = (this.currentSlide === this.subjects[this.subject].slides.length);

        // Get the new slide element
        var newSlide = this.querySelector('#slide' + this.currentSlide);

        // Scroll to the new slide
        newSlide.scrollIntoView({ behavior: 'smooth' });

        // Update the slide number in the navigation bar
        this.querySelector('#slideNumber').innerText = 'Slide ' + this.currentSlide + '/' + this.subjects[this.subject].slides.length;
    }
}

customElements.define('slides-component', SlidesComponent);
