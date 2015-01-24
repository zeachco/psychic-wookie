var tileDoorMap = {
  '1': {
    N: true,
    S: true,
    W: true,
    E: true
  }
};

module.exports = function Tile(ref) {
  this.x = ref.x;
  this.y = ref.y;
  this.type = ref.type || 1;
  this.traps = ref.traps || [];
  this.rotation = rotation;
  doors = tileDoorMap[this.tileType].split('');
};
