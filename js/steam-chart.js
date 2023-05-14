d3.csv("age.csv").then(data => {
    const margin = {top: 20, right: 20, bottom: 50, left: 50};
    const container = d3.select("#steam-chart-container").node().getBoundingClientRect();
    const containerWidth = container.width;

    const width = containerWidth - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;


    const keys = data.columns.slice(1);

    let stackGen = d3.stack()
        .keys(keys)
        .offset(d3.stackOffsetWiggle);

    let series = stackGen(data);

    let x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.age))
        .range([margin.left, width - margin.right]);

    let y = d3.scaleLinear()
        .domain([
            d3.min(series, a => d3.min(a, d => d[1])),
            d3.max(series, a => d3.max(a, d => d[1]))
        ])
        .range([height - margin.bottom, margin.top]);

    let area = d3.area()
        .x(d => x(d.data.age))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))
        .curve(d3.curveCardinal);

    let color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeTableau10);




    const svg = d3.select("#steam-chart")
        .attr("viewBox", [0, 0, width, height]);

    svg.selectAll("path")
        .data(series)
        .join("path")
        .attr("fill", ({key}) => color(key))
        .attr("d", area);

    // Axes
    let xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80));



    svg.append("g")
        .call(xAxis);

});
