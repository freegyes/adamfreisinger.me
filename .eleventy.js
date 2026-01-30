const siteData = require("./_data/site.json");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

module.exports = async function(eleventyConfig) {
  // Passthrough copies
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy({ "assets/favicons": "/" });
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("main.css");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Cache-busting hash for main.css
  const cssContent = fs.readFileSync("main.css", "utf8");
  const cssHash = crypto.createHash("md5").update(cssContent).digest("hex").slice(0, 8);
  eleventyConfig.addGlobalData("cssHash", cssHash);

  eleventyConfig.addTemplateFormats("njk");
  
  // Register the RSS plugin
  eleventyConfig.addPlugin(feedPlugin, {
		type: "atom", // or "rss", "json"
		outputPath: "/feed.xml",
		collection: {
			name: "posts", // iterate over `collections.posts`
			limit: 10,     // 0 means no limit
		},
		metadata: {
			language: "en",
			title: siteData.title,
			subtitle: siteData.tagline,
			base: siteData.url,
			author: {
				name: siteData.author,
				email: siteData.email,
			}
		}
	});
  
  // Global computed data: readingTime (based on word count)
  eleventyConfig.addGlobalData("eleventyComputed", {
    readingTime: data => {
      // Use templateContent if available; otherwise fall back to rawInput.
      let content = data.page.templateContent || data.page.rawInput;
      if (!content) {
        return "1 min read";
      }
      
      // Optionally, remove YAML front matter if present.
      content = content.replace(/^---[\s\S]+?---/, "").trim();
      
      const wordCount = content.split(/\s+/).length;
      const readingSpeed = 200; // Average words per minute
      const minutes = Math.ceil(wordCount / readingSpeed);
      return `${minutes} min read`;
    }
  });

    /**
     * Process an image through eleventy-img, returning metadata with
     * multiple widths and WebP + original format variants.
     */
    function processImage(src) {
      const inputPath = path.join(".", src);
      const ext = path.extname(src).toLowerCase();
      const formats = (ext === ".png") ? ["webp", "png"] : ["webp", "jpeg"];

      const options = {
        widths: [400, 800, 1200, 1600, "auto"],
        formats,
        fixOrientation: true,
        outputDir: "./_site/img/",
        urlPath: "/img/",
        filenameFormat: function (_id, _src, width, format) {
          const name = path.basename(src, ext);
          return `${name}-${width}w.${format}`;
        },
      };

      Image.statsSync(inputPath, options);
      Image(inputPath, options);

      return Image.statsSync(inputPath, options);
    }

    /**
     * Build a <picture> element from eleventy-img metadata.
     */
    function buildPictureMarkup(metadata, alt, cls, sizes, loading) {
      loading = loading || "lazy";
      sizes = sizes || "(min-width: 1024px) 50vw, 100vw";
      const formats = Object.keys(metadata);
      const fallbackFormat = formats[formats.length - 1];
      const fallback = metadata[fallbackFormat][metadata[fallbackFormat].length - 1];

      let sources = "";
      for (const format of formats) {
        const srcset = metadata[format]
          .map((entry) => `${entry.url} ${entry.width}w`)
          .join(", ");
        sources += `<source type="image/${format}" srcset="${srcset}" sizes="${sizes}">`;
      }

      const classAttr = cls ? ` class="${cls}"` : "";
      return `<picture>${sources}<img src="${fallback.url}" width="${fallback.width}" height="${fallback.height}" alt="${alt}"${classAttr} loading="${loading}" decoding="async"></picture>`;
    }

    /**
     * Helper function to generate the figcaption markup.
     * Returns a figcaption element if a title is provided.
     *
     * @param {String} title - The title/caption text.
     * @returns {String} HTML markup for the figcaption.
     */
    function generateFigcaption(title) {
      return title ? `<figcaption class="has-text-centered is-italic is-size-6">${title}</figcaption>` : '';
    }

    /**
     * Helper function to generate the media markup (for image or video)
     * without any outer column wrapper.
     *
     * @param {Object} media - The media object from front matter.
     * @returns {String} HTML markup for the media element with optional figcaption.
     */
    function generateMediaMarkup(media) {
      let elementMarkup = "";
      if (media.type && media.type.toLowerCase() === "video") {
        elementMarkup = `<figure class="video ${media.aspect}">
            <a href="${media.src}">
              <video autoplay loop muted playsinline preload="none" loading="lazy" style="width: 100%; height: 100%;">
                <source src="${media.src}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </a>
          </figure>`;
      } else {
        const metadata = processImage(media.src);
        const pictureMarkup = buildPictureMarkup(metadata, media.alt || "", "", undefined, "lazy");
        // Use the largest processed image for the lightbox href
        const formats = Object.keys(metadata);
        const fallbackFormat = formats[formats.length - 1];
        const largestImage = metadata[fallbackFormat][metadata[fallbackFormat].length - 1];
        const glightboxAttr = `data-glightbox="${media.title ? `title: ${media.title}` : ``}"`;
        elementMarkup = `<figure class="image ${media.aspect}">
            <a href="${largestImage.url}" ${glightboxAttr}>
              ${pictureMarkup}
            </a>
          </figure>`;
      }
      return `<div>
                ${elementMarkup}
                ${generateFigcaption(media.title)}
              </div>`;
    }

  /**
   * Standalone renderMedia shortcode.
   * Wraps the media markup in its own "columns" container.
   *
   * @param {Object} media - The media object from front matter.
   * @param {String} columnClass - (Optional) CSS classes for the column container.
   * @returns {String} HTML markup for the standalone media element.
   */
  eleventyConfig.addShortcode("renderMedia", function(
    media,
    columnClass = "column is-four-fifths"
  ) {
    const mediaMarkup = generateMediaMarkup(media);
    return `<div class="columns is-centered is-mobile">
              <div class="${columnClass}">
                ${mediaMarkup}
              </div>
            </div>`;
  });

  /**
   * gridMedia shortcode.
   * Outputs only a column wrapper for use inside a media grid.
   *
   * @param {Object} media - The media object from front matter.
   * @param {String} columnClass - (Optional) CSS classes for the column container.
   * @returns {String} HTML markup for the grid media element.
   */
  eleventyConfig.addShortcode("gridMedia", function(media, columnClass = "column is-4") {
    const mediaMarkup = generateMediaMarkup(media);
    return `<div class="${columnClass}">${mediaMarkup}</div>`;
  });

  /**
   * image shortcode for template use.
   * Usage: {% image src, alt, cls, sizes, loading %}
   */
  eleventyConfig.addShortcode("image", function(src, alt, cls, sizes, loading) {
    const metadata = processImage(src);
    return buildPictureMarkup(metadata, alt || "", cls || "", sizes || undefined, loading || "lazy");
  });

  /**
   * mediaGrid paired shortcode.
   * Wraps a group of media items (presumably rendered with gridMedia) inside a container and a columns row.
   *
   * Usage in your Markdown:
   *
   *    {% mediaGrid %}
   *      {% gridMedia media.content.img01 %}
   *      {% gridMedia media.content.img02 %}
   *      ...
   *    {% endmediaGrid %}
   */
  eleventyConfig.addPairedShortcode("mediaGrid", function(content) {
    return `<div class="columns is-centered is-multiline is-mobile">
              ${content}
            </div>
            `;
  });

  /**
   * youtube shortcode - embeds YouTube video with RSS-friendly fallback.
   * Renders iframe for web, but includes a linked thumbnail that RSS readers can display.
   * Usage: {% youtube "VIDEO_ID", "Video Title" %}
   */
  eleventyConfig.addShortcode("youtube", function(videoId, title = "YouTube video") {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    
    return `<figure class="image is-16by9 block youtube-embed">
  <a href="${videoUrl}" class="youtube-fallback" target="_blank" rel="noopener">
    <img src="${thumbnailUrl}" alt="${title}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">
    <span class="youtube-play-btn" aria-hidden="true"></span>
  </a>
  <iframe
    class="has-ratio youtube-iframe"
    width="560"
    height="315"
    src="${embedUrl}"
    title="${title}"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
    loading="lazy"
  ></iframe>
</figure>`;
  });

  // Register a custom Liquid filter "absolute_url"
  eleventyConfig.addLiquidFilter("absolute_url", function(url) {
    // If the URL is already absolute, just return it.
    if (/^https?:\/\//.test(url)) {
      return url;
    }
    // Otherwise, prepend the base URL.
    let baseUrl = "https://adamfreisinger.me";
    return baseUrl + url;
  });

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md").sort((a, b) => {
      return a.date - b.date;
    });
  });

  eleventyConfig.addCollection("music", function(collectionApi) {
    return collectionApi.getFilteredByGlob("music/*.md").sort((a, b) => {
      return a.date - b.date;
    });
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      pathPrefix: "/",
      url: "https://adamfreisinger.me", // Ensure this is a valid absolute URL
      output: "_site"
    }
  };
};
