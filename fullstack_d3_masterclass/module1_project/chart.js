import * as d3 from "d3";

async function drawLineChart() {

    // access data

    const rawData = (await d3
        .csv("data/HistoricalLighthouses.csv"))
        .filter(d => d.YearBuilt != 0);

    const rolledUpData = Array.from(
        d3.rollup(rawData, 
            v => v.length, 
            d => d.YearBuilt),
        ([name, value]) => 
            ({ YearBuilt: name, Count: value })
        )
        .sort((x, y) => d3.ascending(x.YearBuilt, y.YearBuilt));

    const parseYear = d3.timeParse("%Y");

    const xAccessor = d => parseYear(d.YearBuilt);
    const yAccessor = d => d.Count;

    // create dimensions  

    const dms = {
        height: 400,
        width: window.innerWidth * 0.9,
        margins: {
            top: 15,
            bottom: 40,
            left: 60,
            right: 15
        }
    };

    dms.innerWidth = dms.width - dms.margins.left - dms.margins.right;
    dms.innerHeight = dms.height - dms.margins.top - dms.margins.bottom;

    // draw canvas

    const wrapper = d3
        .select("#wrapper")
        .append("svg")
            .attr("width", dms.width)
            .attr("height", dms.height);

    const inner = wrapper
        .append("g")
            .style("transform", `translate(
                ${dms.margins.left}px,
                ${dms.margins.top}px
            )`);

    // create scales

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(rolledUpData, yAccessor))
        .range([dms.innerHeight, 0]);

    const xScale = d3
        .scaleTime()
        .domain(d3.extent(rolledUpData, xAccessor))
        .range([0, dms.innerWidth]);

    // draw data

    const lineGenerator = d3
        .line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)));

    inner
        .append("path")
            .attr("d", lineGenerator(rolledUpData))
            .attr("fill", "none")
            .attr("stroke", "#af9358")
            .attr("stroke-width", 2);

    // draw peripherals

    const yAxisGenerator = d3
        .axisLeft(yScale)

    const yAxis = inner
        .append("g")
        .call(yAxisGenerator);

    const xAxisGenerator = d3
        .axisBottom(xScale)

    const xAxis = inner
        .append("g")
        .call(xAxisGenerator)
            .style("transform", `translateY(${dms.innerHeight}px)`);
}

drawLineChart();