var last = {
  buttons: [],
  axes: []
};

module.exports.controller = function () {
  var pad = navigator.getGamepads()[0];

  for (i=0; i < pad.buttons.length; i++) {
    var btn = pad.buttons[i];

    if (last.buttons[i] != undefined) {
      if (btn.pressed != last.buttons[i]) {
        var e = new Event("btn");
        e.index = i;
        e.gamepad = pad;
        e.pressed = btn.pressed;
        last.buttons[i] = btn.pressed;
        window.dispatchEvent(e);
      }
    }
    else {
      last.buttons[i] = btn.pressed;
    }
  }

  for (i=0; i < pad.axes.length; i++) {
    var axis = Math.round(pad.axes[i] * 100);


    if (last.axes[i] != undefined && axis != last.axes[i]) {
      var e = new Event("axis");
      e.index = i;
      e.direction = axis;
      e.gamepad = pad;
      last.axes[i] = axis;
      window.dispatchEvent(e);
    }
    if (last.axes[i] == undefined) {
      last.axes[i] = axis;
    }
  }
}
