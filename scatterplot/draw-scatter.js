async function drawScatter() {
  const dataset = await d3.json("./my_weather_data.json");
  const yAccessor = (d) => d.humidity;
  const xAccessor = (d) => d.dewPoint;

  const colorAccessor = (d) => d.cloudCover;

  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);

  const dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 50,
      bottom: 50,
      left: 50,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, colorAccessor))
    .range(["skyblue", "darkslategrey"]);

  // dataset.forEach((d) => {
  //   bounds
  //     .append("circle")
  //     .attr("cx", xScale(xAccessor(d)))
  //     .attr("cy", yScale(yAccessor(d)))
  //     .attr("r", 5);
  // });

  const dots = bounds
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", (d) => colorScale(colorAccessor(d)));

  // function drawDots(dataset, color) {
  //   const dots = bounds.selectAll("circle").data(dataset);
  //   dots
  //     .enter()
  //     .append("circle")
  //     .attr("cx", (d) => xScale(xAccessor(d)))
  //     .attr("cy", (d) => yScale(yAccessor(d)))
  //     .attr("r", 5)
  //     .attr("fill", color);
  // }

  // drawDots(dataset.slice(0, 200), "darkgrey");
  // setTimeout(() => {
  //   drawDots(dataset, "cornflowerblue");
  // }, 1000);

  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4);
  const yAxis = bounds.append("g").call(yAxisGenerator);

  const xAxisGenerator = d3.axisBottom().scale(xScale);
  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Dew point (&deg;F)");

  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text("Relative humidity")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle");
}
drawScatter();
