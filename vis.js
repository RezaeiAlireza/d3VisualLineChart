d3.select(".chart").insert("h1").text("Burglary Rates in the United States (1984-2014)")
    .style("text-align", "center")
    .style("font-family", "sans-serif")
    .style("margin", "auto")
    .style("margin-top", "60px");

// Define chart dimensions and margins
const margin = { top: 20, right: 20, bottom: 20, left: 70 };
const width = 950 - margin.left - margin.right;
const height = 580 - margin.top - margin.bottom;

// Create an SVG container with proper dimensions and margins
const svg = d3.select(".chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load the data from data.csv
d3.csv("data.csv").then(function(data) {
    // Extract years from the data for the x-axis
    const years = Object.keys(data[0]).slice(1, -1);

    // Define scales for x and y axes
    const xScale = d3.scaleBand()
        .domain(years)
        .range([0, 850])
        .padding(0.1);

    // Determine the minimum and maximum values of the data for the y-axis domain
    const minBurglaryRate = d3.min(data, d => d3.min(years, year => +d[year]));
    const maxBurglaryRate = d3.max(data, d => d3.max(years, year => +d[year]));

    // Define the y-axis scale based on the data's minimum and maximum values
    const yScale = d3.scaleLinear()
        .domain([minBurglaryRate, maxBurglaryRate])
        .range([450, 50]);

    // Create and append the x-axis
    svg.append("g")
        .attr("transform", "translate(0, 450)")
        .call(d3.axisBottom(xScale))
        .attr("class", "x-axis");

    // Create and append the y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Label the x-axis
    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", 400)
        .attr("y", 490)
        .attr("text-anchor", "middle")
        .text("Years");

    // Create and append the y-axis label
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -275)
        .attr("y", -70)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text("Burglary Rate (per 100,000 people)");

    // Create a line generator
    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(+d.value));

    // Draw lines for each state
    const lines = svg.selectAll(".line")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "#868585")
        .attr("stroke-width", 1.5)
        .attr("d", d => line(years.map(year => ({ year, value: d[year] }))))
        .attr("data-state", (d, i) => data[i].State); // Add the state name as a data attribute
        
    lines.on("mouseover", function(d) {
            const stateName = d3.select(this).attr("data-state");
            if (!d3.select(this).classed("highlighted")) {
                // Remove state label of previously highlighted line if a different line is being highlighted
                svg.selectAll(".state-label").remove();
                d3.select(this)
                    .attr("stroke", "orange") // Change the highlight color to orange
                    .attr("stroke-width", 4);
                svg.selectAll(".state-label").remove();
                svg.append("text")
                    .attr("class", "state-label")
                    .attr("x", 10)
                    .attr("y", yScale(+d3.max(years, year => +d[year])) - 10)
                    .text(stateName);
            }
        })

    .on("mouseout", function(d) {
            if (!d3.select(this).classed("highlighted")) {
                d3.select(this)
                    .attr("stroke", "#868585")
                    .attr("stroke-width", 1.5);
                    svg.selectAll(".state-label").remove();
            }
        })
        
        let numSelections = 0; // Initialize the variable to keep track of the number of selections made

        lines.on("click", function(d) {
            const stateName = d3.select(this).attr("data-state");
            const highlighted = d3.select(this).classed("highlighted");

            // Reset all lines and state labels to their default state
            svg.selectAll(".line:not(.highlighted)");
            svg.selectAll(".line:not(.highlighted)")
                .attr("stroke-width", 1.5);

            function getRandomColor() {

                let randomColor;

                do {
                    // Generate a random color
                    randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
                } while (randomColor === "#FFFFFF"|| randomColor === "#000000"); // Keep generating until the color is not white or black
                return randomColor;
            }

            if (!highlighted) {
                const randomColor = getRandomColor();
                d3.select(this)
                    .classed("highlighted", true)
                    .attr("stroke", randomColor) // Change the highlight color to the random color
                    .attr("stroke-width", null)
                    .attr("stroke-width", 4);
                svg.append("text")
                    .attr("class", "state-label-1")
                    .attr("x", 610)
                    .attr("y", 10 + numSelections * 20) // Increment the y position by 10 for each new selection
                    .attr("fill", randomColor) // Set the state label color to the random color
                    .attr("font-weight", "bold")
                    .text(stateName);
                numSelections += 1; // Increment the number of selections made

            } else {
                d3.select(this)
                    .classed("highlighted", false);
                svg.selectAll(".state-label-1")
                    .filter(function() {
                        return d3.select(this).text().includes(stateName);
                    })
                    .remove();
                numSelections -= 1;
            }

        });         
});

const brushingMargin = { top: 0 , right: 20, bottom: 70, left: 70 };
const brushingWidth = 950 - brushingMargin.left - brushingMargin.right;
const brushingHeight = 300 - brushingMargin.top - brushingMargin.bottom;

// Create an SVG container with proper dimensions and brushingMargins
const brushingSvg = d3.select(".chart")
    .append("svg")
    .attr("width", brushingWidth + brushingMargin.left + brushingMargin.right)
    .attr("height", brushingHeight + brushingMargin.top + brushingMargin.bottom)
    .append("g")
    .attr("transform", `translate(${brushingMargin.left}, ${brushingMargin.top})`);

d3.csv("data.csv").then(function(data) {
    // Extract years from the data for the x-axis
    const years = Object.keys(data[0]).slice(1, -1);
    // Define scales for x and y axes
    const xScale = d3.scaleLinear()
        .domain([d3.min(years, year => +year), d3.max(years, year => +year)])
        .range([0, brushingWidth]);

    // Determine the minimum and maximum values of the data for the y-axis domain
    const minBurglaryRate = d3.min(data, d => d3.min(years, year => +d[year]));
    const maxBurglaryRate = d3.max(data, d => d3.max(years, year => +d[year]));

    // Define the y-axis scale based on the data's minimum and maximum values
    const yScale = d3.scaleLinear()
        .domain([minBurglaryRate, maxBurglaryRate])
        .range([brushingHeight, 0]);

    /* BRUSHING */        
    let brush = d3.brushX()
        .extent([[0,0], [brushingWidth,brushingHeight]])
        .on("end", brushChart);
  
    brushingSvg.append("g")
        .attr("class", "brush")
        .call(brush)

    const brushingLine = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(+d.value));

    brushingSvg.selectAll(".brushingLine")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "brushingLine") // Add this line
        .attr("d", d => brushingLine(years.map(year => ({ year, value: d[year] }))))
        .attr("fill", "none")
        .style("stroke", "orange")
        .style("stroke-width", 2)
        .attr("data-state", (d, i) => data[i].State);

    // Create x-axis
    let xAxisBrush = d3.axisBottom()
        .scale(xScale)
        .tickValues(years)
        .tickFormat(d3.format("d"));

    let axisBrush = brushingSvg.append("g")
        .call(xAxisBrush)
        .attr("transform", "translate(0," + brushingHeight + ")");

    axisBrush.selectAll("text")
        .attr("transform", "rotate(-37)")
        .style("text-anchor", "end"); 
        
    /* BRUSHING FUNCTIONS*/
        
    // A function that set timeout to null
    let timeout;

    function timeoutFunc() {
        timeout = null
    }

    function brushChart(event) {
        let extent = event.selection;
        
        if (!extent) {
            if (!timeout) return timeout = setTimeout(timeoutFunc, 350);
            xScale.domain([d3.min(years, year => +year), d3.max(years, year => +year)]);
            xAxisBrush.scale(xScale); // Use xAxisBrush for the x-axis
        } else {
            let minYear = xScale.invert(extent[0]);
            let maxYear = xScale.invert(extent[1]);
            xScale.domain([minYear, maxYear]);
            xAxisBrush.scale(xScale);
            brushingSvg.select(".brush").call(brush.move, null);
        }
    
        // Update the x-axis with the new scale
        axisBrush.call(xAxisBrush);
    
        // Update the line chart
        brushingSvg.selectAll(".brushingLine")
            .attr("d", d => brushingLine(years.map(year => ({ year, value: d[year] })))
        );
    }
});