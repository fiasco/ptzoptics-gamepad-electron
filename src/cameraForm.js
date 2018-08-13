var $ = require('jQuery');
const config = require('../config.js');
const storage = require('./storage.js');
const {getCurrentWindow} = require('electron').remote;

$('#cameraConnectionForm input.form-control').each(function (i) {
  let connection = config.camera.connections[i] || {server: ''}
  $(this).val(connection.server);
});

$('#cameraConnectionForm button').each(function (i) {
  let connection = config.camera.connections[i] || {server: ''}

  $(this).click(function () {
    let input = $('#cameraConnectionForm input.form-control').get(i);

    config.camera.connections[i] = {
      server: $(input).val()
    };

    storage.set('config', config);
    getCurrentWindow().reload();
  });
});
