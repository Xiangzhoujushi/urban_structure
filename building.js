function load() {
    return new Promise((resolve, reject) => d3.csv("building_v1.csv", (error, data) => {
        if (error) {
            reject(error)
        } else {
            resolve(data);
        }
    }));
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

(async () => {
    let data1 = await load();
    console.log("ddd", data1);
    let width = 960,
        height = 500,
        centered;

    let color_back = d3.scaleLinear()
        .domain([1, 20])
        .clamp(true)
        .range(['#fff', '#409A99']);

    let color_building = d3.scaleLinear()
        .domain([1, 20])
        .clamp(true)
        .range(['#42d9f4', '#040856']);


    let projection = d3.geoMercator()
        .scale(59500)
        .center([-83, 40])
        .translate([width / 2, height / 2]);

    let path = d3.geoPath()
        .projection(projection);

    let svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

    svg.append('rect')
        .attr('class', 'background')
        .attr('width', width)
        .attr('height', height)
        .on('click', clicked);

    let g = svg.append('g');

    let effectLayer = g.append('g')
        .classed('effect-layer', true);

    let mapLayer = g.append('g')
        .classed('map-layer', true);

    mapLayer.selectAll("circle")
        .data(data1).enter()
        .append("circle")
        .attr("cx", function (d) { return projection([d.X, d.Y])[0]; })
        .attr("cy", function (d) { console.log(projection([d.X, d.Y]));return projection([d.X, d.Y])[1]; })
        .attr("r", "0.5px")
        .attr("stroke-width", 0)
        .attr('fill', yearColor)
        .on('click', clicked);
    // Get building color
    function yearColor(d) {
        let n = d.ISSUED_YEAR;
        return color_building((n - 2010) * 2)
    }
    // Get sector type
    function typeLength(d) {
        let n = d.properties.GENERAL_ZONING_CATEGORY;
        let len = n ? n.length : 0
        let res = len - 5
        return res;
    }

    function clicked(d) {
        var x, y, k;

        if (d && centered !== d) {
            var centroid = [d3.event.pageX, d3.event.pageY];
            console.log("cen" + centroid)
            x = centroid[0];
            y = centroid[1];
            k = 4;
            centered = d;
        } else {
            console.log("oops")
            x = width / 2;
            y = height / 2;
            k = 1;
            centered = null;
        }
        g.transition()
            .duration(750)
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
    }

})().catch(e => console.error('uncaught error:', e))