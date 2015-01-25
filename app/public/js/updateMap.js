function updateMap(data) {
  var gridw = 60;
  var gridh = 60;
  var gw = 640;
  var gh = 480;

  var xvalues = data.map(function(d) {
    return d.x;
  });
  var left = d3.min(xvalues) - 1;
  var right = d3.max(xvalues) + 1;

  var yvalues = data.map(function(d) {
    return d.y;
  });
  var top = d3.min(yvalues) - 1;
  var bottom = d3.max(yvalues) + 1;

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

  tiles.select('rect')
    .attr("x", function(d) {
      return d.x * gridw * xratio;
    })
    .attr("y", function(d) {
      return d.y * gridh * yratio;
    })
    .attr("width", gridw)
    .attr("height", gridh)
    .attr("fill", 'blue');

}
