module.exports = async function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "assets/favicons": "/" });
    eleventyConfig.addPassthroughCopy("assets/images");
};