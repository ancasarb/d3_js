async function drawCities() {

    // access data

    const data = await d3.csv("../data/cities.csv");
    const labelAccessor = d => d.label;

    // define dimensions

    const dms =  {
        height: 100,
        width: 100
    };

    // draw data

    d3.select("body")
      .selectAll("div.cities")
      .data(data)
      .enter()
      .append("div")
        .attr("class", "cities")
        .html(labelAccessor);

}

drawCities();