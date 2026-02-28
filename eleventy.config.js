module.exports = function(eleventyConfig) {
  // Copy static files as-is
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("auth");
  eleventyConfig.addPassthroughCopy("verified");
  eleventyConfig.addPassthroughCopy("_redirects");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes"
    }
  };
};