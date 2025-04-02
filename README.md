# Storybook Image CI Example
This repo is used to document Storybook image comparison via CI (Github Actions).

It is setup to use Loki to generate images, but an alternative image renderer/comparison logic could be used.

### Loki Configuration

| Liki Docs      | URL                                              |
|----------------|--------------------------------------------------|
| Confg File     | https://loki.js.org/configuration.html           |
| CLI Arguments  | https://loki.js.org/command-line-arguments.html  |



By defualt, Loki uses the `loki.config.js` file to manage it's configuration. To test this file is being loaded and used, chage the width and height properties and try regenerating the images - the sizes should have changes.

Update the `loki.config.js` file width and height values:
```
{
    width: 10px,
    height: 10px,
}

```

regnerate the images
```
make images-regenerate
```

check the images generates in the `loki` output directory.

If more specifity of loki image hiearchy is required, this can be confugured:
https://loki.js.org/configuration.html#filenameformatter

