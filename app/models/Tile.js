
module.exports = function Tile(ref) {
  this.id = ref.tileId;
  this.x = ref.x;
  this.y = ref.y;
  this.type = ref.tileType;
  this.doors = ref.openedDoors;
  this.traps = ref.traps || [];
  this.rotation = ref.rotation;
};
