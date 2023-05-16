
async function drawStreamGraph(){
    document.getElementById('poverty-rate-age-header').innerHTML = 'Poverty rate by Age';
    let data = await d3.csv("cleaned_data/age.csv")
    data.forEach(function(d) {
        d.age = +d.age;
    });
    let margin = {top: 20, right: 20, bottom: 50, left: 50};
    let container = d3.select("#steam-chart-container").node().getBoundingClientRect();
    let containerWidth = container.width;

    let width = containerWidth - margin.left - margin.right;
    let height = 800 - margin.top - margin.bottom;


    let keys = data.columns.slice(1);

    let countryNameMap = {};
    for(let code of keys){
        countryNameMap[code] = await fetchCountryName(code);
    }

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

    let color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeTableau10);


    let svg = d3.select("#steam-chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    let area = d3.area()
        .x(d => x(d.data.age))
        .y0(d => y(d[0]))
        .y1(d => y(d[0]))
        .curve(d3.curveCardinal);


    svg.selectAll("path")
        .data(series)
        .join("path")
        .attr("fill", ({key}) => color(key))
        .attr("d", area)
        .on("mouseout", mouseOut)
        .on('mouseover', mouseOver)
        .on('click', mouseClick)
        .transition() // Start a transition
        .duration(1000) // Set the duration to 1000 milliseconds
        .attr("d", d3.area() // Use a new area generator for the transition
            .x(d => x(d.data.age))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]))
            .curve(d3.curveCardinal));



    svg.selectAll("country_labels")
        .data(series)
        .join("text")
        .attr("class", "country_labels")
        .attr("id", d => `label-${d.key}`)
        .attr("dy", ".35em")
        .style("font-size", 10)
        .style("font-family", "'Barlow Condensed', sans-serif")
        .style("fill", ({key}) => color(key))
        .attr("transform", function(d) {
            return "translate(" + (margin.right-20) + "," + (y((d[0][0]+d[0][1])/2)) + ")";
        })
        .text(d => countryNameMap[d.key])




    function mouseClick(event, d) {
        // Remove the current graph
        d3.select('#steam-chart').selectAll('*').remove();
        d3.select('#back-to-steam').style('display', 'block');
        drawLineGraph(data, d.key);
    }


    function mouseOver(event, d) {

        svg.selectAll('path')
            .style('fill-opacity', 0.5);
        d3.select(this)
            .style('fill-opacity', 1)
            .style('stroke', 'black')
            .style('stroke-width', '2');

        svg.selectAll('.country_labels')
            .style('fill-opacity',0.1);
        svg.select(`#label-${d.key}`)  // Select the text element with the corresponding id
            .style('fill', ({key}) => color(key))
            .style('fill-opacity',1);
    }

    function mouseOut() {
        d3.select(this)
            .style('fill-opacity', null)
            .style('stroke', null)
            .style('stroke-width', null);
        svg.selectAll('path')
            .style('fill-opacity', null);

        svg.selectAll('.country_labels')  // Reset the style of all text elements
            .style('fill', ({key}) => color(key))
            .style('fill-opacity',1);
    }

    // Axes
    let xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80));


    svg.append("g")
        .call(xAxis);
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Age");
    d3.select('#steam-chart-placeholder').selectAll('*').remove();
}
