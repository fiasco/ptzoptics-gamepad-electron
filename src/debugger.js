module.exports = {
  panTilt: function (msg) {
    document.getElementById('lastPanTiltCmd').innerText = msg;
  },
  zoom: function (msg) {
    document.getElementById('lastZoomCmd').innerText = msg;
  },
  latency: function (item) {
    document.getElementById('lastCmdLatency').innerText = item.latency + 'ms';
  }

}
