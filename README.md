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

### Deployment
The site is configured to be built and deployed to GitHub Pages (`gh/pages` branch) automatically via GitHub Actions on each push to the `main` branch.


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
    img01:
      src: /assets/images/posts/
      alt: 
      title: 
      width: 1024
      height: 768
      aspect: is-4by3
---
```