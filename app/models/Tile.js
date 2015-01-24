var tileDoorMap = {
  '1': {
    N: true,
    S: true,
    W: true,
    E: true
  }
};

module.exports = function Tile(ref) {
  this.id = ref.tileId;
  this.x = ref.x;
  this.y = ref.y;
  this.type = ref.tileType;
  this.dors = ref.openedDoors;
  this.traps = ref.traps || [];
  this.rotation = rotation;
  doors = tileDoorMap[this.tileType].split('');
};
