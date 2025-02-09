module.exports = async function(eleventyConfig) {
  // Passthrough copies
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy({ "assets/favicons": "/" });
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("main.css");
  
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
      output: "_site"
    }
  };
};
