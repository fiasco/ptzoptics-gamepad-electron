const storage = require('./src/storage.js');
module.exports = storage.get('config') || {
  // The rate at which controller signals are measured in milliseconds.
  refreshRate: 20,
  controller: [{
    axesBindings: {
      // The axes index from the gamepad device that controls tilt.
      tilt: 3,
      // The axes index from the gamepad device that controls pan.
      pan: 0,
      // The axes index from the gamepad device that controls zoom.
      zoom: 1
    },
    buttonBindings: {
      holdForSet: 8,
      presents: [0,1,2,3,12,13,14,15],
      slowerMovement: 4,
      fasterMovement: 5
    }
  }],
  camera: {
    connections: [{
      server: "192.168.2.88"
    }],
    defaults: {
      zoom: {
        // Zoom speed. Dependant on the grainularity supported by the camera.
        steps: 7,
        // Max step speed.
        max: 7,
        // Minimum step speed.
        min: 0
      },
      pan: {
        // Pan speed. Dependant on the grainularity supported by the camera.
        steps: 24,
        // Max step speed.
        max: 8,
        // Minimum step speed.
        min: 0
      },
      tilt: {
        // Tilt speed. Dependant on the grainularity supported by the camera.
        steps:20,
        // Max step speed.
        max: 6,
        // Minimum step speed.
        min: 0
      }
    }
  }
}
