import * as d3 from "d3";

async function drawBarChart() {

    const rawData = await d3.csv("./data/penguins.csv");
    const data = rawData
                .filter(d => d.flipper_length_mm !== 'NA');   

    drawChart(filterSpecies(data, "Adelie"));
    drawChart(filterSpecies(data, "Gentoo"));
    drawChart(filterSpecies(data, "Chinstrap"));
}

const filterSpecies = function(data, species) {
    return data.filter(d => d.species === species);
}

function drawChart(data) {

    // access data
    const xAccessor = d => d.flipper_length_mm;
    const yAccessor = d => d.length;

    // specify chart dimensions

    const width = 600;
    const dms = {
        width,
        height: width * 0.6,
        margins: {
            top: 50,
            right: 10,
            left: 60,
            bottom: 60
        }
    }

    dms.innerWidth = dms.width - dms.margins.left - dms.margins.right;
    dms.innerHeight = dms.height - dms.margins.bottom - dms.margins.top;

    // draw canvas

    const wrapper = d3.select("#wrapper")
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
                    .domain(d3.extent(data, xAccessor))
                    .range([0, dms.innerWidth])
                    .nice();     

    const binsGenerator = d3
                            .bin()
                            .domain(xScale.domain())
                            .value(xAccessor)
                            .thresholds(12);

    const bins = binsGenerator(data);

    const yScale = d3
                    .scaleLinear()
                    .domain(d3.extent(bins, yAccessor))
                    .range([dms.innerHeight, 0])
                    .nice();             
    
    // draw data

    const binsGroup = inner.append("g");

    const binGroups = binsGroup
                        .selectAll("g")
                        .data(bins)
                        .join("g");

    const barPadding = 1;
    const barRects = binGroups
                        .append("rect")
                            .attr("x", d => xScale(d.x0) + barPadding / 2)
                            .attr("y", d => yScale(yAccessor(d)))
                            .attr("width", d => xScale(d.x1) - xScale(d.x0) - barPadding)
                            .attr("height", d => dms.innerHeight - yScale(yAccessor(d)))
                            .attr("fill", "cornflowerblue");

    const barLabels = binGroups
                        .append("text")
                            .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
                            .attr("y", d => yScale(yAccessor(d)) - 5)
                            .attr("fill", "black")
                            .style("text-anchor", "middle")
                            .attr("fill", "darkgrey")
                            .style("font-size", "12px")
                            .style("font-family", "sans-serif")
                            .text(yAccessor);

    const mean = d3.mean(data, xAccessor)                        
    const meanLine = inner
                        .append("line")
                            .attr("x1", xScale(mean))
                            .attr("y1", -15)
                            .attr("x2", xScale(mean))
                            .attr("y2", dms.innerHeight)     
                            .attr("stroke", "maroon")
                            .attr("stroke-dasharray", "2px 4px");

    const meanLabel = inner
                        .append("text")
                            .attr("x", xScale(mean))
                            .attr("y", -20)
                            .attr("text-anchor", "middle")
                            .attr("fill", "maroon")
                            .style("font-size", "12px")
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
                            .text("Flipper length (mms)");
}

drawBarChart();