#!/usr/bin/env bash

git clone https://github.com/raspberrypi/userland && \
	apt-get -y update && \
	apt-get -y install cmake curl && \
	pushd userland && \
	mkdir build && \
	pushd build && \
	cmake -DCMAKE_BUILD_TYPE=Release .. && \
	make && \
	cp bin/* /usr/bin/ && \
	cp lib/* /usr/lib/ && \
	cp userland/build/* /opt/vc/ && \
	popd && \
	popd