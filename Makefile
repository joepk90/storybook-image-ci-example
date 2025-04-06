LOKI_OUPTPUT_DIR := .loki
STORYBOOK_PORT := 6006
LOKI_ARGS= \
	--reference=${LOKI_OUPTPUT_DIR}/reference \
 	--output=${LOKI_OUPTPUT_DIR}/current \
 	--difference=${LOKI_OUPTPUT_DIR}/difference \
	--host=localhost \
	--port=6006

storybook-build:
	npm run build-storybook

# storybook must be running in order for loki to work
storybook-start:
	npm run storybook

storybook-start-ci:
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
	npx loki test ${LOKI_ARGS} --debug