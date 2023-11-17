class FeedbackBar extends HTMLElement {
  constructor() {
    super();

    this.currentSlide = 1;
    this.feedbacksAcrossSlides = {}
    /*
    Structure of a feedback
    const feedback = {
      userName: userName,
      levelOfUnderstanding: levelOfUnderstanding,
      feedback: comment,
      replies: [], // Array to store replies for this feedback
    };
    */
    this.feedbacks = [];
  }

  connectedCallback() {
    this.innerHTML = `
      <link href="./css/feedback-component.css" rel="stylesheet" type="text/css">
      <div class="feedback">
        <h2><strong>Feedbacks</strong></h2>
        <hr />
        <div class="feedback-display">
          <!-- <p> No feedbacks yet. Click on "+ Add Feedback" to add a new feedback. </p> -->
          <!-- Feedback items will be displayed here -->
        </div>
        <button id="openModalBtn">+ Add Feedback</button>
        <div id="feedbackModal" style="width: 75%" class="modal">
          <div class="modal-content">
              <button id="close-modal" style="
              align-self: end;
              float: right;
              width: 18px;">x</button>
            <h2>Feedback</h2>
            <label for="feedbackRating">Rate your understanding:</label>
            <div style="border:1px solid #ddd; padding: 10px 10px;">
              <div style="display: flex; justify-content: space-between;">
                <p style="display: inline-block;left: 0;"> 1 </p>
                <p style="display: inline-block;"> 5 </p>
              </div>
              <input type="range" id="feedbackRating" min="1" max="5" step="1">
            </div>
            <br>
            <label for="feedbackComment">Comments:</label>
            <textarea id="feedbackComment" rows="4" style="width: 95%; resize: vertical;" placeholder="Type your feedback here..."></textarea>
            <br>
            <button id="submitFeedback"><i class="fa fa-arrow-right" aria-hidden="true"></i>&nbspSubmit</button>
          </div>
        </div>
      </div>
      <style>
        p {
          overflow-wrap: break-word;
          hyphens: manual;
        }
      </style>
    `;

    var self = this;
    const modal = this.querySelector("#feedbackModal");
    const btn = this.querySelector("#openModalBtn");
    const submitButton = this.querySelector("#submitFeedback");
    const feedbackDisplay = this.querySelector(".feedback-display");
    const closeModalBtn = this.querySelector("#close-modal");

    // Open the modal when the button is clicked
    btn.addEventListener("click", function () {
      modal.style.display = "block";
      self.hideBackground(1);
    });

    closeModalBtn.addEventListener("click", function () {
      const ratingInput = self.querySelector("#feedbackRating");
      const commentInput = self.querySelector("#feedbackComment");
      ratingInput.value = "";
      commentInput.value = "";
      modal.style.display = "none";
      self.hideBackground(0);
    });
    // Close the modal when the submit button is clicked
    submitButton.addEventListener("click", function () {
      self.hideBackground(0);
      const ratingInput = self.querySelector("#feedbackRating");
      const commentInput = self.querySelector("#feedbackComment");
      const rating = ratingInput.value;
      const comment = commentInput.value;
      self.addFeedback("Student X", rating, comment);

      // Reload all feedback data from the feedback array
      //self.loadFeedbacks();

      // Clear the input fields
      ratingInput.value = "";
      commentInput.value = "";

      // Close the modal
      modal.style.display = "none";
    });

    feedbackDisplay.addEventListener("click", function (event) {
      const target = event.target;

      if (target.classList.contains("reply-button")) {
        const index = target.getAttribute("data-index");
        const feedbackItem = feedbackDisplay.querySelector(`[data-index="${index}"]`);
        const existingReplyForm = feedbackItem.querySelector(".reply-form");
        target.innerText = "Collapse reply";
        // Check if a reply form already exists
        if (existingReplyForm) {
          // If a reply form already exists, remove it
          feedbackItem.removeChild(existingReplyForm);
          target.innerText = "Reply";
        } else {
          // Create the reply form
          const replyForm = document.createElement("div");
          replyForm.style.zIndex = 2;
          replyForm.classList.add("reply-form");
          replyForm.innerHTML = `
          <div style="border: #ccc solid 1px; padding: 5px;">
            <textarea class="reply-text" rows="3" placeholder="Your reply..." style="width:93%;resize:vertical;"></textarea>

            <div class="submit-reply-container">
              <button class="submit-reply" data-index="${index}"><i class="fa fa-arrow-right" aria-hidden="true"></i>&nbspSubmit Reply</button>
            </div>
            </div>`
          ;
          feedbackItem.appendChild(replyForm);

          // Handle the reply submission
          const submitReplyButton = replyForm.querySelector(".submit-reply");
          submitReplyButton.addEventListener("click", function () {
            const replyIndex = submitReplyButton.getAttribute("data-index");
            const replyText = feedbackItem.querySelector(".reply-form .reply-text").value;
            if (replyText.trim().length != 0){
              // Add the reply to the associated feedback's replies array
              self.addReplyToFeedback(replyIndex, "User", replyText);

              // Clear the input field
              feedbackItem.querySelector(".reply-form .reply-text").value = "";

              // Remove the reply form
              feedbackItem.removeChild(feedbackItem.querySelector(".reply-form"));

              self.hideBackground(0);
              // Reload all feedback data from the feedback array
              //self.loadFeedbacks();
            }
          });
        }
      }
    });
    this.fakeSomeFeedbacks();
    this.loadFeedbacks();
  }

  hideBackground(boolean){
    const sidebar_overlay = document.querySelector("#side-bar-overlay");
    if(sidebar_overlay){

      if (boolean){
        sidebar_overlay.style.display = "block";
      }
      else{
        sidebar_overlay.style.display = "none";
      }
    }
  }

  loadFeedbacks() {
    const feedbackDisplay = this.querySelector(".feedback-display");
    feedbackDisplay.innerHTML = "";

    if (this.currentSlide in this.feedbacksAcrossSlides) {
      this.feedbacks = this.feedbacksAcrossSlides[this.currentSlide];
    }
    else{
      this.feedbacks = [];
    }

    for (let i = 0; i < this.feedbacks.length; i++) {
      const feedback = this.feedbacks[i];
      const feedbackItem = document.createElement("div");
      feedbackItem.classList.add("feedback-item");
      feedbackItem.setAttribute("data-index", i);
      feedbackItem.innerHTML = `
        <p>Level Of Understanding: ${feedback.levelOfUnderstanding}/5</p>
        <p style="margin:10px 0px 5px 0px;"><strong> ${feedback.userName} </strong></p>`
      if (feedback.feedback.length > 0){
        feedbackItem.innerHTML += `<p style="border: #ccc solid 1px;padding: 5px 5px 5px 5px;margin: 5px 5px;">${feedback.feedback}</p>`;
      }

      // Display replies for this feedback
      const replies = feedback.replies;
      if (replies && replies.length > 0) {
        replies.forEach((reply) => {
          const replyElement = document.createElement("div");
          replyElement.style.marginLeft = "15px";
          replyElement.style.marginRight = "10px";
          replyElement.classList.add("reply");
          replyElement.innerHTML = `<p> <strong> ${reply.userName}: </strong> <br />${reply.reply}</p>`;
          feedbackItem.appendChild(replyElement);
        });
      }

      // Add the "Reply" button as the last child of the feedbackItem
      const reply_button = document.createElement("button");
      reply_button.className = "reply-button";
      reply_button.setAttribute("data-index", i);
      reply_button.innerText = "Reply"
      reply_button.style.margin = "10px 10px 10px 5px";
      reply_button.style.padding = "5px 5px 5px 5px";
      feedbackItem.appendChild(reply_button);
      //feedbackItem.innerHTML += `<button class="reply-button" data-index="${i}">Reply</button>`;

      feedbackDisplay.appendChild(feedbackItem);
    }
    if (this.feedbacks.length == 0 ){
      feedbackDisplay.innerHTML = `
      <p style="opacity: 0.5; align-self:center"> <br/><b>No feedbacks yet. </b></p><!-- <p style=" align-self:center; opacity:0.5;"> Click on "+ Add Feedback" to add a new feedback. </p> --><br />`;
    }
    this.renderGraph();
  }

  addFeedback(userName, levelOfUnderstanding, comment){

    // Create a new feedback object with hardcoded username "Student X"
    const feedback = {
      userName: userName,
      levelOfUnderstanding: levelOfUnderstanding,
      feedback: comment,
      replies: [], // Array to store replies for this feedback
    };

    if (this.currentSlide in this.feedbacksAcrossSlides) {
      this.feedbacks = this.feedbacksAcrossSlides[this.currentSlide];
    }
    else{
      this.feedbacks = [];
    }

    // Add the feedback to the array
    this.feedbacks.push(feedback);
    this.feedbacksAcrossSlides[this.currentSlide] = this.feedbacks;
    this.loadFeedbacks();
  }

  addFeedbackAtSlide(slideNo, userName, levelOfUnderstanding, comment){
    
    const feedback = {
      userName: userName,
      levelOfUnderstanding: levelOfUnderstanding,
      feedback: comment,
      replies: [], // Array to store replies for this feedback
    };

    if (slideNo in this.feedbacksAcrossSlides) {
      this.feedbacks = this.feedbacksAcrossSlides[slideNo];
    }
    else{
      this.feedbacks = [];
    }

    // Add the feedback to the array
    this.feedbacks.push(feedback);
    this.feedbacksAcrossSlides[slideNo] = this.feedbacks;
    if (this.currentSlide == slideNo) {
      this.loadFeedbacks();
    }
  }

  fakeSomeFeedbacks(){

    
    this.addFeedbackAtSlide(0, "Cheng Min", 2, "Need more images");
    this.addFeedbackAtSlide(0, "Joo Jian", 3, "The slide is too crowded.");
    this.addFeedbackAtSlide(0, "Kai Chen", 5, "I like how the slide is designed. Very clear!");
    this.addFeedbackAtSlide(0, "Yuan Jie", 4, "Is the bomb image truly necessary?");

    
    this.addFeedbackAtSlide(1, "Poh Yue Jie", 5, "");
    this.addFeedbackAtSlide(1, "Sim Xin Rong", 5, "I like how the slide is designed. Very clear!");
    this.addFeedbackAtSlide(1, "Halimah", 3, "I don't understand what AFS stand for.");
    this.addFeedbackAtSlide(1, "Goh Jie Jun ", 5, "I like how the slide is designed. Very clear!");
    this.addFeedbackAtSlide(1, "Tan Cheng Min", 5, "Great slide! I wish there are images of the missile though.");
    this.addFeedbackAtSlide(1, "Karen Lim", 5, "Excellent description of faults! I can understand it easily!");

    this.addFeedbackAtSlide(2, "Ronald Dee", 2, "I don't understand what pulling the plug stand for.");
    this.addFeedbackAtSlide(2, "Ivy Tan Wen Jia", 5, "Clear examples provided.");
    this.addFeedbackAtSlide(2, "Lee Chee Yi", 2, "I don't understand what AFS stand for.");
    this.addFeedbackAtSlide(2, "Joshua Tan", 5, "");

    this.addFeedbackAtSlide(3, "Tim Cook", 1, "I still don't understand why it is an issue.");
    this.addFeedbackAtSlide(3, "Lim Hoon Beng", 3, "I don't understand what AFS stand for.");
    this.addFeedbackAtSlide(3, "Ang Kee Hian", 5, "I like how the slide is designed. Very clear!");

    this.addFeedbackAtSlide(4, "Li Sian Long", 3, "What is CM old and CM new?");
    this.addFeedbackAtSlide(4, "Benjamin Hoo", 5, "I like how the slide is designed. Very clear!");
    this.addFeedbackAtSlide(4, "Halilah", 4, "Can have more images");

    this.addFeedbackAtSlide(5, "Wu Mao", 3, "Not enough colors");
    this.addFeedbackAtSlide(5, "Siew Mai", 5, "");
    this.addFeedbackAtSlide(5, "Nicholas Lee", 5, "I wish more slides are like this");
  }

  switchSlide(slideNo){
    this.currentSlide = slideNo;
    this.loadFeedbacks();
  }
  addReplyToFeedback(feedbackIndex, userName, reply) {
    if (feedbackIndex >= 0 && feedbackIndex < this.feedbacks.length) {
      const newReply = {
        userName,
        reply,
      };

      // Add the reply to the specified feedback's replies array
      this.feedbacks[feedbackIndex].replies.push(newReply);
    }
    this.loadFeedbacks();
  }

  switchSlide(slideNo){
    this.currentSlide = slideNo;
    this.loadFeedbacks();
  }
  addReplyToFeedback(feedbackIndex, userName, reply) {
    if (feedbackIndex >= 0 && feedbackIndex < this.feedbacks.length) {
      const newReply = {
        userName,
        reply,
      };

      // Add the reply to the specified feedback's replies array
      this.feedbacks[feedbackIndex].replies.push(newReply);
    }
    this.loadFeedbacks();
  }

  renderGraph(){
    const gc = document.querySelector("graph-component");
    const graphData= [0,0,0,0,0];
    if (this.currentSlide in this.feedbacksAcrossSlides) {
      this.feedbacks = this.feedbacksAcrossSlides[this.currentSlide];
    }
    else{
      this.feedbacks = [];
    }
    if (gc != undefined){
      for (let i = 0; i<this.feedbacks.length; i++){
        graphData[this.feedbacks[i].levelOfUnderstanding-1]++;
      }
      console.log(this.feedbacks)
      console.log(graphData);
      gc.insertGraphData(graphData);
    }
  }
}

customElements.define("feedback-bar", FeedbackBar);