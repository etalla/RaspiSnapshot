var EventEmitter, createCamera, exec, fs, moment;

fs = require('fs');

moment = require('moment-timezone');

exec = require('child_process').exec;

EventEmitter = require('events').EventEmitter;

createCamera = function(_opts) {
  var camera, lastSnapshot, opts;
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
  lastSnapshot = null;
  camera.getLastSnapshot = function() {
    return lastSnapshot;
  };
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
    var date, execOpts, imageProc, mom, path;
    mom = moment().tz(opts.timezone);
    date = mom.format();
    path = opts.imageDirectory + 'snap.jpg';
    execOpts = {
      timeout: 10000
    };
    console.log('[' + date + '] Taking snapshot.');
    imageProc = exec('fswebcam -r ' + opts.resolution + ' --timestamp "' + date + '" --title "Resin CCTV" --font /usr/share/fonts/truetype/ttf-dejavu/DejaVuSans.ttf ' + path, execOpts, function(error, stdout, stderr) {
      if (error != null) {
        console.log('Error taking snapshot: ' + error);
        return;
      }
      console.log('fswebcam ' + JSON.stringify(stdout) + ' ' + JSON.stringify(stderr));
      lastSnapshot = {
        path: path,
        date: date,
        moment: mom,
        url: '/images/' + date + '.jpg'
      };
      return camera.emit('snapshot', lastSnapshot);
    });
    return imageProc.stdout.pipe(process.stdout);
  };
  camera.snapshotLoop = function(interval) {
    camera.takeSnapshot();
    camera.interval = interval;
    return setInterval(function() {
      if ((lastSnapshot != null) && moment().diff(lastSnapshot.moment) < interval) {

      } else {
        return camera.takeSnapshot();
      }
    }, 100);
  };
  camera.setup();
  return camera;
};

exports.createCamera = createCamera;