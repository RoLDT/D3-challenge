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

//Tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var labelX;

    if (chosenXAxis === "poverty") {
        labelX = "Poverty in State (%)";
    }
    else if (chosenXAxis === "income") {
        labelX = "Household Income in State";
    }
    else {
        labelX = "Age";
    }

    var labelY;

    if (chosenYAxis === "obesity") {
        labelY = "Obesity in State (%)";
    }
    else if (chosenYAxis === "smokes") {
        labelY = "Smoking in State (%)";
    }
    else {
        labelY = "Healthcare in State (%)"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80,-60])
        .html(function(d) {
            return (`${d.state}<br>${labelX} ${d[chosenXAxis]}<br>${labelY} ${d[chosenYAxis]}`);
        });
    
    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index){
            toolTip.hide(data);
        });
    
    return circlesGroup;
};

//Extract data from CSV