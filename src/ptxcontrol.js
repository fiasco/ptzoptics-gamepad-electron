const logger = require('./debugger.js');
const config = require('../config.js');
const httpdriver = require('./http.js');
const http = require('http');

var camInterface = new CameraInterface();

module.exports.Camera = function (cam_idx) {
  var left = false, right = false, up = false, down = false;
  var zoom = false;
  var last_cmd = "";

  var camera_id = cam_idx || 0;
  var conn = config.camera.connections[camera_id];
  var base_url = 'http://' + conn.server;
  var settings = config.camera.defaults;

  function request(path, type) {
    var url = base_url + path;
    camInterface.send({
      url: url,
      type: type
    });
  }

  this.posset = function (idx) {
    request(httpdriver.CAM_Memory.Set(idx), 'posset');
  }

  this.poscall = function (idx) {
    request(httpdriver.CAM_Memory.Recall(idx), 'poscall');
  }

  this.pan = function (direction, pace) {
    if (direction == "stop") {
      right = false;
      left = false;
    }
    else if (direction == "left") {
      left = pace;
      right = false;
    }
    else {
      right = pace;
      left = false;
    }
  }

  this.tilt = function (direction, pace) {
    if (direction == "stop") {
      up = false;
      down = false;
    }
    else if (direction == "up") {
      up = pace;
      down = false;
    }
    else {
      down = pace;
      up = false;
    }
  }

  this.zoom = function (direction, pace, movement) {
    var cmd;
    pace = Math.round(pace * Math.min(settings.zoom.steps, settings.zoom.max) / 100);
    pace = Math.sqrt(Math.pow(pace, 2));
    if (movement !== 0) {
      pace = (movement < 0) ? Math.round(pace / 2) : Math.round(Math.min(pace * 1.5, settings.zoom.max));
    }
    switch (direction) {
      case "in":
        cmd = httpdriver.CAM_Zoom.TeleStandard(pace);
        break;
      case "out":
        cmd = httpdriver.CAM_Zoom.WideStandard(pace);
        break;
      default:
        cmd = httpdriver.CAM_Zoom.Stop();
        break;
    }

    if (last_cmd == cmd) {
      return;
    }
    last_cmd = cmd;
    request(cmd, 'zoom');
    logger.zoom(cmd);
  }

  this.updatePanTiltDrive = function (movement) {
    var direction = '', tilt_speed = 0, pan_speed = 0;
    if (up || down) {
      direction = up ? 'Up' : 'Down';
      tilt_speed = Math.round((up ? up : down) * Math.min(settings.tilt.steps, settings.tilt.max) / 100);
    }
    if (left || right) {
      direction += left ? 'Left' : 'Right';
      pan_speed = Math.round((left ? left : right) * Math.min(settings.pan.steps, settings.pan.max) / 100);
    }

    if (direction.length == 0) {
      direction = 'Stop';
    }

    // Remove negative integers and cast to string.
    tilt_speed = Math.sqrt(Math.pow(tilt_speed, 2));
    pan_speed = Math.sqrt(Math.pow(pan_speed, 2));

    if (movement !== 0) {
      if (movement > 0) {
        tilt_speed = Math.round(Math.min(tilt_speed * 1.5, settings.tilt.max));
        pan_speed = Math.round(Math.min(pan_speed * 1.5, settings.pan.max));
      }
      else {
        tilt_speed = Math.round(tilt_speed / 2);
        pan_speed = Math.round(pan_speed / 2);
      }
    }

    var cmd = httpdriver.Pan_tiltDrive[direction](pan_speed, tilt_speed);

    if (cmd == last_cmd) {
      return;
    }
    last_cmd = cmd;
    request(cmd, 'pantilt');
    logger.panTilt(cmd);
  }
};

function CameraInterface () {
  var queue = new Queue();
  var self = this;

  var last = {
    pantilt: 0,
    zoom: 0,
  }

  this.send = function (cmd) {
    queue.addItem(cmd);
    return self;
  }

  setInterval(function () {
    if (queue.locked()) {
      return;
    }
    var item;

    // Find a valid queued item to send.
    while (item = queue.fetchItem()) {
      // If a newer command has already been issued, do not send this one.
      if (item.timestamp <= last[item.type]) {
        let interval = last[item.type] - item.timestamp;
        console.log("Skipping " + item.type + " command " + item.url + ". Item is older than last command by " + interval + "ms.");
        continue;
      }
      break;
    }

    // If an item couldn't be found, do nothing.
    if (!item) {
      return;
    }

    // Stop other items from being dequeued while a request is in progress.
    queue.lock();

    // Issue command.
    http.get(item.url, (res) => {
      queue.unlock();
      item.latency = Date.now() - item.timestamp;
      logger.latency(item);
    });

    last[item.type] = item.timestamp;
  }, 10);
};

function Queue() {
  var items = [];
  var self = this;
  var freeze = false;

  this.addItem = function(item) {
    item.timestamp = Date.now();
    items.push(item);
    return self;
  }

  this.fetchItem = function () {
    if (!items.length || freeze) {
      return false;
    }
    // Pop the last cmd off the queue.
    // Newer cmds are higher priority.
    return items.pop();
  }

  this.locked = function () {
    return freeze;
  }

  this.lock = function () {
    freeze = true;
  }
  this.unlock = function () {
    freeze = false;
  }
}
