import * as d3 from "d3";

async function drawScatter() {

    // access data

    const rawData = await d3.csv("./data/penguins.csv");
    const data = rawData
                .filter(d => d.flipper_length_mm !== 'NA')
                .filter(d => d.body_mass_g !== 'NA');       

    const xAccessor = d => Number(d.flipper_length_mm);
    const yAccessor = d => Number(d.body_mass_g);
    const colorAccessor = d => d.species;

    // set chart dimensions

    const chartSize = d3.min([window.innerHeight * 0.9, window.innerWidth * 0.9]);

    let dms = {
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
        .domain(d3.extent(data, yAccessor))
        .range([dms.innerHeight, 0])
        .nice();

    const colorScale = d3
        .scaleOrdinal()
        .domain(new Set(data.map(colorAccessor)))
        .range(["#ffc695", "#97c7c8", "#ce96f4"])

    // draw data

    const radius = 5;

    const dots = inner
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("r", radius)
                .attr("cx", d => xScale(xAccessor(d)))
                .attr("cy", d => yScale(yAccessor(d)))
                .attr("fill", d => colorScale(colorAccessor(d)));   

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
    
    const yAxisGenerator = d3
        .axisLeft()        
        .scale(yScale);

    const yAxis = inner 
        .append("g")
        .call(yAxisGenerator);  
        
    const yAxisLabel = yAxis
                .append("text")
                .   attr("x", -dms.innerHeight / 2)
                    .attr("y", -dms.margins.left + 10)
                    .attr("transform", "rotate(-90)")
                    .attr("fill", "black")
                    .style("font-size", "1.4em")
                    .style("text-anchor", "middle")
                    .text("Body mass (g)");

    // draw interactions
    
    dots.on("mousedown", onMouseDown);

    function onMouseDown(event, d) {
        d3.select(event.currentTarget)
                .attr("opacity", 0);                       

        inner.append("rect")
                .attr("x", xScale(xAccessor(d)) - radius)
                .attr("y", yScale(yAccessor(d)) - radius)
                .attr("fill", colorScale(colorAccessor(d)))
                .attr("height", 10)
                .attr("width", 10)
                .style("stroke-width", "1px")
                .style("stroke", "black")
                .on("mouseup", onMouseUp);
    }   
    
    function onMouseUp() {
        dots.attr("opacity", 1);
        
        inner.selectAll("rect").remove();                             
    }
}

drawScatter();