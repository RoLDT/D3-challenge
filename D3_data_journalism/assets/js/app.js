// @TODO: YOUR CODE HERE!
//Create svg container.
var svgWidth = 900;
var svgHeight = 540;

var margin = {
     top:20,
     right: 40,
     bottom: 80,
     left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
 .attr("transform", `translate(${margin.left}, ${margin.top})`);


//Make the Axis'
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

//Update x-scale depending on label
function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]),
        d3.max(data, d => d[chosenXAxis])
    ])
    .range([0,width]);

    return xLinearScale;
};

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
};

//Update y-scale depending on label
function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]),
        d3.max(data, d => d[chosenYAxis])
    ])
    .range([0,width]);

    return yLinearScale;
};

function renderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisBottom(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
};

//Circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    
    return circlesGroup;
};