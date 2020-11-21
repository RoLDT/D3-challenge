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
    .classed("chart", true)
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
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0,width]);
    return xLinearScale;
};

function renderAxisX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
};

//Update y-scale depending on label
function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        d3.max(data, d => d[chosenYAxis]) * 1.2
    ])
    .range([height,0]);

    return yLinearScale;
};

function renderAxisY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

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

//Circle Labels
function circleText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    
    return textGroup;
};

//Tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var labelX;

    if (chosenXAxis === "poverty") {
        labelX = "Poverty in State (%):";
    }
    else if (chosenXAxis === "income") {
        labelX = "Household Income in State:";
    }
    else {
        labelX = "Age:";
    }

    var labelY;

    if (chosenYAxis === "obesity") {
        labelY = "Obesity in State (%):";
    }
    else if (chosenYAxis === "smokes") {
        labelY = "Smoking in State (%):";
    }
    else {
        labelY = "Healthcare in State (%):"
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
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
d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;
    //Used to read the data. It worked
    console.log(data);

    //Parsing thru the data
    data.forEach(function(d) {
        d.poverty = +d.poverty;
        d.income = +d.income;
        d.age = +d.age;
        d.obesity = +d.obesity;
        d.smokes = +d.smokes;
        d.healthcare = +d.healthcare;
    });
    //Grouping the Axis' and Labels
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
    //ERROR IN CIRCLES; THEY MOVE OUT OF THE CHART; FIXED
    //Error in circles; dont have text in them; KINDAFIXED; FIXED = HAD TO CORRECTLY "selectAll" with ".stateCircle" and ".stateText"
    var circlesGroup = chartGroup.selectAll(".stateCircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .classed("stateCircle", true);

    var textGroup = chartGroup.selectAll(".stateText")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text(d => d.abbr)
        .classed("stateText", true);
    
    
    var labelsGroupX = chartGroup.append("g")
        .attr("transform", `translate(${width/2}, ${height + 10})`);
    //ERROR IN YLABELS; THEY ARE ALL THE WAY TO THE RIGHT; FIXED = PLAYED WITH THE TRANSLATION
    var labelsGroupY = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${height/2})`);
    
    //XLabels
    var povertyLabel = labelsGroupX.append("text")
        .attr("x",0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("Poverty in State (%)");

    var incomeLabel = labelsGroupX.append("text")
        .attr("x",0)
        .attr("y", 40)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Income in State (Median)");

    var ageLabel = labelsGroupX.append("text")
        .attr("x",0)
        .attr("y", 60)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age in State (Median)");

    //YLabels
    var obesityLabel = labelsGroupY.append("text")
        .attr("x",0)
        .attr("y", 0 - 20)
        .attr("transform", "rotate(-90)")
        .attr("value", "obesity")
        .classed("active", true)
        .text("Obesity in State (%)");

    var smokesLabel = labelsGroupY.append("text")
        .attr("x",0)
        .attr("y", 0 - 40)
        .attr("transform", "rotate(-90)")
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smoking in State (%)");

    var healthcareLabel = labelsGroupY.append("text")
        .attr("x",0)
        .attr("y", 0 - 60)
        .attr("transform", "rotate(-90)")
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Healthcare in State (%)");
    
    //Updating Tooltip
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    //Event listeners for X and Y Axis'
    labelsGroupX.selectAll("text")
        .on("click", function(){
            var value = d3.select(this).attr("value");
            if(value !== chosenXAxis) {
                chosenXAxis = value;

                xLinearScale = xScale(data, chosenXAxis);
                xAxis = renderAxisX(xLinearScale, xAxis);
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                textGroup = circleText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                if (chosenXAxis === "poverty" ) {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "income") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
        //ERROR IN CLICK; THE CHART DOES NOT CHANGE
    labelsGroupY.selectAll("text")
        .on("click", function(){
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis){
                chosenYAxis = value;

                yLinearScale = yScale(data, chosenYAxis);
                yAxis = renderAxisY(yLinearScale, yAxis);
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                textGroup = circleText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                if (chosenYAxis === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "smokes") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            };
        });
        
}).catch(function(error){
    console.log(error);
});