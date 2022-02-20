async function drawBarChart() {

    // access data

    const data = [14,68, 24500, 430, 19, 1000, 5555];
    const yAccessor = d => d;

    // define dimensions

    const dms = {
        height: 500,
        width: 500,
        margins: {
            top: 10,
            right: 10,
            bottom: 50,
            left: 50
        }
    };

    dms.innerHeight = dms.height - dms.margins.top - dms.margins.bottom;
    dms.innerWidth = dms.innerWidth - dms.margins.left - dms.margins.right;

    // draw canvas

    const svg = d3.select("body")
                  .append("svg")
                    .attr("width", dms.width)
                    .attr("height", dms.height);

    const g = svg.append("g")
                    .style("transform", `translate(
                        ${dms.margins.left}px,
                        ${dms.margins.top}px
                        )`);  
    
    // create scales  
    
    const yScale = d3.scaleLinear()
                        .domain([0, d3.max(data, yAccessor)])
                        .range([dms.innerHeight, 0])
                        .clamp(true);

    // draw data
    
    const bars = g.selectAll("rect")
                    .data(data)
                    .enter()
                    .append("rect")
                        .attr("x", (d, i) => i * 25)
                        .attr("y", d => yScale(d))
                        .attr("height", d => dms.innerHeight - yScale(d))
                        .attr("width", 20)
                        .attr("fill", "cornflowerblue")
                        .style("stroke-width", "1px")
                        .style("stroke", "black");
}

drawBarChart();