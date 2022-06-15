import * as d3 from "d3";

async function draw() {

  // access data

  const raw = await d3.csv("data/data.csv");

  console.log(raw);

  drawLineChart2(raw, "Overall", "Cultural and Creative Cities Index", "#014494");

  drawLineChart1(raw, "Cultural Vibrancy", "Population (1-5)", ["1", "2", "3", "4", "5"], ["#5c514e", "#7b6f6c", "#9a908b", "#bbb1ac", "#dfd5d0"], "Cultural Vibrancy", "#ebb743");
  drawLineChart1(raw, "Creative economy", "GDP", ["1", "2", "3", "4", "5"], ["#5c514e", "#7b6f6c", "#9a908b", "#bbb1ac", "#dfd5d0"], "Creative Economy", "#3bb1c9");
  drawLineChart1(raw, "Enabling environment", "Employment", ["1", "2", "3", "4", "5"], ["#5c514e", "#7b6f6c", "#9a908b", "#bbb1ac", "#dfd5d0"], "Enabling Environment", "#005640");

  // ["European Capitals of Culture", "UNESCO Creative Cities", "Cities regularly hosting at least two international cultural festivals"]
  // ["#b96f99", "#a63c7a", "#71336e"], "Cultural and Creative Cities Index", "#014494")

  drawBarChart(raw, "Overall", "Country", "Capital", ["Yes", "No"], ["#7090c1", "#d7d8d7"], ["Capital", "Non-capital"], "Cultural and Creative Cities Index", "#014494");
  drawBarChart(raw, "Cultural Vibrancy", "Country", "Capital", ["Yes", "No"], ["#7090c1", "#d7d8d7"], ["Capital", "Non-capital"], "Cultural Vibrancy", "#ebb743");
  drawBarChart(raw, "Creative economy", "Country", "Capital", ["Yes", "No"], ["#7090c1", "#d7d8d7"], ["Capital", "Non-capital"], "Creative Economy", "#3bb1c9");
  drawBarChart(raw, "Enabling environment", "Country", "Capital", ["Yes", "No"], ["#7090c1", "#d7d8d7"], ["Capital", "Non-capital"], "Enabling Environment", "#005640");

  drawBarChart2(raw, "Overall", "Country", "Reason chosen", ["European Capitals of Culture", "UNESCO Creative Cities", "Cities regularly hosting at least two international cultural festivals"], ["#66c2a5", "#fc8d62", "#8da0cb"], ["European Capitals of Culture", "UNESCO Creative Cities", "Cities regularly hosting at least two international cultural festivals"], "", "#014494");

}

function drawLineChart2(raw, yMetric, xAxisText, xAxisFill) {

  // access data

  const yAccessor = d => d[yMetric];

  const colorAccessor = d => d["Capital"];

  const labelAccessor = d => d["City"];

  const data = [...raw]
    .sort((a, b) => yAccessor(b) - yAccessor(a))
    .map((e, i) => ({ rank: i + 1, ...e }));

  const xAccessor = d => d.rank;

  // create chart dimensions

  const dms = {
    width: window.innerWidth * 0.9,
    height: 450,
    margins: {
      top: 15,
      right: 15,
      bottom: 60,
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

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dms.innerWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain([0, 100]) // percentages
    .range([dms.innerHeight, 0])
    .nice();

  // draw data

  let dots = inner
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", d => {
       if (colorAccessor(d) === "Yes") {
        return "#7090c1";
       } else {
        return "#d7d8d7"; 
       }
      })
    .attr("stroke", "#C0C0C0");

  const paris = data.find(element => element["City"] === "Paris");  

  const parisLabel = inner.append("text")
                            .attr("x", xScale(xAccessor(paris)))
                            .attr("y", yScale(yAccessor(paris)) - 25)
                            .text("Paris");

  const parisLine = inner.append("line")
                            .attr("x1", xScale(xAccessor(paris)))
                            .attr("x2", xScale(xAccessor(paris)))
                            .attr("y1", yScale(yAccessor(paris)) - 10)
                            .attr("y2", yScale(yAccessor(paris)) - 20)
                            .attr("stroke", "black");

  const london = data.find(element => element["City"] === "London");  

  const londonLabel = inner.append("text")
                            .attr("x", xScale(xAccessor(london)))
                            .attr("y", yScale(yAccessor(london)) - 25)
                            .text("London");

  const londonLine = inner.append("line")
                            .attr("x1", xScale(xAccessor(london)))
                            .attr("x2", xScale(xAccessor(london)))
                            .attr("y1", yScale(yAccessor(london)) - 10)
                            .attr("y2", yScale(yAccessor(london)) - 20)
                            .attr("stroke", "black");

  const madrid = data.find(element => element["City"] === "Madrid");  

  const madridLabel = inner.append("text")
                                                      .attr("x", xScale(xAccessor(madrid)))
                                                      .attr("y", yScale(yAccessor(madrid)) - 25)
                                                      .text("Madrid");
                          
  const madridLine = inner.append("line")
                                                      .attr("x1", xScale(xAccessor(madrid)))
                                                      .attr("x2", xScale(xAccessor(madrid)))
                                                      .attr("y1", yScale(yAccessor(madrid)) - 10)
                                                      .attr("y2", yScale(yAccessor(madrid)) - 20)
                                                      .attr("stroke", "black");                            

  // draw peripherals

  const yAxisGenerator = d3
    .axisLeft(yScale);

  const yAxis = inner
    .append("g")
    .attr("class", "yAxis")
    .call(yAxisGenerator);

  const xAxisGenerator = d3
    .axisBottom(xScale);

  const xAxis = inner
    .append("g")
    .attr("class", "xAxis")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dms.innerHeight}px)`);


  const xAxisLabel = inner
    .append("text")
    .attr("class", "title")
    .attr("x", dms.innerWidth / 2 - 200)
    .attr("y", 10)
    .attr("fill", xAxisFill)
    .html(xAxisText);
}

function drawLineChart1(raw, yMetric, colorMetric, colorDomain, colorRange, xAxisText, xAxisFill) {

  // access data

  const yAccessor = d => d[yMetric];

  const data = [...raw]
    .sort((a, b) => yAccessor(b) - yAccessor(a))
    .map((e, i) => ({ rank: i + 1, ...e }));

  const xAccessor = d => d.rank;

  const colorAccessor = d => d[colorMetric];

  // create chart dimensions

  const dms = {
    width: window.innerWidth * 0.9,
    height: 450,
    margins: {
      top: 15,
      right: 15,
      bottom: 60,
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

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dms.innerWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain([0, 100]) // percentages
    .range([dms.innerHeight, 0])
    .nice();

  const colorScale = d3.scaleOrdinal()
    .domain(colorDomain)
    .range(colorRange);

  // draw data

  let dots = inner
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", d => colorScale(colorAccessor(d)));

  // draw peripherals

  const yAxisGenerator = d3
    .axisLeft(yScale);

  const yAxis = inner
    .append("g")
    .attr("class", "yAxis")
    .call(yAxisGenerator);

  const xAxisGenerator = d3
    .axisBottom(xScale);

  const xAxis = inner
    .append("g")
    .attr("class", "xAxis")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dms.innerHeight}px)`);

  const xAxisLabel = inner
    .append("text")
    .attr("class", "title")
    .attr("x", dms.innerWidth / 2 - 100)
    .attr("y", 10)
    .attr("fill", xAxisFill)
    .html(xAxisText);

  const legend = inner
    .append("g")
    .style("transform", `translate(
              ${dms.innerWidth - 150}px
            )`);

  const metricText = legend
    .append("text")
    .text("Metric: " + colorMetric);

  colorDomain.forEach((el, i) => {

    legend.append("rect")
      .attr("x", 20)
      .attr("y", (i + 0.5) * 30)
      .attr("height", 20)
      .attr("width", 20)
      .attr("fill", colorRange[i]);

    legend.append("text")
      .attr("y", (i + 1) * 30)
      .text(el);

  });
}

function drawBarChart(data, yMetric, xMetric, colorMetric, colorDomain, colorRange, legendDomain, xAxisText, xAxisFill) {

  // access data

  const xAccessor = d => d[xMetric];

  const yAccessor = d => d[yMetric];
  
  const colorAccessor = d => d[colorMetric];

  // create chart dimensions

  const dms = {
    width: 1000,
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

  const wrapper = d3.select("#wrapper2")
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

  const xScale = d3
    .scaleBand()
    .domain(data.map(xAccessor))
    .range([10, dms.innerWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, 100]) // percentages
    .range([dms.innerHeight, 0])
    .nice();

  const colorScale = d3
    .scaleOrdinal()
    .domain(colorDomain)
    .range(colorRange);

  // draw data

  let dots = inner
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", d => colorScale(colorAccessor(d)))
    .attr("fill-opacity", "0.8");

  // draw peripherals

  const yAxisGenerator = d3
    .axisLeft(yScale);

  const yAxis = inner
    .append("g")
    .attr("class", "yAxis")
    .call(yAxisGenerator);

  const xAxisGenerator = d3
    .axisBottom(xScale);

  const xAxis = inner
    .append("g")
    .attr("class", "xAxis")
    .call(xAxisGenerator)
    .style("transform", `translate(-12px, ${dms.innerHeight}px)`);

  const xAxisLabel = inner
    .append("text")
    .attr("fill", "black")
    .attr("x", dms.innerWidth / 2 - 100)
    .attr("y", dms.margins.bottom - 5)
    .attr("fill", xAxisFill)
    .html(xAxisText);

  const legend = inner
    .append("g")
    .style("transform", `translate(
              ${dms.innerWidth - 150}px
            )`);

  colorDomain.forEach((el, i) => {

    legend.append("rect")
      .attr("y", (i + 0.5) * 30)
      .attr("height", 20)
      .attr("width", 20)
      .attr("fill", colorRange[i]);

    legend.append("text")
      .attr("y", (i + 1) * 30)
      .attr("x", 25)
      .text(legendDomain[i]);

  });
}

function drawBarChart2(data, yMetric, xMetric, colorMetric, colorDomain, colorRange, legendDomain, xAxisText, xAxisFill) {

  // access data

  const xAccessor = d => d[xMetric];

  const yAccessor = d => d[yMetric];
  
  const colorAccessor = d => d[colorMetric];

  // create chart dimensions

  const dms = {
    width: 1000,
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

  const wrapper = d3.select("#wrapper2")
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

  const xScale = d3
    .scaleBand()
    .domain(data.map(xAccessor))
    .range([10, dms.innerWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, 100]) // percentages
    .range([dms.innerHeight, 0])
    .nice();

  const colorScale = d3
    .scaleOrdinal()
    .domain(colorDomain)
    .range(colorRange);

  // draw data

  let dots = inner
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", d => colorScale(colorAccessor(d)))
    .attr("fill-opacity", "0.8");

  // draw peripherals

  const yAxisGenerator = d3
    .axisLeft(yScale);

  const yAxis = inner
    .append("g")
    .attr("class", "yAxis")
    .call(yAxisGenerator);

  const xAxisGenerator = d3
    .axisBottom(xScale);

  const xAxis = inner
    .append("g")
    .attr("class", "xAxis")
    .call(xAxisGenerator)
    .style("transform", `translate(-12px, ${dms.innerHeight}px)`);

  const xAxisLabel = inner
    .append("text")
    .attr("fill", "black")
    .attr("x", dms.innerWidth / 2 - 100)
    .attr("y", dms.margins.bottom - 5)
    .attr("fill", xAxisFill)
    .html(xAxisText);

  const legend = inner
    .append("g")
    .style("transform", `translate(
              ${dms.innerWidth - 450}px
            )`);

  colorDomain.forEach((el, i) => {

    legend.append("rect")
      .attr("y", (i + 0.5) * 30)
      .attr("height", 20)
      .attr("width", 20)
      .attr("fill", colorRange[i]);

    legend.append("text")
      .attr("y", (i + 1) * 30)
      .attr("x", 25)
      .text(legendDomain[i]);

  });
}

draw();