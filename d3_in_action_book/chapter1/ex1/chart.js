const someData = ["filler", "filler", "filler", "filler"];

d3.select("body")
  .selectAll("div")
  .data(someData)
  .enter()
  .append("div")
    .html("wow")
    .append("span")
        .html("even more wow")
        .style("font-weight", "900");