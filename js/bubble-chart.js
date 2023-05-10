d3.json("cleaned_data/productivity-vs-annual-hours-worked(1950-2019).json").then(bubble);


function bubble(data) {
    const margin = {top: 20, right: 20, bottom: 50, left: 50};

    const container = d3.select("#bubble-chart-container").node().getBoundingClientRect();
    const containerWidth = container.width;

    const width = containerWidth - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;


    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);
    const sizeScale = d3.scaleSqrt().range([5, 25]);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select("#bubble-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    xScale.domain([0, d3.max(data, d => d.pophw) * 1.5]);
    yScale.domain(d3.extent(data, d => d.awhpw));
    sizeScale.domain(d3.extent(data, d => d.population));

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);


    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);


    // Add x axis label
    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .text("Productivity output per hour worked (USD)");

    // Add y axis label
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -margin.left + 15)
        .text("Annual working hours per worker (Hour)");


    const yearSlider = d3.select("#year-slider");
    const currentYear = yearSlider.node().value;

    const continents = Array.from(new Set(data.map(d => d.continent))).filter(continent => continent !== undefined);


    updateBubbleChart(currentYear);
    createColorLegend();

    yearSlider.on("input", () => {
        const selectedYear = yearSlider.node().value;
        updateBubbleChart(selectedYear);
        d3.select("#year-display").text(selectedYear);
    });

    function updateBubbleChart(year) {
        const filteredData = data.filter(d => d.year === year);
        const bubbles = svg.selectAll(".bubble")
            .data(filteredData, d => d.entity);

        bubbles.exit().remove();

        const bubblesEnter = bubbles.enter()
            .append("g")
            .attr("class", "bubble")
            .on("mouseover", mouseOver)
            .on("mouseout", mouseOut);


        bubblesEnter.append("circle")
            .attr("r", d => sizeScale(d.population))
            .attr("fill", d => colorScale(d.continent))
            .attr("opacity", 0.8);

        bubblesEnter.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", d => `-${sizeScale(d.population) + 5}px`)
            .text(d => d.entity)
            .style("font-size", "8px")
            .style("opacity", 0.8);

        bubblesEnter.merge(bubbles)
            .transition()
            .duration(300)
            .attr("transform", d => `translate(${xScale(d.pophw)}, ${yScale(d.awhpw)})`);


    }

    function mouseOver(event, d) {
        d3.selectAll(".bubble")
            .transition()
            .duration(200)
            .style("opacity", 0.2);

        d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1);


        svg.append("text")
            .attr("class", "population-text")
            .attr("x", xScale(d.pophw))
            .attr("y", yScale(d.awhpw) + sizeScale(d.population) + 15)
            .text(d.population + "M")
            .style("font-size", "12px");

        svg.append("text")
            .attr("class", "productivity-text")
            .attr("x", xScale(d.pophw))
            .attr("y", yScale(d.awhpw) + sizeScale(d.population) + 30)
            .text(d.pophw + "USD/Hour")
            .style("font-size", "12px");

        svg.append("text")
            .attr("class", "hour-text")
            .attr("x", xScale(d.pophw))
            .attr("y", yScale(d.awhpw) + sizeScale(d.population) + 45)
            .text(d.awhpw + "Hours")
            .style("font-size", "12px");


        d3.select(this).select("text")
            .style("font-weight", "bold")
            .style("opacity", 1)
            .style("font-size", "12px");

    }

    function mouseOut() {
        d3.selectAll(".bubble")
            .transition()
            .duration(200)
            .style("opacity", 1);
        svg.selectAll(".population-text").remove();
        svg.selectAll(".productivity-text").remove();
        svg.selectAll(".hour-text").remove();
        d3.select(this).select("text")
            .style("font-weight", "normal")
            .style("opacity", 0.8)
            .style("font-size", "8px");
    }

    function createColorLegend() {
        const legend = svg.append("g")
            .attr("class", "color-legend")
            .attr("transform", "translate(" + (width - 150) + "," + (height - 400) + ")");

        const legendItems = legend.selectAll(".legend-item")
            .data(continents)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * 30})`)
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                const hidden = event.currentTarget.classList.toggle("hidden");
                const color = hidden ? "white" : colorScale(d);
                d3.select(event.currentTarget).select("rect").attr("fill", color);
                d3.selectAll(".bubble").filter(b => b.continent === d).style("display", hidden ? "none" : "");
            });

        legendItems.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", d => colorScale(d))
            .style("stroke", "black");

        legendItems.append("text")
            .attr("x", 25)
            .attr("y", 15)
            .text(d => d);
    }


}

