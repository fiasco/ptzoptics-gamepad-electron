// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// const storage = require('./src/storage.js');
const capture = require('./src/capture.js');
const config = require('./config.js');
const control = require('./src/ptxcontrol.js');
require('./src/cameraForm.js');

var Camera = new control.Camera();

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
  e.gamepad.index, e.gamepad.id,
  e.gamepad.buttons.length, e.gamepad.axes.length);
  setInterval(capture.controller, config.refreshRate);
});

var setPreset = false, movement = 0;

window.addEventListener("btn", function (e) {

  for (i=0; i < config.controller.length; i++) {
    var binding = config.controller[i].buttonBindings;
    switch (e.index) {
      case binding.holdForSet:
        setPreset = e.pressed;
        break;

      case binding.fasterMovement:
        movement = e.pressed ? 1 : 0;
        break;

      case binding.slowerMovement:
        movement = e.pressed ? -1 : 0;
        break;
      default:
        if (e.pressed) {
          return;
        }
        for (let i=0; i < binding.presents.length; i++) {
          if (e.index != binding.presents[i]) {
            continue;
          }
          if (setPreset) {
            Camera.posset(i);
          }
          else {
            Camera.poscall(i);
          }
        }
    }
  }
});

window.addEventListener("axis", function (e) {
  for (i=0; i < config.controller.length; i++) {
    var binding = config.controller[i].axesBindings;

    switch (e.index) {
      case binding.pan:
        direction = e.direction > 0 ? "right" : "left";
        direction = e.direction == 0 ? "stop" : direction;
        Camera.pan(direction, e.direction);
        break;
      case binding.tilt:
        direction = e.direction > 0 ? "down" : "up";
        direction = e.direction == 0 ? "stop" : direction;
        Camera.tilt(direction, e.direction);
        break;
      case binding.zoom:
        direction = e.direction > 0 ? "out" : "in";
        direction = e.direction == 0 ? "stop" : direction;
        Camera.zoom(direction, e.direction, movement);
        break;
    }
    if (e.index == binding.pan || e.index == binding.tilt) {
      Camera.updatePanTiltDrive(movement);
    }
  }
});
