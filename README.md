# neo_nodejs_mjpeg

FFMPEG:
ffmpeg -f dshow -i video="Integrated Webcam" -s 320x240 -q:v 1 -update 1 -r "60" -pix_fmt yuv420p test.jpg -y

ENABLE SERVER:
sudo node mjpeg_server.js
