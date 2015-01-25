function updateMap(data) {
  var uw = 30;
  var uh = 30;
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

  var virtualWidth = right - left;
  var virtualHeight = bottom - top;

  var xratio = gw / virtualWidth;
  var yratio = gh / virtualHeight;

  console.log(xratio, yratio);

  console.debug(data);
  var tiles = d3.select('svg')
    .attr('width', gw)
    .attr('height', gh)
    .selectAll('g').data(data);
  var newtile = tiles.enter().append('g').attr('class', 'tile');
  newtile.append('rect');
  newtile.append('text');

  tiles
    .on('click', function(d) {
      console.log(this);
    });
  tiles.select('text')
    .text(function(d) {
      return d.id;
    });
  tiles.select('rect')
    .attr("x", function(d) {
      return left + d.x * xratio;
    })
    .attr("y", function(d) {
      return top + d.y * yratio;
    })
    .attr("width", 40)
    .attr("height", 40)
    .attr("fill", function(d) {
      return d.havePlayer ? 'yellow' : 'blue';
    });

}
