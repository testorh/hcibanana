class PresenterNotes extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    
  }
  connectedCallback() {
    this.innerHTML = `
    <div><br></div>
        <div><h3>Presenter notes</h3></div>
        <div><br></div>
        <div><br></div>
      <div class="presenter-notes">
        <div class="note-input-container">
          <textarea
            class="note-input"
            placeholder="Presenter Notes" style="width:100%;">
          </textarea>
        </div>
      </div>
    `;
    //this.attachShadow({ mode: 'open' });
    //this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.noteInput = this.querySelector('.note-input');
    
    // Load saved notes from local storage
    this.loadNotes();
    
    this.noteInput.addEventListener('input', () => {
      this.handleNotesChange(this.noteInput.value);
    });
    this.disableResizing(); 
  }
  disableResizing() {
    this.noteInput.style.resize = 'none';
  }
  handleNotesChange(notes) {
    // Save notes to local storage
    localStorage.setItem('presenterNotes', notes);
  }
  loadNotes() {
    // Load saved notes from local storage
    const savedNotes = localStorage.getItem('presenterNotes');
    if (savedNotes) {
      this.noteInput.value = savedNotes;
    }
  }
}
customElements.define('presenter-notes', PresenterNotes);