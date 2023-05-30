async function drawRadarGraph() {
    
    let data = await d3.csv("cleaned_data/summary.csv");


    // Preprocessing the data
    data.forEach(function(d) {
      d.working_hours = +d.working_hours;
      d.population = +d.population;
      d.income_p_hour = +d.income_p_hour;
      d.health_share = +d.health_share;
      d.food_share = +d.food_share;
      d.gini = +d.gini;
    });

    // Initialize radar chart parameters
    const w = 600;
    const h = 600;

    // Create the SVG container for the radar chart
    const svg = d3.select("#radar-chart")
      .append("svg")
      .attr("width", w+200)
      .attr("height", h+400)
      .append("g")
      .attr("transform", `translate(${w / 2}, ${200+h / 2})`);

    // Create a scale for each dimension
    const scales = {
      working_hours: d3.scaleLog().domain(d3.extent(data, d => d.working_hours)).range([0, w / 2]),
      population: d3.scaleLog().domain(d3.extent(data, d => d.population)).range([0, w / 2]),
      income_p_hour: d3.scaleLog().domain(d3.extent(data, d => d.income_p_hour)).range([0, w / 2]),
      health_share: d3.scaleLinear().domain(d3.extent(data, d => d.health_share)).range([0, w / 2]),
      food_share: d3.scaleLinear().domain(d3.extent(data, d => d.food_share)).range([0, w / 2]),
      gini: d3.scaleLinear().domain(d3.extent(data, d => d.gini)).range([0, w / 2]),
    };

    // Define radar chart function
    const drawChart = (data, index) => {
      // Transform data to suitable representation
      data = ["working_hours", "population", "income_p_hour", "health_share", "food_share", "gini"].map((metric, i, array) => ({
        angle: (i / array.length) * 2 * Math.PI,
        radius: scales[metric](data[metric]),
      }));

      // Append the first point to the end of data to close the line
      data.push(data[0]);

      // Create line generator
      const line = d3.lineRadial()
        .angle(d => d.angle)
        .radius(d => d.radius);

      // Append a path for each code
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", d3.schemeCategory10[index % 10])  // Cycle through 10 colors
        .attr("stroke-width", 1.5)
        .attr("d", line);
    };

    // Draw a radar chart for each code
    data.forEach(drawChart);

    // Add axis lines and labels
    const axisNames = ["working_hours", "population", "income_p_hour", "health_share", "food_share", "gini"];
    for (let i = 0; i < axisNames.length; i++) {
      let angle = (i / axisNames.length) * 2 * Math.PI;
      svg.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", w/2 * Math.cos(angle - Math.PI/2))
        .attr("y2", h/2 * Math.sin(angle - Math.PI/2))
        .attr("stroke", "black");

      svg.append("text")
        .attr("x", (w/2 + 10) * Math.cos(angle - Math.PI/2))
        .attr("y", (h/2 + 10) * Math.sin(angle - Math.PI/2))
        .attr("dy", ".35em")
        .text(axisNames[i]);
    }
}

  