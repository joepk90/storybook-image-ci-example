# storybook must be running in order for loki to work
storybook-start:
	npm run storybook

images-uppdate:
	npx loki update --config=./loki.config.cjs

# using a loki.config.cjs config file is not currently working

### THOUGHTS ###
# it would be good to know that the location of the loki output images can be changed, however
# loki does already create a current, difference, and reference images by default... Perhaps,
# setting the output direcetory isn't 100% neccessary.


# the hiearchy of loki images outputs can be adjusted:
# https://loki.js.org/configuration.html#filenameformatter