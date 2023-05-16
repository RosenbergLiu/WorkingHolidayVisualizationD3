async function drawRadialBarGraph() {
    // Load and parse data
    let data = await d3.csv("cleaned_data/gini.csv");
    data.forEach(d => {
        d.gini = +d.gini;
    });

    const countryNameMap = {};
    for (let d of data) {
        countryNameMap[d.code] = await fetchCountryName(d.code);
    }
    // Sort data by 'gini' value in descending order
    data.sort((a, b) => d3.descending(a.gini, b.gini));

    // Define size of SVG
    const width = 600;
    const height = 800;
    const innerRadius = 100;
    const outerRadius = Math.min(width, height) / 2;

    // Create SVG
    const svg = d3.select("#radial-bar-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.code))
        .range([0, 2 * Math.PI])
        .align(0);

    const y = d3.scaleRadial()
        .domain([0, d3.max(data, d => d.gini)])
        .range([innerRadius, outerRadius]);

    // Add bars
    svg.append("g")
        .selectAll("path")
        .data(data)
        .join("path")
        .attr("fill", "#69b3a2")
        .attr("d", d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(d => y(d.gini))
            .startAngle(d => x(d.code))
            .endAngle(d => x(d.code) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(innerRadius));

    // Add labels
    svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("text-anchor", d => (x(d.code) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start")
        .attr("transform", d => `rotate(${((x(d.code) + x.bandwidth() / 2) * 180 / Math.PI - 90)}) translate(${y(d.gini) + 10},0)`)
        .append("text")
        .text(d => countryNameMap[d.code])  // Use country name from the dictionary instead of the code
        .attr("transform", d => (x(d.code) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)")
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle");

    d3.select('#radial-bar-chart-placeholder').selectAll('*').remove();
}