import * as d3 from "d3";

async function drawChart() {

    // access data

    const dataset = await d3.json("./data/my_weather_data.json");
    
    const temperatureMinAccessor = d => d.temperatureMin;
    const temperatureMaxAccessor = d => d.temperatureMax;
    const uvAccessor = d => d.uvIndex;
    const precipitationProbabilityAccessor = d => d.precipProbability;
    const precipitationTypeAccessor = d => d.precipType;
    const cloudCoverAcccessor = d => d.cloudCover;
    const dateParser = d3.timeParse("%Y-%m-%d");
    const dateAccessor = d => dateParser(d.date);

    // create chart dimensions

    const width = 600;
    const dms =  {
        height: width,
        width: width,
        radius: width / 2,
        margin: {
            top: 120,
            left: 120,
            right: 120,
            bottom: 120
        }
    }

    dms.innerWidth = dms.width - dms.margin.left - dms.margin.right;
    dms.innerHeight = dms.height - dms.margin.bottom - dms.margin.top;
    dms.innerRadius = dms.radius - ((dms.margin.left + dms.margin.right) / 2);

    // draw canvas

    const wrapper = d3.select("#wrapper")
                        .append("svg")
                            .attr("height", dms.height)
                            .attr("width", dms.width);

    const inner = wrapper
                    .append("g")
                        .style("transform",`translate(
                            ${dms.margin.left + dms.innerRadius}px,
                            ${dms.margin.top + dms.innerRadius}px
                        )`);   
                        
    const defs = wrapper.append("defs");
    const gradientId = "temperature-gradient";
    const gradient = defs.append("radialGradient")
                            .attr("id", gradientId);

    const numberOfStops = 10;
    const gradientColorScale = d3.interpolateYlOrRd;    
    d3.range(numberOfStops).forEach(i => {
        gradient.append("stop")
                    .attr("offset", `${i * 100 / (numberOfStops -1)}%`)
                    .attr("stop-color", gradientColorScale(i / (numberOfStops -1)));
    });                    

    // create scales
    
    const angleScale = d3.scaleTime()
                            .domain(d3.extent(dataset, dateAccessor))
                            .range([0, Math.PI * 2]); // radians, or can also use degrees

    const radiusScale = d3.scaleLinear()
                            .domain(d3.extent([
                                ...dataset.map(temperatureMinAccessor),
                                ...dataset.map(temperatureMaxAccessor)
                            ]))
                            .range([0, dms.innerRadius])
                            .nice();         

    const cloudRadiusScale = d3.scaleSqrt()
                                .domain(d3.extent(dataset, cloudCoverAcccessor))
                                .range([1, 10]);

    const precipitationRadiusScale = d3.scaleSqrt()
                                .domain(d3.extent(dataset, precipitationProbabilityAccessor))
                                .range([0, 8]); 
                                
    const precipitationTypes = ["rain", "sleet", "snow"];
                                
    const precipitationTypeColorScale = d3.scaleOrdinal()
                                            .domain(precipitationTypes)
                                            .range(["#54a0ff", "#636e72", "#b2bec3"]);  
                                            
    const temperatureColorScale = d3.scaleSequential()
                                            .domain(d3.extent([
                                            ...dataset.map(temperatureMaxAccessor),
                                            ...dataset.map(temperatureMinAccessor),
                                            ]))
                                            .interpolator(gradientColorScale);                                        
       
    const getCoordinatesForAngle = (angle, offset = 1) => [
        Math.cos(angle - Math.PI / 2) * dms.innerRadius * offset, // x
        Math.sin(angle - Math.PI / 2) * dms.innerRadius * offset // y
    ];                            

    const getXFromDataPoint = (d, offset = 1.4) => getCoordinatesForAngle(angleScale(dateAccessor(d)), offset)[0];
    
    const getYFromDataPoint = (d, offset = 1.4) => getCoordinatesForAngle(angleScale(dateAccessor(d)), offset)[1];

    // draw peripherals, part 1
    
    const peripherals = inner.append("g");

    const months = d3.timeMonth.range(...angleScale.domain());

    months.forEach(month => {
        const angle = angleScale(month);
        const [x, y] = getCoordinatesForAngle(angle, 1);

        peripherals.append("line")
                        .attr("x2", x)
                        .attr("y2", y)
                        .attr("class", "grid-line");

        const [labelX, labelY] = getCoordinatesForAngle(angle, 1.38);   
        
        peripherals.append("text")
                        .attr("x", labelX)
                        .attr("y", labelY)
                        .attr("class", "tick-label")
                        .text(d3.timeFormat("%b")(month))
                        .style("text-anchor", 
                            Math.abs(labelX) < 5 ? "middle" : labelX > 0 ? "start" : "end"
                        );


    });

    const temperatureTicks = radiusScale.ticks(4);
    const gridCircles = temperatureTicks.map( d => {
        peripherals.append("circle")
                        .attr("r", radiusScale(d))
                        .attr("class", "grid-line")
    });

    const tickLabelBackgrounds = temperatureTicks.map(d => {
        if (d < 1) return ;
        peripherals.append("rect")
                        .attr("y", - radiusScale(d) - 10)
                        .attr("width", 40)
                        .attr("height", 20)
                        .attr("fill", "#f8f9fa");
    });

    const gridLabels = temperatureTicks.map(d => {
        if (d < 1) return ;
        peripherals.append("text")
                        .attr("y", - radiusScale(d) + 2)
                        .attr("x", 4)
                        .attr("class", "tick-label-temperature")
                        .html(`${d3.format(".0f")(d)}°F`);
    });

    // draw data

    const freezingCircle = inner.append("circle")
                                    .attr("r", radiusScale(32))
                                    .attr("class", "freezing-circle");

    const areaGenerator = d3.areaRadial()
                                .angle(d => angleScale(dateAccessor(d)))
                                .innerRadius(d => radiusScale(temperatureMinAccessor(d)))
                                .outerRadius(d => radiusScale(temperatureMaxAccessor(d)));                            
    const area = inner.append("path")
                        .attr("d", areaGenerator(dataset))
                        .style("fill", `url(#${gradientId})`);

    const uvIndexThreshold = 8;
    const uvGroup = inner.append("g");
    const uvOffset = 0.95;
    const highUvDays = uvGroup.selectAll("line")
                                .data(dataset.filter(d => uvAccessor(d) > uvIndexThreshold))
                                .join("line")
                                .attr("class", "uv-line")
                                .attr("x1", d => getXFromDataPoint(d, uvOffset))
                                .attr("x2", d => getXFromDataPoint(d, uvOffset + 0.1))
                                .attr("y1", d => getYFromDataPoint(d, uvOffset))
                                .attr("y2", d => getYFromDataPoint(d, uvOffset + 0.1));

    const cloudGroup = inner.append("g");
    const cloudOffset = 1.27;
    const cloudDots = cloudGroup.selectAll("circle")
                                    .data(dataset)
                                    .join("circle")
                                        .attr("class", "cloud-dot")
                                        .attr("r", d => cloudRadiusScale(cloudCoverAcccessor(d)))
                                        .attr("cx", d => getXFromDataPoint(d, cloudOffset))
                                        .attr("cy", d => getYFromDataPoint(d, cloudOffset));
    
    const precipitationGroup = inner.append("g");
    const precipitationOffset = 1.14;
    const precipitationDots = precipitationGroup.selectAll("circle")
                                    .data(dataset)
                                    .join("circle")
                                        .attr("class", "precipitation-dot")
                                        .style("fill", d => precipitationTypeColorScale(precipitationTypeAccessor(d)))
                                        .attr("r", d => precipitationRadiusScale(precipitationProbabilityAccessor(d)))
                                        .attr("cx", d => getXFromDataPoint(d, precipitationOffset))
                                        .attr("cy", d => getYFromDataPoint(d, precipitationOffset)); 

    // draw peripherals, part 2

    const annotationsGroup = inner.append("g");
    const drawAnnotation = (angle, offset, text) => {
        const [x1, y1] = getCoordinatesForAngle(angle, offset);
        const [x2, y2] = getCoordinatesForAngle(angle, 1.6);

        annotationsGroup.append("line")
                            .attr("class", "annotation-line")
                            .attr("x1", x1)
                            .attr("y1", y1)
                            .attr("x2", x2)
                            .attr("y2", y2);

        annotationsGroup.append("text")
                            .attr("class", "annotation-text")
                            .attr("x", x2 + 6)
                            .attr("y", y2)
                            .text(text);                            
    }

    drawAnnotation(Math.PI * 0.23, cloudOffset, "Cloud Cover");
    drawAnnotation(Math.PI * 0.26, precipitationOffset, "Precipitation");
    drawAnnotation(Math.PI * 0.734, uvOffset, `UV Index over ${uvIndexThreshold}`);
    drawAnnotation(Math.PI * 0.7, 0.5, "Temperature");
    drawAnnotation(Math.PI * 0.9, radiusScale(32) / dms.innerRadius, "Freezing Temperature");

    precipitationTypes.forEach((precipitationType, index) => {
        const labelCoordinates = getCoordinatesForAngle(Math.PI * 0.26, 1.6);
        annotationsGroup.append("circle")
                            .attr("r", 4)
                            .attr("cx", labelCoordinates[0] + 15)
                            .attr("cy", labelCoordinates[1] + (16 * (index + 1)))
                            .attr("fill", precipitationTypeColorScale(precipitationType))
                            .style("opacity", 0.7);

        annotationsGroup.append("text")
                            .attr("x", labelCoordinates[0] + 25)
                            .attr("y", labelCoordinates[1] + (16 * (index + 1)))
                            .text(precipitationType)
                            .attr("class", "annotation-text");
    });

    // set up interactions

    const listenerCircle = inner.append("circle")
                                    .attr("r", dms.width / 2)
                                    .attr("class", "listener-circle")
                                    .on("mousemove", onMouseMove)
                                    .on("mouseleave", onMouseLeave);

    const tooltip = d3.select("#tooltip");
    const tooltipLine = inner.append("path")
                                .attr("class", "tooltip-line");

    function onMouseMove (e) {
        const [x, y] = d3.pointer(e);

        const getAngleFromCoordinates = (x, y) =>  Math.atan2(y, x);

        let angle = getAngleFromCoordinates(x, y) + Math.PI / 2;
        if (angle < 0) { 
            angle = (Math.PI * 2) + angle;
        }

        const tooltipArcGenerator = d3.arc()
                                        .innerRadius(0)
                                        .outerRadius(dms.innerRadius * 1.6)
                                        .startAngle(angle - 0.015)
                                        .endAngle(angle + 0.015)

        tooltipLine.attr("d", tooltipArcGenerator())
                    .style("opacity", 1); 
                    
        const outerCoordinates = getCoordinatesForAngle(angle, 1.6);
        tooltip.style("opacity", 1)
                .style("transform", `translate(calc(${
          outerCoordinates[0] < - 50 ? "40px - 100" :
          outerCoordinates[0] > 50 ? "-40px + 0" :
          "-50"
        }% + ${
          outerCoordinates[0]
            + dms.margin.top
            + dms.innerRadius
        }px), calc(${
          outerCoordinates[1] < - 50 ? "40px - 100" :
          outerCoordinates[1] > 50 ? "-40px + 0" :
          "-50"
        }% + ${
          outerCoordinates[1]
            + dms.margin.top
            + dms.innerRadius
        }px))`)

    const date = angleScale.invert(angle)
    const dateString = d3.timeFormat("%Y-%m-%d")(date)
    const dataPoint = dataset.filter(d => d.date == dateString)[0]
    if (!dataPoint) return

    tooltip.select("#tooltip-date")
        .text(d3.timeFormat("%B %-d")(date))
    tooltip.select("#tooltip-temperature-min")
        .html(`${d3.format(".1f")(
          temperatureMinAccessor(dataPoint))
        }°F`)
    tooltip.select("#tooltip-temperature-max")
        .html(`${d3.format(".1f")(
          temperatureMaxAccessor(dataPoint))
        }°F`)
    tooltip.select("#tooltip-uv")
        .text(uvAccessor(dataPoint))
    tooltip.select("#tooltip-cloud")
        .text(cloudCoverAcccessor(dataPoint))
    tooltip.select("#tooltip-precipitation")
        .text(d3.format(".0%")(
          precipitationProbabilityAccessor(dataPoint)
        ))
    tooltip.select("#tooltip-precipitation-type")
        .text(precipitationTypeAccessor(dataPoint))
    tooltip.select(".tooltip-precipitation-type")
        .style("color", precipitationTypeAccessor(dataPoint)
          ? precipitationTypeColorScale(
              precipitationTypeAccessor(dataPoint)
            )
          : "#dadadd")
    tooltip.select("#tooltip-temperature-min")
        .style("color", temperatureColorScale(
          temperatureMinAccessor(dataPoint)
        ))
    tooltip.select("#tooltip-temperature-max")
        .style("color", temperatureColorScale(
          temperatureMaxAccessor(dataPoint)
        ))
    }
    
    function onMouseLeave() {
        tooltip.style("opacity", 0);
        tooltipLine.style("opacity", 0);
    }
}

drawChart();