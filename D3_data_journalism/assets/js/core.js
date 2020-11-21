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

//Extract data from CSV
d3.csv("assets/data/data.csv").then(function(data) {
    
    data.forEach(function(d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });
    //Scales for the X and Y Axis'
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.poverty) *.8)
        .range([0,width]);

    var yLinearScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.healthcare) *1.2)
        .range([height,0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);

    //Circles and Text
    var circlesGroup = chartGroup.selectAll(".stateCircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 15)
        .classed("stateCircle", true);

    chartGroup.append("g")
        .selectAll(".stateText")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text(d => d.abbr)
        .classed("stateText", true);

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80,-60])
        .html(function(d){
            return (`<strong>${d.state}</strong><br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index){
            toolTip.hide(data);
        });

    //Create X and Y Axis Labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

}).catch(function(error){
    console.log(error);
});