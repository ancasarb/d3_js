async function drawBarChart() {

    // access data

    const data = await d3.json("../data/tweets.json");
    const tweets = data.tweets;

    const keyAccessor = d => d.user;
    const transformedTweets = d3.group(tweets, keyAccessor);
    transformedTweets.forEach(d => d.numTweets = d.length);

    const nestedTweets = [...transformedTweets].map(d => d[1]);

    const yAccessor = d => d.numTweets;

    // define dimensions
    const width = 900;
    const dms = {
        height: width * 0.8,
        width: width,
        margins: {
            top: 10,
            right: 10,
            bottom: 50,
            left: 50
        }
    }

    dms.innerHeight = dms.height - dms.margins.top - dms.margins.bottom;
    dms.innerWidth = dms.width - dms.margins.left - dms.margins.right;

    // draw canvas

    const svg = d3.select("body")
        .append("svg")
            .attr("width", dms.width)
            .attr("height", dms.height);

    const inner = svg
        .append("g")
            .style("transform", `translate(${dms.margins.left}px,
                                                        ${dms.margins.right}px`);

    // define scales

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(nestedTweets, yAccessor)])
        .range([dms.innerHeight, 0])
        .nice();

    console.log(nestedTweets);   

    // draw data                    

    const bars = inner.selectAll("rect")
        .data(nestedTweets)
        .enter()
        .append("rect")
            .attr("x", (d, i) => i * 60)
            .attr("y", d => yScale(yAccessor(d)))
            .attr("width", 50)
            .attr("height", d => dms.innerHeight - yScale(yAccessor(d)))
            .attr("fill", "cornflowerblue")
            .attr("stroke", "black")
            .attr("stroke-width", "1px");
}

drawBarChart();