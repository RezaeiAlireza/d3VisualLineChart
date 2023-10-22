// Select the SVG container and set dimensions
const svg = d3.select(".chart")
    .append("svg")
    .attr("width", 800)
    .attr("height", 600);

// Load the data from data.csv
d3.csv("data.csv").then(function(data) {
    // Extract years from the data for the x-axis
    const years = Object.keys(data[0]).slice(1);

    // Define scales for x and y axes
    const xScale = d3.scaleBand()
        .domain(years.slice(0, -1)) // Only include years up to the last year
        .range([0, 800])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.max(years, year => +d[year]))])
        .range([450, 50]);

    // Create and append the x-axis
    svg.append("g")
        .attr("transform", "translate(0, 450)")
        .call(d3.axisBottom(xScale))

    // Create and append the y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Create and append the y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -1)  // Adjust the X position to properly position the label
        .attr("y", 6)
        .attr("dy", "-4em")
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
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", d => line(years.map(year => ({ year, value: d[year] }))));

    // Add mouseover and click events to lines
    lines.on("mouseover", function(d) {
            d3.select(this)
                .attr("stroke", "red")
                .attr("stroke-width", 4);
            svg.append("text")
                .attr("class", "state-label")
                .attr("x", 10)
                .attr("y", yScale(+d3.max(years, year => +d[year])) - 10)
                .text(d.State);
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2);
            svg.select(".state-label").remove();
        })
        .on("click", function(d) {
            d3.select(this)
                .attr("stroke", "green")
                .attr("stroke-width", 4);
            svg.append("text")
                .attr("class", "state-label-permanent")
                .attr("x", 10)
                .attr("y", yScale(+d3.max(years, year => +d[year])) - 10)
                .text(d.State);
        });

    // Create a brush for the context area
    const brush = d3.brushX()
        .extent([[0, 450], [800, 500]])
        .on("end", brushed);

    // Create and append the context area
    const context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(0, 450)");

    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, [xScale(years[0]), xScale(years[3])]);

    // Function to handle brushing
    function brushed() {
        const selection = d3.event.selection;
        const selectedYears = selection.map(xScale.invert);
        xScale.domain(selectedYears);
        svg.selectAll(".line").attr("d", d => line(years.map(year => ({ year, value: d[year] }))));
        svg.select(".x-axis").call(d3.axisBottom(xScale));
    }

    // Create and append the x-axis for the context area
    context.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0, 50)")
        .call(d3.axisBottom(xScale));
    
    // Label the x-axis
    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", 400)
        .attr("y", 490)
        .attr("text-anchor", "middle")
        .text("Years");
});
