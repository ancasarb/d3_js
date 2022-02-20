async function drawBarChart() {

    // access data

    const data = await d3.csv("../data/cities.csv");
    const yAccessor = d => parseInt(d.population);

    // define dimensions

    const dms = {
        height: 500,
        width: 900,
        margins: {
            left: 50,
            bottom: 50,
            right: 10,
            top: 10
        } 
    };

    dms.innerHeight = dms.height - dms.margins.bottom - dms.margins.top;
    dms.innerWidth = dms.width - dms.margins.left - dms.margins.right;

    // create canvas

    const svg = d3
                    .select("body")
                    .append("svg")
                        .attr("height", dms.height)
                        .attr("width", dms.width);

    const g = svg
                .append("g")
                    .style("transform", `translate(
                        ${dms.margins.left}px,
                        ${dms.margins.top}px
                    )`);   
                    
    // create scales
    
    const yScale = d3
                        .scaleLinear()
                        .domain([0, d3.max(data, yAccessor)])
                        .range([dms.innerHeight, 0])
                        .nice();                    

    // draw data

    const rects = g
                    .selectAll("rect")
                    .data(data)
                    .enter()
                    .append("rect")
                        .attr("x", (d, i) => i * 60)
                        .attr("y", d => yScale(yAccessor(d)))
                        .attr("height", d => dms.innerHeight - yScale(yAccessor(d)))
                        .attr("width", 50)
                        .attr("fill", "cornflowerblue")
                        .style("stroke-width", "1px")
                        .style("stroke", "black");
}

drawBarChart();