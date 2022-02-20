const randomLetters = function () {
    return d3.shuffle("abcdefghijklmnopqrstuvwxyz".split(""))
        .slice(0, Math.floor(6 + Math.random() * 20))
        .sort();
}

function drawLetters(svg) {
    svg.selectAll("text")
        .data(randomLetters(), d => d)
        .join(
            enter => enter.append("text")
                .attr("fill", "green")
                .text(d => d),
            update => update
                .attr("fill", "gray")
        )
        .attr("x", (d, i) => i * 16);

    // or alterantively, the standard enter/exit/update pattern    

    // const textUpdate = svg.selectAll("text")
    //     .data(randomLetters(), d => d);
    
    // textUpdate.attr("fill", "gray");

    // const textEnter = textUpdate.enter()
    //                                 .append("text")
    //                                     .attr("fill", "green");

    // textEnter.merge(textUpdate)
    //     .text(d => d)
    //     .attr("x", (d, i) => i * 16);
    
    // textUpdate.exit().remove();    
}

async function createContent() {
    const width = 900;
    const svg = d3.select("body")
                    .append("svg")
                        .attr("width", width)
                        .attr("height", 33)
                        .attr("viewBox", `0 -20 ${width} 33`);

    drawLetters(svg);
    drawLetters(svg);   
}

createContent();


  

