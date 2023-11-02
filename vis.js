// Define chart dimensions and margins
const margin = { top: 20, right: 20, bottom: 70, left: 70 };
const width = 950 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

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
        .range([0, 800])
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
        .attr("stroke-width", 2.5)
        .attr("d", d => line(years.map(year => ({ year, value: d[year] }))));

    // Add mouseover and click events to lines
    lines.on("mouseover", function(d) {
            d3.select(this)
                .attr("stroke", "red")
                .attr("stroke-width", 4);
            svg.append("text")
                .attr("class", "#5E1A15")
                .attr("x", 10)
                .attr("y", yScale(+d3.max(years, year => +d[year])) - 10)
                .text(d.State);
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("stroke", "#868585")
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
});
