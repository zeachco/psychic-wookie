function updateMap(data) {
  var gridw = 64;
  var gridh = 48;
  var gw = 640;
  var gh = 480;

  var xvalues = data.map(function(d) {
    return d.x;
  });
  var left = d3.min(xvalues) - 2;
  var right = d3.max(xvalues) + 2;

  var yvalues = data.map(function(d) {
    return d.y;
  });
  var top = d3.min(yvalues) - 2;
  var bottom = d3.max(yvalues) + 2;

  var xratio = gw / (right - left) / gridw;
  var yratio = gh / (bottom - top) / gridh;

  console.log(xratio, yratio);

  console.debug(data);
  var tiles = d3.select('svg')
    .attr('width', gw)
    .attr('height', gh)
    .selectAll('g').data(data);
  var newtile = tiles.enter().append('g');
  newtile.append('rect');
  newtile.append('text');

  tiles.select('text')
    .text(function(d) {
      return d.id;
    });
  tiles.select('rect')
    .attr("x", function(d) {
      return d.x * gridw * xratio;
    })
    .attr("y", function(d) {
      return d.y * gridh * yratio;
    })
    .attr("opacity", 0.2)
    .attr("width", gridw*0.9)
    .attr("height", gridh*0.9)
    .attr("fill", 'blue');

}
