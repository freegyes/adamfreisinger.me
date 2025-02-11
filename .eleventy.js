const siteData = require("./_data/site.json");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");

module.exports = async function(eleventyConfig) {
  // Passthrough copies
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy({ "assets/favicons": "/" });
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("main.css");

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
        elementMarkup = `<figure class="image ${media.aspect}">
            <a href="${media.src}">
              <img src="${media.src}" alt="${media.alt}" title="${media.title || ''}" loading="lazy">
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
