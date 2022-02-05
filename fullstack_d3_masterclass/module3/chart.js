import * as d3 from "d3";

async function drawBarChart() {

    // access data

    const data = await d3.json("./data/my_weather_data.json");
    const metric = "humidity";

    const metricAccessor = d => d[metric];
    const yAccessor = d => d.length;

    // define chart dimensions

    const width = 600;
    const dms = {
        width,
        height: width * 0.6,
        margins: {
            left: 50,
            bottom: 50,
            top: 30,
            right: 10
        }
    }

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

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, metricAccessor))
        .range([0, dms.innerWidth])
        .nice();

    const binGenerator = d3
        .bin()
        .domain(xScale.domain())
        .value(metricAccessor)
        .thresholds(12);
    const bins = binGenerator(data);

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(bins, yAccessor)])
        .range([dms.innerHeight, 0])
        .nice();

    // draw data

    const binsGroup = inner.append("g");

    const binGroups = binsGroup
        .selectAll("g")
        .data(bins)
        .join("g");

    const barPadding = 1;    
    binGroups
        .append("rect")
            .attr("x", d => xScale(d.x0) + barPadding / 2)
            .attr("y", d => yScale(yAccessor(d)))
            .attr("width", d => xScale(d.x1) - xScale(d.x0) - barPadding)
            .attr("height", d => dms.innerHeight - yScale(yAccessor(d)))
            .attr("fill", "cornflowerblue");

    binGroups
        .append("text")
            .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
            .attr("y", d => yScale(yAccessor(d)) - 5)
            .text(yAccessor)
            .style("text-anchor", "middle")    
            .attr("fill", "darkgrey")
            .style("font-size", "12px")
            .style("font-family", "sans-serif");

    const mean = d3.mean(data, metricAccessor);
    inner
        .append("line")
            .attr("x1", xScale(mean))
            .attr("y1", dms.innerHeight)
            .attr("x2", xScale(mean))
            .attr("y2", -15)       
            .attr("stroke", "maroon")
            .attr("stroke-dasharray", "2px 4px") 
    
    inner
        .append("text")
                .attr("x", xScale(mean))
                .attr("y", -20)
                .attr("fill", "maroon")
                .style("font-size", "12px")
                .style("text-anchor", "middle")
                .text("mean");

    // draw peripherals

    const xAxisGenerator = d3
                    .axisBottom()
                    .scale(xScale);
    
    const xAxis = inner
                    .append("g")
                        .call(xAxisGenerator)
                        .style("transform", `translateY(
                            ${dms.innerHeight}px
                        )`);      
                        
    const xAxisLabel = xAxis
                            .append("text")
                                .attr("x", dms.innerWidth / 2)
                                .attr("y", dms.margins.bottom - 10)
                                .attr("fill", "black")
                                .style("font-size", "1.4em")
                                .text(metric);
}

drawBarChart();