async function drawStackBarGraph() {
    // Load data
    let data = await d3.csv("cleaned_data/food-health.csv");
    
    // Clearing placeholder
    d3.select('#stack-bar-chart-placeholder').selectAll('*').remove();

    // Set dimensions and margins of the graph
    const margin = {top: 20, right: 30, bottom: 40, left: 90},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
    // Append svg object to the body of the page
    const svg = d3.select("#stack-bar-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(d => d.entity))
        .padding(.1);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add bars for food_share
    svg.selectAll("foodBar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", d => y(d.entity))
        .attr("width", d => x(d.food_share))
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2");

    // Add bars for health_share
    svg.selectAll("healthBar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(1 - d.health_share)) // Subtract health share from 1 to align it to the right
        .attr("y", d => y(d.entity))
        .attr("width", d => x(d.health_share))
        .attr("height", y.bandwidth())
        .attr("fill", "#b369a2");
}
