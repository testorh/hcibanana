class PageNavigationBar extends HTMLElement {
    constructor() {
      super();
      this.subjects = {
            introtoit: " INF 201: Intro to IT",
            databasedesign: "INF 202: Database design",
            securty: "INF 203: Security",
            ethics: "INF 204: Ethics"
        };
        this.urlParams = new URLSearchParams(window.location.search);
        this.subject = this.urlParams.get('subject');

    }

    connectedCallback() {
        this.innerHTML = `
        <style>
            ul {
                list-style-type: none;
                margin: 0;
                padding: 0;
                overflow: hidden;
                background-color: #333;
            }

            li {
                float: left;
            }

            li a{
                display: block;
                color: white;
                text-align: center;
                padding: 14px 16px;
                text-decoration: none;
            }
            li p   {
                display: block;
                color: white;
                text-align: center;
                padding: 14px 16px;
                text-decoration: none;
            }

            /* Change the link color to #111 (black) on hover */
            li a:hover {
                background-color: #111;
            }
            .active {
                background-color: #04AA6D;
            }
        </style>
        <ul>
            <li><a href="./Landingpage.html"><i class="fa fa-home"></i> &nbsp;Home</a></li>
            <li><b>|</b></li>
            <li id="slides_name"></li>
        </ul>
        `;
        const module_name = document.querySelector("#slides_name");
        if (this.subject && this.subjects[this.subject]){
            module_name.innerHTML = "<p>" + this.subjects[this.subject] + "</p>";
        }



    }

}

  customElements.define("page-navigation-bar", PageNavigationBar);