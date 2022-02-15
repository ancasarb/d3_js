import * as d3 from "d3";

async function drawLineChart() {

  // access data
  
  const data = await d3.json("data/my_weather_data.json");

  const yAccessor = d => d.temperatureMax;

  const parseDate = d3.timeParse("%Y-%m-%d");
  const xAccessor = d => parseDate(d.date);

  // create chart dimensions

  const dms = {
    width: window.innerWidth * 0.9,
    height: 400,
    margins: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60
    }
  }

  dms.innerWidth = dms.width - dms.margins.left - dms.margins.right;
  dms.innerHeight = dms.height - dms.margins.top - dms.margins.bottom;

  // draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dms.width)
      .attr("height", dms.height);

  const inner = wrapper
    .append("g")
      // translate towards right and bottom
      .style("transform", `translate(
        ${dms.margins.left}px,
        ${dms.margins.top}px
      )`);

  // create scales 

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dms.innerHeight, 0]);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dms.innerWidth]);

  // draw data  

  const yTemperaturePlacement = yScale(32);

  inner
    .append("rect")
      .attr("x", 0)
      .attr("y", yTemperaturePlacement)
      .attr("height", dms.innerHeight - yTemperaturePlacement)
      .attr("width", dms.innerWidth)
      .attr("fill", "#e0f3f3"); // lower precedence than .style("fill", ...) and can be overriden from CSS stylesheets

  const lineGenerator = d3
    .line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)));

  inner
    .append("path")
      .attr("d", lineGenerator(data))
      .attr("fill", "none")
      .attr("stroke", "#af9358")
      .attr("stroke-width", 2);

  // draw peripherals
  
  const yAxisGenerator = d3
    .axisLeft(yScale);

  const yAxis = inner
    .append("g")
    .call(yAxisGenerator);

  const xAxisGenerator = d3
    .axisBottom(xScale);

  const xAxis = inner
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dms.innerHeight}px)`);  
}

drawLineChart();