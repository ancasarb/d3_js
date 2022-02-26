async function draw() {

  // access data

  const data = await d3.csv("../data/worldcup.csv");

  const teamMetric = "team";
  const regionMetric = "region";

  const xAccessor = d => d[teamMetric];
  const regionAccessor = d => d[regionMetric];

  const keys = Object.keys(data[0]).filter(m => m !== teamMetric && m !== regionMetric);

  // create dimensions

  const dms = {
    height: 150,
    width: 1000,
    margins: {
      top: 30,
      bottom: 50,
      left: 50,
      right:10
    }
  }

  dms.innerHeight = dms.height - dms.margins.top - dms.margins.bottom;
  dms.innerWidth = dms.width - dms.margins.left - dms.margins.right;

  // draw canvas

  const svg = d3.select("#viz")
                  .append("svg")
                    .attr("height", dms.height)
                    .attr("width", dms.width);

  const g = svg.append("g")
                  .style("transform", `translate(
                    ${dms.margins.left}px,
                    ${dms.margins.top}px
                  )`);

  // create scales
  
  const fourColorScale = d3.scaleOrdinal()
                              .domain((["UEFA", "CONMEBOL", "CONCACAF", "AFC"]))
                              .range(["#5eafc6", "#fe9922", "#93c464", "#fcbc34"]);
                  
  // draw data
  
  const teamGroups = g.selectAll("g")
                        .data(data, xAccessor)
                        .enter()
                        .append("g")
                          .attr("class", "teamGroups")
                          .style("transform", (d, i) => `translateX(
                                                          ${i * 100}px
                                                    )`)
                          .on("mouseover", function (event, d) {
                            // d3.select(this)
                                                g.selectAll("circle")
                                                    .attr("class", c => c.region === d.region ? "active": "inactive");
                          })
                          .on("mouseout", function(event, d) {
                                                g.selectAll("circle").classed("active", false).classed("inactive", false);
                          });                                                   

  const teamCircles = teamGroups.append("circle")
                                    .transition()
                                    .delay((d, i) => i * 500)
                                    .attr("r", 40)
                                    .transition()
                                    .duration(500)
                                    .attr("r", 20);   

  const teamTexts = teamGroups.append("text")
                                .attr("y", 30)
                                .text(xAccessor); 
                                
  // draw peripherals                     
  
  const buttons = d3.select("#controls")
                      .selectAll("button")
                      .data(keys)
                      .enter()
                        .append("button")
                          .on("click", function (event, key) {
                                        // access data
                                        const radiusAccessor = d => parseFloat(d[key]);
                                    
                                        // define scales
                                        const maxValue = d3.max(data, radiusAccessor);
                                        const radiusScale = d3.scaleLinear()
                                                                .domain([0, maxValue])
                                                                .range([2, 20]);

                                        const colorScale = d3.scaleLinear()
                                                                .domain([0,maxValue ])
                                                                .range(["yellow", "blue"])
                                                                // .interpolate(d3.interpolateLab);
                                                                .interpolate(d3.interpolateHsl);
                                        // re-draw data                            
                                        g.selectAll("circle")
                                            .transition()
                                            .duration(1000)
                                            .attr("r", d => radiusScale(radiusAccessor(d)))
                                            .style("fill", d => colorScale(radiusAccessor(d)));
                             })
                          .html(d => d);

    //html table

    const tableHtml = await d3.text("infobox.html");
    d3.select("body")
        .append("div")
           .attr("id", "infobox")
           .html(tableHtml);
    
    teamGroups.on("click", function(event, d){
      d3.selectAll("td.data")
            .data(Object.values(d))
            .html(p => p);
    });

    //external svg
    
    const externalSvgData = await d3.html("noun-football-1907.svg");
    
    teamGroups.each(function(d) {
      const parent = d3.select(this)
                          .append("g")
                          .style("transform", "translate(-10px, 50px)")
                          .node();
      
    d3.select(externalSvgData)
            .selectAll("path")
            .each(function() {
              parent.appendChild(this.cloneNode(true));
            });
    });

    teamGroups.each(function(d) {
      d3.select(this).selectAll("path").datum(d);
    });
    
    teamGroups.selectAll("path")
                  .style("fill", p => fourColorScale(regionAccessor(p)));

  }

draw();