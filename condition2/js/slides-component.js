class SlidesComponent extends HTMLElement {
    constructor() {
      super();
      // Initialize your component
    }
  
    connectedCallback() {
      // This method is called when your component is attached to the DOM
      this.innerHTML = `
      <!-- Navigation bar -->
      <div id="navBar" class="nav-bar">
      </div>
      <div class="slides">
          <span id="slideNumber">Slide 1/1</span>
          <div class="nav-buttons">
            <button id="prevButton" class="nav-button" onclick="changeSlide(-1)">
              <img src="./images/previous.png" alt="Previous">
            </button>
            <button id="nextButton" class="nav-button" onclick="changeSlide(1)">
              <img src="./images/next.png" alt="Next">
            </button>
          </div>
        </div>
        <!-- Display your slides here -->
        <div id="slidesContainer"></div>
      </div>
      `;
    }
  }
  
  customElements.define('slides-component', SlidesComponent);
  