var EventEmitter, createCamera, exec, fs;

fs = require('fs');

exec = require('child_process').exec;

EventEmitter = require('events').EventEmitter;

createCamera = function(_opts) {
  var camera, opts;
  camera = new EventEmitter;
  opts = {
    imageDirectory: _opts.imageDirectory || '/tmp/resin-cctv/',
    timezone: _opts.timezone || 'UTC',
    resolution: _opts.resolution || '1280x720',
    device: _opts.device || '/dev/video0'
  };
  if (opts.imageDirectory[opts.imageDirectory.length - 1] !== '/') {
    opts.imageDirectory += '/';
  }
  camera.getImageDirectory = function() {
    return opts.imageDirectory;
  };
  camera.setup = function() {
    var error;
    try {
      fs.mkdirSync(opts.imageDirectory);
      console.log('Created image storage directory ' + opts.imageDirectory + '.');
    } catch (_error) {
      error = _error;
      console.log('Error creating image storage directory ' + opts.imageDirectory + ': ' + error);
    }
    return fs.stat(opts.device, function(err, stats) {
      if (err) {
        return console.log('Error reading ' + opts.device + ': ' + err);
      } else if (!stats.isCharacterDevice()) {
        return console.log('Error reading ' + opts.device + ': Is not a character device.');
      } else {
        return console.log('Recognized camera device: ' + opts.device);
      }
    });
  };
  camera.takeSnapshot = function() {
    var execOpts, imageProc, path;
    path = opts.imageDirectory + 'snap.jpg';
    execOpts = {
      timeout: 10000
    };
    console.log('Taking snapshot.');
    imageProc = exec('fswebcam -r ' + opts.resolution + ' --title "Resin CCTV" --font /usr/share/fonts/truetype/ttf-dejavu/DejaVuSans.ttf ' + path, execOpts, function(error, stdout, stderr) {
      if (error != null) {
        console.log('Error taking snapshot: ' + error);
        return;
      }
      console.log('fswebcam ' + JSON.stringify(stdout) + ' ' + JSON.stringify(stderr));
      return camera.emit('snapshot');
    });
    return imageProc.stdout.pipe(process.stdout);
  };
};

exports.createCamera = createCamera;