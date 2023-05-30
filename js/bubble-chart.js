async function drawBubbleChart(){

    let data = await d3.csv("cleaned_data/data.csv")
    let margin = {top: 20, right: 20, bottom: 50, left: 50};

    let container = d3.select("#bubble-chart-container").node().getBoundingClientRect();
    let containerWidth = container.width;

    let width = containerWidth - margin.left - margin.right;
    let height = 600 - margin.top - margin.bottom;

    let xScale = d3.scaleLinear().range([0, width]);
    let yScale = d3.scaleLinear().range([height, 0]);
    let sizeScale = d3.scaleSqrt().range([5, 25]);
    let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    let svg = d3.select("#bubble-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    xScale.domain([0, 55]);
    yScale.domain(d3.extent(data, d => d.working_hours));
    sizeScale.domain(d3.extent(data, d => d.population));

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);
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
        .text("Income per hour worked (USD)");

    // Add y axis label
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -margin.left + 15)
        .text("Annual working hours per worker (Hour)");


    let yearSlider = d3.select("#year-slider");
    let currentYear = yearSlider.node().value;

    let continents = Array.from(new Set(data.map(d => d.continent))).filter(continent => continent !== undefined);


    updateBubbleChart(currentYear);
    createColorLegend();

    yearSlider.on("input", () => {
        let selectedYear = yearSlider.node().value;
        updateBubbleChart(selectedYear);
        d3.select("#year-display").text(selectedYear);
    });

    function updateBubbleChart(year) {
        let filteredData = data.filter(d => d.year === year);
        let bubbles = svg.selectAll(".bubble")
            .data(filteredData, d => d.entity);

        bubbles.exit().remove();

        let bubblesEnter = bubbles.enter()
            .append("g")
            .attr("class", "bubble")
            .on("mouseover", mouseOver)
            .on("mouseout", mouseOut);


        bubblesEnter.append("circle")
            .attr("r", d => sizeScale(d.population)/2)
            .attr("fill", d => colorScale(d.continent))
            .attr("opacity", 0.8);

        bubblesEnter.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", d => `-${sizeScale(d.population)/1.5}px`)
            .text(d => d.entity)
            .style("font-size", "8px")
            .style("opacity", 0.8);

        bubblesEnter.attr("transform", d => `translate(${xScale(d.income_p_hour)}, ${yScale(d.working_hours)})`);
        bubblesEnter.merge(bubbles)
            .transition()
            .duration(300)
            .attr("transform", d => `translate(${xScale(d.income_p_hour)}, ${yScale(d.working_hours)})`);


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
            .attr("x", xScale(d.income_p_hour))
            .attr("y", yScale(d.working_hours) + sizeScale(d.population) + 5)
            .text(d.population + " Million population")
            .style("font-size", "12px");

        svg.append("text")
            .attr("class", "productivity-text")
            .attr("x", xScale(d.income_p_hour))
            .attr("y", yScale(d.working_hours) + sizeScale(d.population) + 20)
            .text(d.income_p_hour + " USD/Hour")
            .style("font-size", "12px");

        svg.append("text")
            .attr("class", "hour-text")
            .attr("x", xScale(d.income_p_hour))
            .attr("y", yScale(d.working_hours) + sizeScale(d.population) + 35)
            .text(d.working_hours + " Hours/Year")
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
        let legend = svg.append("g")
            .attr("class", "color-legend")
            .attr("transform", "translate(" + (width - 150) + "," + (height - 400) + ")");

        let legendItems = legend.selectAll(".legend-item")
            .data(continents)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * 30})`)
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                let hidden = event.currentTarget.classList.toggle("hidden");
                let color = hidden ? "white" : colorScale(d);
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


    d3.select('#bubble-chart-placeholder').selectAll('*').remove();
}

