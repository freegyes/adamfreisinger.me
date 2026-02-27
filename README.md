# adamfreisinger.me
A personal website.

## Development Notes
### Install
```
npm install
```

### Local Development
```
npm run start
```
The site will be built to the `_site` folder locally, and served at http://localhost:8080

### Production Build
```
npm run build
```
Builds the site and runs post-build consistency checks. The checks must pass before CI will deploy.

### Deployment
The site is configured to be built and deployed to GitHub Pages (`gh/pages` branch) automatically via GitHub Actions on each push to the `main` branch.


### Adding a Post

Create `posts/YYYY-MM-DD-slug.md`. Use descriptive camelCase keys for media content (e.g. `albumInHand`, not `img01`).
See `posts/2026-02-05-internet-radio-concept.md` for a complete example.

### Adding Photos
Drop source files into `photos-input/`, then run:
```
npm run photos:process
```

### Post Template
```
---
title:
excerpt:
tags:
  -
  -
media:
  hero:
    src: /assets/images/posts/
    alt:
    title:
    width: 1920
    height: 1080
    aspect: is-16by9
  thumbnail:
    src: /assets/images/posts/
    alt:
    title:
    width: 1024
    height: 768
    aspect: is-4by3
  content:
    descriptiveName:
      src: /assets/images/posts/
      alt:
      title:
      width: 1024
      height: 768
      aspect: is-4by3
---
```
