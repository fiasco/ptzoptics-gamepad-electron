var base_path = '/cgi-bin/ptzctrl.cgi?ptzcmd&';

function format_action (action,pan_speed, tilt_speed) {
  var path =  base_path + action + '&' + pan_speed;
  if (tilt_speed != undefined) {
    path += '&' + tilt_speed;
  }
  return path;
}

module.exports = {
  Pan_tiltDrive: {
    Up: function (pan_speed, tilt_speed) {
      return format_action('up', pan_speed, tilt_speed)
    },
    Down: function (pan_speed, tilt_speed) {
      return format_action('down', pan_speed, tilt_speed)
    },
    Left: function (pan_speed, tilt_speed) {
      return format_action('left', pan_speed, tilt_speed)
    },
    Right: function (pan_speed, tilt_speed) {
      return format_action('right', pan_speed, tilt_speed)
    },
    UpLeft: function (pan_speed, tilt_speed) {
      return format_action('leftup', pan_speed, tilt_speed)
    },
    UpRight: function (pan_speed, tilt_speed) {
      return format_action('rightup', pan_speed, tilt_speed)
    },
    DownRight: function (pan_speed, tilt_speed) {
      return format_action('rightdown', pan_speed, tilt_speed)
    },
    DownLeft: function (pan_speed, tilt_speed) {
      return format_action('leftdown', pan_speed, tilt_speed)
    },
    Stop: function() {
      return base_path + 'ptzstop';
    }
  },
  CAM_Zoom: {
    TeleStandard: function (speed) {
      return format_action('zoomin', speed);
    },
    WideStandard: function (speed) {
      return format_action('zoomout', speed);
    },
    Stop: function() {
      return base_path + 'zoomstop';
    }
  },
  CAM_Memory: {
    Set: function (idx) {
      return base_path + 'posset&' + idx;
    },
    Recall: function (idx) {
      return base_path + 'poscall&' + idx;
    }
  }
}
