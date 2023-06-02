async function drawStackBarGraph(sortBy = 'food_share') {
    // Load data
    let data = await d3.csv("cleaned_data/food-health.csv");

    // Clearing placeholder
    d3.select('#stack-bar-chart').selectAll('*').remove();

    let margin = {top: 20, right: 900, bottom: 50, left: 50};
    let container = d3.select("#steam-chart-container").node().getBoundingClientRect();
    let containerWidth = container.width;

    let width = containerWidth - margin.left - margin.right;
    let height = 800 - margin.top - margin.bottom;




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

    // Sort data
    data.sort((a, b) => d3.ascending(parseFloat(a[sortBy]), parseFloat(b[sortBy])));

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

    d3.select('#stack-bar-chart-placeholder').selectAll('*').remove();
        
}


