async function drawLineGraph(data, key= null){
    let country = await fetchCountryName(key);
    document.getElementById('income-age-header').innerHTML = `Income in each age: ${country}`;

    let margin = {top: 20, right: 20, bottom: 50, left: 50};
    let container = d3.select("#steam-chart-container").node().getBoundingClientRect();
    let containerWidth = container.width;

    // Define width and height based on container dimensions and margins
    let width = containerWidth - margin.left - margin.right;
    let height = 800 - margin.top - margin.bottom;

    let x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.age))
        .range([margin.left, width - margin.right]);

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[key])])
        .range([height - margin.bottom, margin.top]);

    // Define line generator
    let line = d3.line()
        .x(d => x(d.age))
        .y(d => y(d[key]))
        .curve(d3.curveCardinal);

    // Define SVG
    let svg = d3.select("#steam-chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);
    // Draw line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Define and draw axes
    let xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80));
    let yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    let xAxisGrid = d3.axisBottom(x)
        .tickSize(-height)
        .ticks(10); // Adjust for more or fewer lines

    let yAxisGrid = d3.axisLeft(y)
        .tickSize(-width)
        .ticks(10); // Adjust for more or fewer lines

    svg.append("g")
        .call(xAxis)
        .attr('class', 'x grid')
        .call(xAxisGrid);

    svg.append("g")
        .call(yAxis)
        .attr('class', 'y grid')
        .call(yAxisGrid);

    d3.select('#back-to-steam').on('click', function () {
        // Remove the current graph
        d3.select('#steam-chart').selectAll('*').remove();

        // Hide the back button and show the streamgraph
        d3.select('#back-to-steam').style('display', 'none');
        d3.select('#steam-chart').style('display', 'block');

        // Draw the streamgraph
        drawStreamGraph();
    });


}