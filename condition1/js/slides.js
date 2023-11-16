// Global variable to keep track of the active feedback button
var activeFeedbackButton = null;
var activeNoteButton = null;
window.onload = function() {

var subjects = {
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
    },
    security: {
      slides: ["./images/security/page1.png", "./images/security/page2.png",
      "./images/security/page3.png","./images/security/page4.png",
      "./images/security/page5.png","./images/security/page6.png" /* more images */]
  }
};

var urlParams = new URLSearchParams(window.location.search);
var subject = urlParams.get('subject');
var currentSlide = 1;
var prevButton = document.getElementById('prevButton');
var nextButton = document.getElementById('nextButton');

// Disable the previous button initially
prevButton.disabled = true;
if (subject && subjects[subject]) {
  updateSlides();
}

// Modify the close-sidebar button's event listener
document.getElementById('close-sidebar').addEventListener('click', function() {
  closeSidebarAndResetButton();
});
function attachResizeObserver(){

  const slidebar = document.querySelector("#navBar");
  const slidesContainer = document.getElementById("slidesContainer");
  const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
          const target = entry.target;
          const { width, height } = target.getBoundingClientRect();
          console.log(width);
          slidebar.style.width = width *0.9 + "px";
          console.log(slidebar.style.width);
      }
  });
  if (slidesContainer){
    resizeObserver.observe(slidesContainer);
  }
}

function updateSlides() {
  var slidesContainer = document.getElementById('slidesContainer');
  slidesContainer.innerHTML = ''; // Clear the container
  //attachResizeObserver();
  var totalSlides = subjects[subject].slides.length;

  // Add all slides to the container
  for (var i = 0; i < totalSlides; i++) {
      var slide = document.createElement('div');
      slide.className = 'slide';
      slide.id = 'slide' + (i + 1); // Add an id to each slide

      var img = document.createElement('img');
      img.src = subjects[subject].slides[i];
      img.className = 'img-slide'; // Add the class to the image

      var buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-container';

      var feedbackButton = document.createElement('button');
      feedbackButton.innerHTML = '<img src="./images/feedback.jpeg" alt="Feedback">';
      feedbackButton.className = 'icon-button';

      // Store the last clicked feedback button
    var lastFeedbackButton;
    feedbackButton.onclick = (function(index) {
      return function() {
        // Remove the border from all slides
        var allSlides = document.querySelectorAll('.slide');
        allSlides.forEach(function(slide) {
        slide.classList.remove('slide-border');
        slide.querySelectorAll("img")[2].style.border = "1px solid black";
      });

        // Add the border to the current slide
        var currentSlide = document.getElementById('slide' + (index + 1));
        //currentSlide.classList.add('slide-border');

        currentSlide.querySelectorAll("img")[2].style.border="10px solid black";
        // If there was a previously clicked feedback button, reset its icon
        if (lastFeedbackButton) {
          lastFeedbackButton.innerHTML = '<img src="./images/feedback.jpeg" alt="Feedback">';
        }

        // Change the icon of the clicked feedback button
        this.innerHTML = '<img src="./images/feedback_active.jpeg" alt="Feedback">';
        // Store the active feedback button
      if (activeFeedbackButton) {
        activeFeedbackButton.innerHTML = '<img src="./images/feedback.jpeg" alt="Feedback">';
      }
      activeFeedbackButton = this;

        // Store the clicked feedback button
        lastFeedbackButton = this;

        if (lastNoteButton) {
          lastNoteButton.innerHTML = '<img src="./images/note.jpeg" alt="Note">';
        }
        // Update the slide number in the navigation bar
      document.getElementById('slideNumber').innerText = 'Slide ' + (index + 1) + '/' + totalSlides;

        // Call your feedback function
        myFeedbackFunction(index);
      };
    })(i);
    

      var noteButton = document.createElement('button');
      noteButton.innerHTML = '<img src="./images/note.jpeg" alt="Note">';
      noteButton.className = 'icon-button';

    // Store the last clicked note button
    var lastNoteButton;
    noteButton.onclick = (function(index) {
      return function() {
        // Remove the border from all slides
        var allSlides = document.querySelectorAll('.slide');
        allSlides.forEach(function(slide) {
            slide.classList.remove('slide-border');
            slide.querySelector("img").style.border = "1px solid black";
        });

        // Add the border to the current slide
        var currentSlide = document.getElementById('slide' + (index + 1));
        // currentSlide.classList.add('slide-border');
        currentSlide.querySelector("img").style.border="10px solid black";

        // If there was a previously clicked note button, reset its icon
        if (lastNoteButton) {
          lastNoteButton.innerHTML = '<img src="./images/note.jpeg" alt="Note">';
        }

        // Change the icon of the clicked note button
        this.innerHTML = '<img src="./images/note_active.jpeg" alt="Note">';

        // Store the clicked note button
        lastNoteButton = this;

        // Store the active note button
        if (activeNoteButton) {
          activeNoteButton.innerHTML = '<img src="./images/note.jpeg" alt="Note">';
        }
        activeNoteButton = this;

        if (lastFeedbackButton) {
          lastFeedbackButton.innerHTML = '<img src="./images/feedback.jpeg" alt="Feedback">';
        }

        // Update the slide number in the navigation bar
       document.getElementById('slideNumber').innerText = 'Slide ' + (index + 1) + '/' + totalSlides;

        // Call your note function
        myNoteFunction(index);
      };
    })(i);


      buttonContainer.appendChild(feedbackButton);
      buttonContainer.appendChild(noteButton);

      slide.appendChild(buttonContainer);
      slide.appendChild(img);

      slidesContainer.appendChild(slide);

      // Update the slide number in the navigation bar
  document.getElementById('slideNumber').innerText = 'Slide ' + currentSlide + '/' + totalSlides;
}


// Add event listeners to the next and previous buttons
document.getElementById('nextButton').addEventListener('click', function() {
  changeSlide(1);
});
document.getElementById('prevButton').addEventListener('click', function() {
  changeSlide(-1);
});

function changeSlide(direction) {
  // Update the current slide number
  currentSlide += direction;

  // Disable the previous button if the current slide is the first slide
  prevButton.disabled = (currentSlide === 1);

  // Disable the next button if the current slide is the last slide
  nextButton.disabled = (currentSlide === subjects[subject].slides.length);

  // Get the new slide element
  var newSlide = document.getElementById('slide' + currentSlide);

  // Scroll to the new slide
  newSlide.scrollIntoView({ behavior: 'smooth' });

  // Update the slide number in the navigation bar
  document.getElementById('slideNumber').innerText = 'Slide ' + currentSlide + '/' + totalSlides;
}

// Add the scroll event listener here after slidesContainer has been defined
slidesContainer.addEventListener('scroll', function() {
  // Get the current scroll position.
  var scrollPosition = slidesContainer.scrollTop;
  
  // Get the height of a single slide.
  var slideHeight = slidesContainer.querySelector('.slide').offsetHeight;

  // Determine the current slide based on the scroll position.
  // Adding 0.5 for rounding to nearest slide when in between slides.
  var currentSlideIndex = Math.floor(scrollPosition / slideHeight + 0.5) + 1;

  // Make sure the currentSlideIndex is within the range of total slides.
  currentSlideIndex = Math.max(1, Math.min(currentSlideIndex, totalSlides));

  // Update the current slide number in the navigation bar.
  document.getElementById('slideNumber').innerText = 'Slide ' + currentSlideIndex + '/' + totalSlides;

  // Update the global currentSlide variable.
  currentSlide = currentSlideIndex; // Ensure this variable is in the correct scope

  // Update button states based on current slide.
  prevButton.disabled = (currentSlideIndex === 1);
  nextButton.disabled = (currentSlideIndex === totalSlides);
});
}

function myFeedbackFunction(slideIndex) {
  displaySidebar();
  pn = document.querySelector("presenter-notes");
  pn.style.display = "none";
  a = document.querySelector('feedback-bar');
  a.style.display = "flex";
  a.switchSlide(slideIndex);
  b = document.querySelector('graph-component');
  b.style.display = "block";

}

function myNoteFunction(slideIndex) {
  displaySidebar();
  pn = document.querySelector("presenter-notes");
  pn.style.display = "block";
  a = document.querySelector('feedback-bar');
  a.style.display = "none";
  b = document.querySelector('graph-component');
  b.style.display = "none";
}

function displaySidebar(){
  const sidebar = document.querySelector(".side-bar");
  sidebar.style.display = "flex";
}

// New function to close sidebar and reset the feedback button icon
function closeSidebarAndResetButton() {
  // Hide the sidebar
  document.querySelector('.side-bar').style.display = 'none';

  // Reset the active feedback button's icon if it exists
  if (activeFeedbackButton) {
    activeFeedbackButton.innerHTML = '<img src="./images/feedback.jpeg" alt="Feedback">';
    // Reset the global variable
    activeFeedbackButton = null;
  }
    // Reset the active note button's icon if it exists
    if (activeNoteButton) {
        activeNoteButton.innerHTML = '<img src="./images/note.jpeg" alt="Note">';
        activeNoteButton = null;
      }
  
}

}
