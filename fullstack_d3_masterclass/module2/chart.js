import * as d3 from "d3";

async function drawScatter() {

    // access data

    const data = await d3.json("./data/my_weather_data.json");

    const xAccessor = d => d.dewPoint;
    const yAccessor = d => d.humidity;
    const colorAccessor = d => d.cloudCover;

    // create chart dimensions

    const chartSize = d3.min([window.innerHeight * 0.9, window.innerHeight * 0.9]);

    const dms = {
        width: chartSize,
        height: chartSize,
        margins: {
            top: 10,
            right: 10,
            bottom: 50,
            left: 50
        }
    };

    dms.innerHeight = dms.height - dms.margins.top - dms.margins.bottom;
    dms.innerWidth = dms.width - dms.margins.left - dms.margins.right;

    // draw canvas

    const wrapper = d3
        .select("#wrapper")
        .append("svg")
            .attr("width", dms.width)
            .attr("height", dms.height);
    
    const inner = wrapper
        .append("g")
        .style("transform", `translate(${dms.margins.left}px,
                                    ${dms.margins.top}px)`);

    // create scales

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, xAccessor))
        .range([0, dms.innerWidth])
        .nice();

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, yAccessor))
        .range([dms.innerHeight, 0])
        .nice();
     
    const colorScale = d3
            .scaleLinear()
            .domain(d3.extent(data, colorAccessor))
            .range(["skyblue", "darkslategrey"]);

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

    const xAxisGenerator = d3
        .axisBottom()
        .scale(xScale);

    const xAxis = inner
            .append("g")
            .call(xAxisGenerator)
            .style("transform", `translateY(${dms.innerHeight}px)`);

    const xAxisLabel = xAxis
            .append("text")
                .attr("fill", "black")
                .attr("x", dms.innerWidth / 2)
                .attr("y", dms.margins.bottom - 10)  
                .style("font-size", "1.4em")
                .html("Dew point (&deg;F)");
                
    const yAxisGenerator = d3
        .axisLeft()
        .scale(yScale)
        .ticks(5);
    
    const yAxis = inner
            .append("g")
            .call(yAxisGenerator);

    const yAxisLabel = yAxis
        .append("text")
            .attr("x", -dms.innerHeight / 2)
            .attr("y", -dms.margins.left + 10)
            .attr("transform", "rotate(-90)")
            .attr("fill", "black")
            .style("font-size", "1.4em")
            .style("text-anchor", "middle")
            .text("Relative humidity");
}

drawScatter();