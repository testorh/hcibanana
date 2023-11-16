//import {Chart} from "./libraries/chart.js"

class GraphComponent extends HTMLElement {

    constructor() {
        super();
        this.graphData = [1,2,3,4,5];
        this.existingGraph;
    }
    connectedCallback() {
        const self = this;
        this.innerHTML = `
        <style>
        </style>
        <button id="toggle_graph_visibility" style="padding: 5px 5px 5px 5px; margin: 10px 0px 10px 0px;">Show graph of levels of understanding</button>
        <div style="width:100%; position: relative; aspect-ratio: 1/0.5; display:none;" id="graph_wrapper">
            <canvas id="feedback-chart" style=""></canvas>
        </div>
        `;
        this.initiateGraph();
        const ctx = document.getElementById('feedback-chart');
        const div = this.querySelector("#graph_wrapper");
        const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
                const target = entry.target;
                const { width, height } = target.getBoundingClientRect();

                ctx.style.width = width;
                //ctx.style.height = height;
                console.log(width,height);

                // Add your custom logic here to respond to changes in dimensions
                this.renderGraph();
            }
        });
        resizeObserver.observe(div);
        const button = this.querySelector("#toggle_graph_visibility");
        button.addEventListener("click", function (event) {
            self.toggleGraphVisibility();
        });

    }
    initiateGraph(){
        const ctx = document.getElementById('feedback-chart');
        //if (this.existingGraph != undefined){this.existingGraph.destroy();}
        this.existingGraph = new Chart(ctx, {
            responsive: true,
            maintainAspectRatio: false,
            type: 'bar',
            data: {
            labels:  this.graphData,
            datasets: [{
                label: 'Level of understanding',
                data: this.graphData,
                borderWidth: 1
            }]
            },
            options: {
            scales: {
                y: {
                beginAtZero: true
                }
            }
            }
        });
        //this.insertGraphData(this.graphData);
    }
    renderGraph(){
        this.existingGraph.data.datasets.forEach((dataset) => {
            console.log(dataset);
        });
        this.existingGraph.data.datasets.forEach((dataset) => {
            dataset.data = this.graphData;
            console.log(dataset);
        });
        this.existingGraph.update();
    }
    toggleGraphVisibility(){
        const div = this.querySelector("#graph_wrapper");
        const button = this.querySelector("#toggle_graph_visibility");
        if (div.style.display == "none"){
            button.innerText = "Hide graph of levels of understanding";
            div.style.display = "block";
        }
        else {
            button.innerText = "Show graph of levels of understanding";
            div.style.display = "none";
        }
    }
    insertGraphData(array){
        this.graphData = array;
        this.renderGraph();
    }
}
customElements.define("graph-component", GraphComponent);