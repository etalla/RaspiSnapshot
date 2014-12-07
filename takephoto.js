var RaspiCam = require("raspicam");

var camera = new RaspiCam({ opts });

//to take a snapshot, start a timelapse or video recording
camera.start( );

//to stop a timelapse or video recording
camera.stop( );

//listen for the "started" event triggered when the start method has been successfully initiated
camera.on("started", function(){ 
    //do stuff
});

//listen for the "read" event triggered when each new photo/video is saved
camera.on("read", function(err, timestamp, filename){ 
    //do stuff
});

//listen for the process to exit when the timeout has been reached
camera.on("exited", function(){
    //do stuff
});