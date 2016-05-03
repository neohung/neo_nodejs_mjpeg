/*
ffmpeg -f dshow -i video="Integrated Webcam" -s 320x240 -q:v 1 -update 1 -r "60" -pix_fmt yuv420p test.jpg -y
1M 1280x720=22.5K
16M 1280x720=100K
*/

var ip   = "0.0.0.0",
    port = 80,
    fs = require('fs');
    http = require('http');
var boundary = "boundary_token";
var __dirname = ".";

function handleRequest(request, response) {
  console.log("Request received.");
  	switch (request.url) {
		case '/':
		case '/index.html':
			//showIndexPage(request, response);
			showMjpegPage(request, response);
			break;
		case '/mjpeg.html':
			showMjpegPage(request, response);
			break;
		case '/RandomNumber':
			showRandomNumber(request, response);
			//showTimer(request, response);
			break;
		case '/mjpeg.jpg':
			showMjpeg(request, response);
			break;
		default:
			show404Error(request, response);
			break;
	}
}

function showImageFrame(req, res, filename){
	    var data = fs.readFileSync(__dirname + filename);
//        res.write("Content-Type: image/jpeg\r\n\r\n");
        res.write("Content-Type: image/x-portable-bitmap\r\n\r\n");
        res.write(data);
        res.write("\r\n--"+boundary+"\r\n");
}

function showMjpeg(req, res){
	res.setHeader('Content-type', 'multipart/x-mixed-replace; boundary=--'+ boundary);
	image_filename = "/pics/"+"test.jpg";
 	showImageFrame(req, res, image_filename);
  	var fps = 60;
  	var time = 1000 / fps;
	setInterval(function(){
		setTimeout(function(){
            showImageFrame(req, res, image_filename);

        },time*1);
	},time);
}

function showIndexPage(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write("<h1>Random Number Stream test:</h1>");
	res.write("<iframe src=\"/RandomNumber\" height=\"20%\" width=\"350\" frameborder=\"1\"  name=\"header\" title=\"Header window\"> </iframe>");
	res.write("<h5>(probably won't work on IE / Opera / Google Chrome)</h5>");
	res.end();
}

function showMjpegPage(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write("<h1>Video Stream test:</h1>");
	res.write("<img src=\"/mjpeg.jpg\" />");
	res.write("<h5>(probably won't work on IE / Opera / Google Chrome)</h5>");
	res.end();

}

function showTimer(req, res) {
	res.writeHead(200, {
        'Content-Type': 'multipart/x-mixed-replace; boundary=boundary',
        'Access-Control-Allow-Origin' : '*',
        'Connection': 'keep-alive'
    });

     setInterval(function () {
        res.write('--boundary\r\n', 'ascii');
        res.write('Content-Type: text/plain\r\n', 'ascii');
        res.write('\r\n', 'ascii');
        var date = new Date();
        res.write(date.toString() + '\r\n\r\n', 'ascii');
    }, 1000);
}
function showRandomNumber(req, res) {

	res.writeHead(200,{
        'Content-Type': 'multipart/x-mixed-replace;boundary="' + boundary + '"',
        'Connection': 'keep-alive',
        'Expires': 'Fri, 01 Jan 1990 00:00:00 GMT',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache'
    });


	setInterval(function(){
	   var r = Math.random();
	   console.log("Gen: "+ r);
       res.write('\n--'+boundary+'\n');
       res.write('Content-Type: text/plain;charset=utf-8\n\n');
       res.write( r +'\n');
       res.write('\n--'+boundary+'\n');
	},1000);

}

function showImage(req, res) {
	res.writeHead(200, {'Content-Type': 'image/jpeg'});
    fs.readFile('robot_head.jpg', function(err, data)
    {
  	if (err) throw err;
  	 	res.write(data);
		res.end();
 	 });
}

function show404Error(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write("<h1>ERROR:</h1>");
	res.write("<h5>Not found</h5>");
	res.end();
}

http.createServer(handleRequest).listen(port, ip);

console.log("Server has started.");