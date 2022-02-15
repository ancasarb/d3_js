const svg = d3
            .select("#wizcontainer")
            .append("svg")
                .attr("width", 500)
                .attr("height", 500)
                .style("border", "1px lightgray solid");

svg.append("line")
        .attr("x1", 20)
        .attr("y1", 20)
        .attr("x2", 400)
        .attr("y2", 400)
        .style("stroke-width", "2px")
        .style("stroke", "black");

svg.append("circle")
        .attr("cx", 20)
        .attr("cy", 20)
        .attr("r", 20)  
        .attr("fill", "red");        

 const helloText = svg.append("text")
        .attr("x", 20)
        .attr("y", 20)
        .style("opacity", 0)
        .text("hello");
        
svg.append("circle")
        .attr("cx", 400)
        .attr("cy", 400)
        .attr("r", 100)  
        .attr("fill", "lightblue");
        
const worldText = svg.append("text")
        .attr("x", 400)
        .attr("y", 400)
        .style("opacity", 0)
        .text("world");   
        
helloText
    .transition()
    .delay(1000)
    .style("opacity", 1);  

worldText
    .transition()
    .delay(1000)
    .style("opacity", 0.75);        

d3.selectAll("circle")
    .transition()
    .duration(2000)
    .attr("cy", 200);

        