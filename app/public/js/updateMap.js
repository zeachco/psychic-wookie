var uw = 30;
var uh = 30;
var gw = 640;
var gh = 480;

function updateWindow(){
  gw = w.innerWidth || e.clientWidth || g.clientWidth;
  gh = w.innerHeight|| e.clientHeight|| g.clientHeight;

}
window.onresize = updateWindow;

function updateMap(data) {

  var xvalues = data.map(function(d) {
    return d.x;
  });
  var left = d3.min(xvalues) -50;
  var right = d3.max(xvalues) +1;

  var yvalues = data.map(function(d) {
    return d.y;
  });

  var top = d3.min(yvalues) -5;
  var bottom = d3.max(yvalues) +5;

  var virtualWidth = right - left;
  var virtualHeight = bottom - top;

  var xratio = gw / virtualWidth;
  var yratio = gh / virtualHeight;

  console.log(xratio, yratio);

  console.debug(data);
  var tiles = d3.select('svg')
    .attr('width', gw)
    .attr('height', gh)
    .select('g')
    .selectAll('g').data(data)
  ;
  var newtile = tiles.enter().append('g').attr('class', 'tile');
  newtile.append('rect');
  newtile.append('text');

  tiles.on('click', selectTile);
  tiles.select('text')
    .text(function(d) {
      return d.id;
    });
  tiles.select('rect')
    .attr("x", function(d) {
      return 40 + d.x * xratio;
    })
    .attr("y", function(d) {
      return 40 + d.y * yratio;
    })
    .attr("width", 40)
    .attr("height", 40)
    .attr("fill", function(d) {
      if(d.havePlayer){
        return 'orange';
      }
      return d.traps.length>0 ? 'blue' : '#ddd';
    });

}
