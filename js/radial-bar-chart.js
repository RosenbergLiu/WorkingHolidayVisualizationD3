async function drawRadialBarGraph(){
    let data = await d3.csv("cleaned_data/gini.csv");
    data.forEach(d => {
        d.gini = +d.gini;
    });

    const width = 600;
    const height = 600;
    const innerRadius = 100;
    const outerRadius = Math.min(width, height) / 2;

    const svg = d3.select("#radial-bar-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);



}