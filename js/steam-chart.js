
async function drawStreamGraph(){

    let data = await d3.csv("age.csv")
    let margin = {top: 20, right: 20, bottom: 50, left: 50};
    let container = d3.select("#steam-chart-container").node().getBoundingClientRect();
    let containerWidth = container.width;

    let width = containerWidth - margin.left - margin.right;
    let height = 600 - margin.top - margin.bottom;


    let keys = data.columns.slice(1);

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


    let svg = d3.select("#steam-chart")
        .attr("viewBox", [0, 0, width, height]);




    let paths = svg.selectAll("path")
        .data(series)
        .join("path")
        .attr("fill", ({key}) => color(key))
        .attr("d", area)
        .on("mouseout", mouseOut)
        .on('mouseover', mouseOver)
        .on('click', mouseClick);



    svg.selectAll("mylabels")
        .data(series)
        .join("text")
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .style("font-size", 10)
        .style("fill", ({key}) => color(key))
        .attr("transform", function(d) {
            return "translate(" + (margin.right) + "," + (y((d[0][0]+d[0][1])/2)) + ")";
        })
        .text(({key}) => key)


    function mouseClick(event, d) {
        // Remove the current graph
        d3.select('#steam-chart').selectAll('*').remove();
        d3.select('#back-button').style('display', 'block');
        drawLineGraph(d.key);
    }

    function mouseOut() {
        d3.select(this)
            .style('fill-opacity', null)
            .style('stroke', null)
            .style('stroke-width', null);
        svg.selectAll('path')
            .style('fill-opacity', null);
    }
    function mouseOver() {

        svg.selectAll('path')
            .style('fill-opacity', 0.5);
        d3.select(this)
            .style('fill-opacity', 1)
            .style('stroke', 'black')
            .style('stroke-width', '2');
    }

    // Axes
    let xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80));


    svg.append("g")
        .call(xAxis);

}
