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

### Image Processing

Source images are processed by `@11ty/eleventy-img` into multiple width/format variants in `_site/img/`. A file-size manifest (`_site/img/.source-manifest.json`) tracks each source file so that changed images are automatically regenerated.

**If you replace a source image and don't see the change:**

1. **Restart the dev server.** The image processor caches file existence in memory for the lifetime of the process, so hot-reload won't pick up replaced files. Stop `npm run start` and start it again.
2. **If that doesn't work:** `rm -rf _site` and rebuild. This forces full regeneration.

Thumbnails must be exactly **4:3** (e.g. 1024x768) to match the card layout. Other aspect ratios will leave visible gaps on the homepage grid.

### Deployment

Pushes to `main` trigger a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys to GitHub Pages (`gh-pages` branch).

The build uses two caching layers to keep deploys fast (~2–3 min instead of ~10 min):

- **Generated images** (`_site/img/`) — cached and restored by the hash of `_data/photos.json`. This includes processed variants for both gallery photos and post images. The file-size manifest (`.source-manifest.json`) is included in this cache, so changed post images are detected and regenerated automatically.
- **Source photos** (`assets/images/photos/`) — cached separately. The repo uses a blobless partial clone with sparse checkout that excludes gallery photos from the initial checkout. If the source photos cache misses, sparse checkout is disabled to fetch them on demand.

Things to know:

- **Do not add `--deleteOutputPath` to the build command.** The image cache relies on Eleventy's default non-destructive output (it writes into `_site/` without wiping it). Deleting the output path would destroy the cached images before they're used.
- **The image cache key is `_data/photos.json`'s hash.** Adding or removing gallery photos changes this hash, which invalidates both caches and triggers a full rebuild on the next deploy. Post image changes alone do not invalidate the cache — stale post images are handled by the file-size manifest instead.
- **Post images are always checked out** (only `assets/images/photos/**` is sparse-excluded). They are available from the initial clone.


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
