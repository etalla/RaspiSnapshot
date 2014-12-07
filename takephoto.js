var RaspiCam = require("raspicam");

var photo = new RaspiCam({ 
	mode: "photo",
	output: "/data/snap.jpg", // String - the path and filename where you want to store the photos (use sprintf-style variables, like %d, for incrementing timelapse photos)
	encoding: "jpg"
});

//to take a snapshot, start a timelapse or video recording
photo.start( );

//to stop a timelapse or video recording
photo.stop( );

//listen for the "started" event triggered when the start method has been successfully initiated
photo.on("started", function(){ 
    console.log("started");
});

//listen for the "read" event triggered when each new photo/video is saved
photo.on("read", function(err, timestamp, filename){ 
    console.log("read");
});

//listen for the process to exit when the timeout has been reached
photo.on("exited", function(){
    console.log("exited");
});