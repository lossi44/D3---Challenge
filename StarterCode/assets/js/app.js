// @TODO: YOUR CODE HERE!
// Set up chart parameters
var svgWidth = 1000;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold the chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "Poverty";
var chosenYAxis = "Healthcare"

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;  
  }
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
      d3.max(data, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;
}
// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[newYScale]));
  
    return circlesGroup;
  }
// ==============================================================  
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "poverty" & chosenYAxis == "obesity") {
      var label = "In Poverty (%):"
      var label2 = "Obesity:";
    }
    else if (chosenXaxis === "age" && chosenYAxis == "smokes") {
      var label = "Age (Median:)"
      var label2 = "Smokes:";
    }
    else{
      var label = "Income:"
      var label2 = "Healthcare";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>${label2} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d);
    })
      // onmouseout event
      .on("mouseout", function(d, index) {
        toolTip.hide(d);
      });
  
    return circlesGroup;
  }  

//  Apply state text on circles (dx & dy are locations) from Stack OF
circlesGroup  // previously allCircles
.append("text")
.attr("font-size", cRadius)
.attr("class", "abbr")

.attr("dx", function(d) {
   return xScale(d[currentX]);
})
.attr("dy", function(d) {
  // Push text to center by a 1/3
  return yScale(d[currentY]) + cRadius /3;
})
.text(function(d) {
    return d.abbr;
  })

.on("mouseover", function(d) {
    toolTip.show(d);
    d3.select("." + d.abbr).style("stroke", "#323232");
})

.on("mouseout", function(d) {
    toolTip.hide(d);
    d3.select("." + d.abbr).style("stroke", "#e3e3e3");
});
// ============================================================

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv", function(err, data) {
    if (err) throw err;
    console.log(data)
  
    // parse data
    data.forEach(function(response) {
      response.state = +response.state;
      response.age = +response.age;
      response.poverty = +response.poverty;
      response.income = +response.income;
      response.healthcare = +response.healthcare;
      data.obesity = +data.obesity;
    });
  
  // xLinearScale & yLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);
  var yLinearScale = yScale(data, chosenYAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.obesity)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // append y axis
  chartGroup.append("g")
  .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.chosenYAxis))
    .attr("r", 20)
    .attr("fill", "lightblue")
    .attr("opacity", ".5");
// ===============================================================

    // Create group for  3 x- axis labels
  var labelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 3}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Percent in Poverty");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("Age (Median)");
  
  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "income") // value to grab for event listener
    .classed("active", true)
    .text("Household Income (Median)");
// =============================================================
  // Create group for  3 y- axis labels
var ylabelsGroup = ychartGroup.append("g")
.attr("transform", `translate(${width / 3}, ${height + 20})`);

  // append y axis
  var obeseLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 3))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obese (%)");

  var smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 3))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Smokes (%)");

  var lacksLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 3))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");
// =============================================================

// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXaxis with value
        chosenXAxis = value;

        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "income") {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
      
          }
          else if (chosenXAxis == "age") {
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
        }   
        else {
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

var circlesGroupY = updateToolTip2(chosenYAxis, circlesGroupY);
    // y axis labels event listener
  yLabelsGroup.selectAll("text")
    .on("click", function() {
          // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
  
        // replaces chosenYAxis with value
        chosenYAxis = value;
  
        console.log(chosenYAxis)
  
        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(data, chosenYAxis);
  
          // updates x axis with transition
        yAxis = renderAxes(yLinearScale, yAxis);
  
          // updates circles with new x values
        circlesGroupY = renderCircles(circlesGroupY, yLinearScale, chosenYAxis);
  
          // updates tooltips with new info
        circlesGroupY = updateToolTip2(chosenYAxis, circlesGroupY);
  
        // changes classes to change bold text
        if (chosenYAxis === "smokes") {
              smokersLabel
              .classed("active", true)
              .classed("inactive", false);
              healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
              obesityLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        else if (chosenXAxis == "healthcare") {
            smokersLabel
            .classed("active", false)
            .classed("inactive", true);
             healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
             obesityLabel
            .classed("active", false)
            .classed("inactive", true);
         }
         else {
            smokersLabel
            .classed("active", false)
            .classed("inactive", true);
             healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
             obesityLabel
            .classed("active", true)
            .classed("inactive", false);
      }
    }
  });
});