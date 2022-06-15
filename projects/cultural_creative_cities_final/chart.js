import * as d3 from "d3";

async function main() {

  const data = await d3.csv("data/data.csv");

  function drawFirstDropdown() {
    let options = d3
    .select(".dropdown")
    .select("ul")
    .selectAll("li")
    .data(data.sort(function(x, y){
      return d3.ascending(x["City"], y["City"]);
    }))
    .enter()
    .append("li")
    .html(d => "<input type='radio' name='option' value='" + d["City"] +"'/>" + d["City"]);

    $(".dropdown dt a").on('click', function() {
      $(".dropdown dd ul").slideToggle('fast');
    });
    
    $(".dropdown dd ul li a").on('click', function() {
      $(".dropdown dd ul").hide();
    });
    
    $(document).bind('click', function(e) {
      var $clicked = $(e.target);
      if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
    });
    
    $('.dropdown input[type="radio"]').on('click', function() {
      if ($(this).is(':checked')) $('.chosen').text($(this).val());
      $(".dropdown-translated").show();
      drawVisualization($('.chosen').text(), $('.comparable').text());
    });
  }

  function drawSecondDropdown() {
    let options = d3
    .select(".dropdown-translated")
    .select("ul")
    .selectAll("li")
    .data(data.sort(function(x, y){
      return d3.ascending(x["City"], y["City"]);
    }))
    .enter()
    .append("li")
    .html(d => "<input type='radio' name='option' value='" + d["City"] +"'/>" + d["City"]);
  
    $(".dropdown-translated dt a").on('click', function() {
      $(".dropdown-translated dd ul").slideToggle('fast');
    });
    
    $(".dropdown-translated dd ul li a").on('click', function() {
      $(".dropdown-translated dd ul").hide();
    });
    
    $(document).bind('click', function(e) {
      var $clicked = $(e.target);
      if (!$clicked.parents().hasClass("dropdown-translated")) $(".dropdown-translated dd ul").hide();
    });
    
    $('.dropdown-translated input[type="radio"]').on('click', function() {
      if ($(this).is(':checked')) $('.comparable').text($(this).val());
      drawVisualization($('.chosen').text(), $('.comparable').text());
    });
  }

  const dms = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  const wrapper = d3.select("#wrapper")
  .append("svg")
  .attr("width", dms.width)
  .attr("height", dms.height);

  function drawFirstLine(label, item, accessor, y, color, style) {

    const defaultColor = "#d7d8d7";
    const defaultRadius = "4";

    const minRange = 500;
    const maxRange = 950;

    function drawCircle(x) {

      wrapper.append("circle")
      .attr("cx", scale(x))
      .attr("cy", y)
      .attr("r", defaultRadius)
      .attr("fill", accessor(item) >= x ? color: defaultColor);  
    }

    const scale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([minRange, maxRange])
    .nice();

    wrapper.append("text")
            .style("fill", "black")
            .attr("x", 10)
            .attr("y", y + 5)
            .html(label)
            .attr("font-style", style);
  
    wrapper.append("text")
            .style("fill", "black")
            .attr("x", minRange - 75)
            .attr("y", y + 5)
            .attr("text-anchor", "end")
            .text(d3.format(".2f")(accessor(item)));      

    wrapper.append("line")
              .attr("x1", minRange)
              .attr("y1", y)
              .attr("x2", maxRange)
              .attr("y2", y)
              .attr("stroke", defaultColor)
              .attr("stroke-width", "3");

    wrapper.append("line")
              .attr("x1", minRange)
              .attr("y1", y)
              .attr("x2", scale(accessor(item)))
              .attr("y2", y)
              .attr("stroke", color)
              .attr("stroke-width", "3");
              
    drawCircle(0); 
    drawCircle(25); 
    drawCircle(50); 
    drawCircle(75);
    drawCircle(100);
  }

  function drawSecondLine(item, accessor, y, color) {

    const defaultColor = "#d7d8d7";
    const defaultRadius = "4";

    const minRange = 1200;
    const maxRange = 1650;

    function drawCircle(x) {

      wrapper.append("circle")
      .attr("cx", scale(x))
      .attr("cy", y)
      .attr("r", defaultRadius)
      .attr("fill", accessor(item) >= x ? color: defaultColor);  
    }

    const scale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([minRange, maxRange])
    .nice();

    wrapper.append("text")
            .style("fill", "black")
            .attr("x", minRange - 75)
            .attr("y", y + 5)
            .attr("text-anchor", "end")
            .text(d3.format(".2f")(accessor(item)));         

    wrapper.append("line")
              .attr("x1", minRange)
              .attr("y1", y)
              .attr("x2", maxRange)
              .attr("y2", y)
              .attr("stroke", defaultColor)
              .attr("stroke-width", "3");

    wrapper.append("line")
              .attr("x1", minRange)
              .attr("y1", y)
              .attr("x2", scale(accessor(item)))
              .attr("y2", y)
              .attr("stroke", color)
              .attr("stroke-width", "3");
              
    drawCircle(0); 
    drawCircle(25); 
    drawCircle(50); 
    drawCircle(75);
    drawCircle(100);
  }

  function drawRect(color, x, value) {

    const tooltip = wrapper.append("g");

    const rect = wrapper.append("rect")
    .attr("x", x)
    .attr("y", 25)
    .attr("height", "30")
    .attr("width", "30")
    .attr("fill", color);

    rect.on("mouseenter", onMouseEnter)
        .on("mouseleave", onMouseLeave);
            
    function onMouseEnter(event, d) {
      tooltip 
        .append("line")
        .attr("x1", x + 15)
        .attr("y1", 15)
        .attr("x2", x + 15)
        .attr("y2", 25)
        .attr("stroke", "black");

      tooltip
        .append("text")
        .attr("x", x + 25)
        .attr("y", 10)
        .style("fill", "black")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(value);
                   
      tooltip.style("opacity", 1);
    
    }
              
    function onMouseLeave(event) {
      tooltip.style("opacity", 0);
    }
  }

  function drawVisualization(selected, comparable) {
    $("svg").empty();

    let record = data.find(d => d["City"] == selected);

    console.log(record);

    drawRect(record["Capital"] == "Yes" ? "#7090c1" : "#d7d8d7", 500, "Country Capital");
    drawRect(record["Reason chosen"] == "European Capital of Culture" ? "#b96f99" : record["Reason chosen"] == "UNESCO Creative City" ? "#a63c7a" : "#71336e", 600, record["Reason chosen"]);
    drawRect(record["Population (1-5)"] == "1" ? "#5c514e" : record["Population (1-5)"] == "2" ? "#7b6f6c" : record["Population (1-5)"] == "3" ? "#9a908b" : record["Population (1-5)"] == "4" ? "#bbb1ac" : "#dfd5d0", 700,
    "Population: " + (record["Population (1-5)"] == "1" ? "> 1 million" : record["Population (1-5)"] == "2" ? "500,000 - 1 million" : record["Population (1-5)"] == "3" ? "250,000 - 500,000" : record["Population (1-5)"] == "4" ? "100,000 - 250,000" : "50,000 - 100,000"));    
    drawRect(record["GDP"] == "1" ? "#5c514e" : record["GDP"] == "2" ? "#7b6f6c" : record["GDP"] == "3" ? "#9a908b" : record["GDP"] == "4" ? "#bbb1ac" : "#dfd5d0", 800,
    "GDP: " + (record["GDP"] == "1" ? "> 35,000" : record["GDP"] == "2" ? "30,000 - 35,000" : record["GDP"] == "3" ? "25,000 - 30,000" : record["GDP"] == "4" ? "20,000 - 25,000" : "< 20,000"));    
    drawRect(record["Employment"] == "1" ? "#5c514e" : record["Employment"] == "2" ? "#7b6f6c" : record["Employment"] == "3" ? "#9a908b" : record["Employment"] == "4" ? "#bbb1ac" : "#dfd5d0", 900,
    "Employment: " + (record["Employment"] == "1" ? "> 74%" : record["Employment"] == "2" ? "71-74%" : record["Employment"] == "3" ? "68-71%" : record["Employment"] == "4" ? "65-68%" : "< 65%"));

    drawFirstLine("Overall Cultural and Creative Cities Index", record,  d => d["Overall"], 90, "#014494", "italic");
    
    drawFirstLine("&nbsp&nbsp&nbsp&nbspCultural Vibrancy", record,  d => d["Cultural Vibrancy"], 130, "#ebb743", "italic");
    drawFirstLine("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspCultural Venues & Facilities", record,  d => d["D1.1 Cultural Venues & Facilities"], 160, "#ebb743", "regular");
    drawFirstLine("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspCultural Participation & Attractiveness", record,  d => d["D1.2 Cultural Participation & Attractiveness"], 190, "#ebb743", "regular");
  
    drawFirstLine("&nbsp&nbsp&nbsp&nbspCreative Economy", record,  d => d["Creative economy"], 230, "#3bb1c9", "italic");
    drawFirstLine("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspCreative & Knowledge-based Jobs", record,  d => d["D2.1 Creative & Knowledge-based Jobs"], 260, "#3bb1c9", "regular");
    drawFirstLine("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspIntellectual Property & Innovation", record,  d => d["D2.2 Intellectual Property & Innovation"], 290, "#3bb1c9", "regular");
    drawFirstLine("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspNew Jobs in Creative Sectors", record,  d => d["D2.3 New Jobs in Creative Sectors"], 320, "#3bb1c9", "regular");
  
    drawFirstLine("&nbsp&nbsp&nbsp&nbspEnabling Environment", record,  d => d["Enabling environment"], 360, "#005641", "italic");
    drawFirstLine("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspHuman Capital & Education", record,  d => d["D3.1 Human Capital & Education"], 390, "#005641", "regular");
    drawFirstLine("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspOpenness, Tolerance & Trust", record,  d => d["D3.2 Openness, Tolerance & Trust "], 420, "#005641", "regular");
    drawFirstLine("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspLocal & International Connections", record,  d => d["D3.3 Local & International Connections"], 450, "#005641", "regular");
    drawFirstLine("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspQuality of Governance", record,  d => d["D3.4 Quality of Governance"], 480, "#005641", "regular");

    if (comparable != "compare with...") {
      record = data.find(d => d["City"] == comparable);
      console.log(record);
      drawRect(record["Capital"] == "Yes" ? "#7090c1" : "#d7d8d7", 1200, "Country Capital");
      drawRect(record["Reason chosen"] == "European Capital of Culture" ? "#b96f99" : record["Reason chosen"] == "UNESCO Creative City" ? "#a63c7a" : "#71336e", 1300, record["Reason chosen"]);
      drawRect(record["Population (1-5)"] == "1" ? "#5c514e" : record["Population (1-5)"] == "2" ? "#7b6f6c" : record["Population (1-5)"] == "3" ? "#9a908b" : record["Population (1-5)"] == "4" ? "#bbb1ac" : "#dfd5d0", 1400,
      "Population: " + (record["Population (1-5)"] == "1" ? "> 1 million" : record["Population (1-5)"] == "2" ? "500,000 - 1 million" : record["Population (1-5)"] == "3" ? "250,000 - 500,000" : record["Population (1-5)"] == "4" ? "100,000 - 250,000" : "50,000 - 100,000"));   
      drawRect(record["GDP"] == "1" ? "#5c514e" : record["GDP"] == "2" ? "#7b6f6c" : record["GDP"] == "3" ? "#9a908b" : record["GDP"] == "4" ? "#bbb1ac" : "#dfd5d0", 1500,
      "GDP: " + (record["GDP"] == "1" ? "> 35,000" : record["GDP"] == "2" ? "30,000 - 35,000" : record["GDP"] == "3" ? "25,000 - 30,000" : record["GDP"] == "4" ? "20,000 - 25,000" : "< 20,000"));  
      drawRect(record["Employment"] == "1" ? "#5c514e" : record["Employment"] == "2" ? "#7b6f6c" : record["Employment"] == "3" ? "#9a908b" : record["Employment"] == "4" ? "#bbb1ac" : "#dfd5d0", 1600,
      "Employment: " + (record["Employment"] == "1" ? "> 74%" : record["Employment"] == "2" ? "71-74%" : record["Employment"] == "3" ? "68-71%" : record["Employment"] == "4" ? "65-68%" : "< 65%"));
   
      drawSecondLine(data.find(d => d["City"] == comparable),  d => d["Overall"], 90, "#014494");
      
      drawSecondLine(data.find(d => d["City"] == comparable),  d => d["Cultural Vibrancy"], 130, "#ebb743");
      drawSecondLine(data.find(d => d["City"] == comparable),  d => d["D1.1 Cultural Venues & Facilities"], 160, "#ebb743");
      drawSecondLine(data.find(d => d["City"] == comparable),  d => d["D1.2 Cultural Participation & Attractiveness"], 190, "#ebb743");
    
      drawSecondLine(data.find(d => d["City"] == comparable),  d => d["Creative economy"], 230, "#3bb1c9");
      drawSecondLine(data.find(d => d["City"] == comparable),  d => d["D2.1 Creative & Knowledge-based Jobs"], 260, "#3bb1c9");
      drawSecondLine(data.find(d => d["City"] == comparable),  d => d["D2.2 Intellectual Property & Innovation"], 290, "#3bb1c9");
      drawSecondLine(data.find(d => d["City"] == comparable),  d => d["D2.3 New Jobs in Creative Sectors"], 320, "#3bb1c9");
    
      drawSecondLine(data.find(d => d["City"] == comparable),  d => d["Enabling environment"], 360, "#005641");
      drawSecondLine(data.find(d => d["City"] == comparable),  d => d["D3.1 Human Capital & Education"], 390, "#005641");
      drawSecondLine(data.find(d => d["City"] == comparable),  d => d["D3.2 Openness, Tolerance & Trust "], 420, "#005641");
      drawSecondLine(data.find(d => d["City"] == comparable),  d => d["D3.3 Local & International Connections"], 450, "#005641");
      drawSecondLine(data.find(d => d["City"] == comparable),  d => d["D3.4 Quality of Governance"], 480, "#005641");
    }
  }

  drawFirstDropdown();
  drawSecondDropdown();
}


main();