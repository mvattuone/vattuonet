buildWebcamRoom = function(texture) { 
  var room = new THREE.Mesh( 
      new THREE.BoxGeometry(100000,100000,100000,1,1,1, null, true), 
      new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide }) 
  );  

  room.frustumCulled = false; 
  return room;
}

module.exports = {
    create: buildWebcamRoom,
};
