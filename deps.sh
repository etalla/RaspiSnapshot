wget http://www.linux-projects.org/listing/uv4l_repo/lrkey.asc && apt-key add ./lrkey.ascapt-get -y update
echo "deb http://www.linux-projects.org/listing/uv4l_repo/raspbian/ wheezy main" | tee -a /etc/apt/sources.list
apt-get -y update
apt-get -y install libraspberrypi0 uv4l uv4l-raspicam uv4l-raspicam-extras