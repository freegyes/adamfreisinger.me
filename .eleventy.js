module.exports = async function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("CNAME");
    eleventyConfig.addPassthroughCopy({ "assets/favicons": "/" });
    eleventyConfig.addPassthroughCopy("assets/images");
};