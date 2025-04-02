
# change the LOKI_OUPTPUT_DIR variable to change the output directory of the images
LOKI_OUPTPUT_DIR := .loki
LOKI_ARGS= \
	--reference=${LOKI_OUPTPUT_DIR}/reference \
 	--output=${LOKI_OUPTPUT_DIR}/current \
 	--difference=${LOKI_OUPTPUT_DIR}/difference

# storybook must be running in order for loki to work
storybook-start:
	npm run storybook

# generates the reference images
images-update:
	npx loki update ${LOKI_ARGS}

# generates the current and difference images and checks for differences between the images
images-test:
	npx loki test ${LOKI_ARGS}