LOKI_OUPTPUT_DIR := .loki
STORYBOOK_PORT := 6006
LOKI_ARGS= \
	--reference=${LOKI_OUPTPUT_DIR}/reference \
 	--output=${LOKI_OUPTPUT_DIR}/current \
 	--difference=${LOKI_OUPTPUT_DIR}/difference \
	--host=localhost \
	--port=6006

# storybook must be running in order for loki to work
storybook-start:
	npm run storybook

# run stoybook in the background (on a seperate screen)
storybook-screen-start:
	screen -dmS storybook-session bash -c 'make storybook-start'

# stop stoybook background process
storybook-screen-stop:
	screen -S storybook-session -X quit
	lsof -t -i:${STORYBOOK_PORT} | xargs kill -9

# generates the reference images
images-update:
	npx loki update ${LOKI_ARGS}

# generates the current and difference images and checks for differences between the images
images-test:
	npx loki test ${LOKI_ARGS}


### DOCKER SETUP - NOT WORKING ###
# change the LOKI_OUPTPUT_DIR variable to change the output directory of the images
DOCKER_IMAGE_NAME= storybook-image-ci

chromium-start:
	chromium \
	--headless \
	--disable-gpu \
	--no-sandbox \
	--remote-debugging-port=9222 \
	--remote-debugging-address=host.docker.internal \
	--disable-upower-service 2>/dev/null

docker-build: 
	docker build \
		--platform=linux/arm64 \
		-f Dockerfile \
		-t ${DOCKER_IMAGE_NAME} \
		.

docker-run: 
	docker run \
	-it \
	-p 6006:6006 \
	-v ./src:/app/src \
	-v ./.storybook:/app/.storybook \
	-v ./loki.config.cjs:/app/loki.config.cjs \
	-v ./Makefile:/app/Makefile \
	-v ./dockerfile-start-script.sh:/app/dockerfile-start-script.sh \
	-v /var/run/docker.sock:/var/run/docker.sock \
	-v ./${LOKI_OUPTPUT_DIR}:/app/${LOKI_OUPTPUT_DIR} \
	--entrypoint bash \
	${DOCKER_IMAGE_NAME} \
	-c "source /app/dockerfile-start-script.sh && exec /bin/bash"