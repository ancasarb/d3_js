import * as d3 from "d3";

async function drawRects() {
  const rectColors = [
    "yellowgreen",
    "cornflowerblue",
    "seagreen",
    "slateblue",
  ];

  const wrapper = d3.select("#wrapper")
                      .append("svg")
                      .attr("height", 500)
                      .attr("width", 500);

  const rects = wrapper.selectAll("rect")
                       .data(rectColors)
                       .join("rect")
                           .attr("x", (d, i) => i * 110)
                           .attr("y", 100)
                           .attr("height", 100)
                           .attr("width", 100)
                           .attr("fill", "lightgrey");

  rects.on("mouseenter", (event, d) => {
    const rect = d3.select(event.currentTarget);
    rect.attr("fill", d);
  }); 
  
  rects.on("mouseleave", (event) => {
    const rect = d3.select(event.currentTarget);
    rect.attr("fill", "lightgrey");
  }); 

  setTimeout(() => {
    rects.dispatch("mouseleave")
          .on("mouseenter", null)
          .on("mouseleave", null);
  }, 3000);
}

drawRects();

