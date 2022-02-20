async function drawBarChart() {

    // access data

    const data = await d3.json("../data/tweets.json");
    const tweets = data.tweets;

    tweets.forEach(d => {
        d.impact = d.retweets.length + d.favorites.length;
        d.tweetTime = new Date(d.timestamp)
    });

    const dataAccessor = d => d.impact;
    const timeAccessor = d => d.tweetTime;
    const labelAccessor = d => `${d.user}-${d.tweetTime.getHours()}`;

    // define dimensions

    const width = 900;
    const dms = {
        height: width * 0.6,
        width: width,
        margins: {
            top: 30,
            right: 10,
            bottom: 50,
            left: 50
        }
    };

    dms.innerWidth = dms.width - dms.margins.left - dms.margins.right;
    dms.innerHeight = dms.height - dms.margins.top - dms.margins.bottom;

    // draw canvas

    const svg = d3.select("body")
                    .append("svg")
                        .attr("width", dms.width)
                        .attr("height", dms.height);
    
    const g = svg
                .append("g")
                .style("transform", `translate(
                        ${dms.margins.left}px, 
                        ${dms.margins.top}px)`); 
                        
    // define scales
    
    const xScale = d3.scaleTime()
                        .domain(d3.extent(tweets, timeAccessor))
                        .range([0, dms.innerWidth])
                        .nice()                   
    
    const yScale = d3.scaleLinear()
                            .domain(d3.extent(tweets, dataAccessor))
                            .range([dms.innerHeight, 0])
                            .nice();
    
    const radiusScale = d3.scaleLinear()
                            .domain(d3.extent(tweets, dataAccessor))
                            .range([1, 20])
                            .nice();
    
    const colorScale = d3.scaleLinear()
                                .domain(d3.extent(tweets, dataAccessor))
                                .range(["cornflowerblue", "maroon"]);

    // draw data

    const groups = g.selectAll("g")
                        .data(tweets, JSON.stringify) // by default data binds based on the array position of the data value
                        .enter()
                        .append("g")
                            .style("transform", d => `translate(
                                ${xScale(timeAccessor(d))}px,
                                ${yScale(dataAccessor(d))}px
                            )`);

    const circles = groups
                        .append("circle")
                            .attr("r", d => radiusScale(dataAccessor(d)))
                            .attr("fill", d => colorScale(dataAccessor(d))); 

    const labels = groups
                        .append("text")
                            .text(d => labelAccessor(d));                            
}

drawBarChart();