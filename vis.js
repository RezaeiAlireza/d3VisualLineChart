d3.select(".chart").insert("h1").text("Burglary Rates in the United States (1975-2015)")
    .style("text-align", "center")
    .style("font-family", "sans-serif")
    .style("margin", "auto")
    .style("margin-top", "60px");

// Define chart dimensions and margins
const margin = { top: 20, right: 20, bottom: 70, left: 70 };
const width = 950 - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;

// Create an SVG container with proper dimensions and margins
const svg = d3.select(".chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("margin", "auto");


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
        
        .on("click", function(d) {
            svg.selectAll(".state-label-1").remove();

            const stateName = d3.select(this).attr("data-state");
            const highlighted = d3.select(this).classed("highlighted");

            // Reset all lines and state labels to their default state
            svg.selectAll(".line, .state-label").classed("highlighted", false);
            svg.selectAll(".line")
                .attr("stroke", "#868585")
                .attr("stroke-width", 1.5);

            if (!highlighted) {
                d3.select(this)
                    .classed("highlighted", true)
                    .attr("stroke", "green") // Change the highlight color to green
                    .attr("stroke-width", 4);
                svg.append("text")
                    .attr("class", "state-label-1")
                    .attr("x", 610)
                    .attr("y", 10)
                    .attr("fill", "green")
                    .attr("font-weight", "bold")
                    .text("Selected State: " + stateName);
            }
    });
        
    // Timeline Brushing
    
    

    // // Create a brush for selecting a range of years
    // const brush = d3.brushX()
    //     .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
    //     .on("brush end", brushed);

    // // Append the brush to the chart
    // const brushGroup = svg.append("g")
    //     .attr("class", "brush")
    //     .call(brush);

    // // Set the default brush selection to the entire range of years
    // brushGroup.call(brush.move, [xScale(1984), xScale(2014)]);

    // // Define the brushed function
    // function brushed() {
    //     // Get the selected range of years from the brush
    //     const selection = d3.event.selection || [xScale(1984), xScale(2014)];
    //     const [x0, x1] = selection.map(xScale.invert);

    //     // Filter the data to include only the selected range of years
    //     const filteredData = data.map(d => {
    //         const filteredValues = Object.entries(d)
    //             .filter(([key, value]) => key >= x0 && key <= x1)
    //             .reduce((obj, [key, value]) => {
    //                 obj[key] = value;
    //                 return obj;
    //             }, {});
    //         return { State: d.State, ...filteredValues };
    //     });

    //     // Update the y-axis domain based on the filtered data
    //     yScale.domain([0, d3.max(filteredData, d => d3.max(years, year => +d[year]))]);

    //     // Update the lines and y-axis based on the filtered data
    //     lines.data(filteredData)
    //         .attr("d", d => line(years.map(year => ({ year, value: d[year] }))))
    //         .attr("stroke", "#868585")
    //         .attr("stroke-width", 1.5)
    //         .attr("data-state", (d, i) => data[i].State)
    //         .classed("highlighted", false);

    //     svg.select(".y-axis")
    //         .transition()
    //         .duration(1000)
    //         .call(d3.axisLeft(yScale));

    //     // Remove any existing state labels
    //     svg.selectAll(".state-label, .state-label-1").remove();
    // }
});
