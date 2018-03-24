'use strict';

var RULES = require('./rules');
var cheerio = require('cheerio');
var popsicle = require('popsicle');

/**
 * Scrape metadata from `html`.
 *
 * @param {String} html
 * @param {Object} rules (optional)
 * @return {Promise} metadata
 */

function scrapeHtml(html, rules) {
  return scrapeMetadata(html, '', rules);
}

/**
 * Scrape metadata from `url`.
 *
 * @param {String} url
 * @param {Object} rules (optional)
 * @return {Promise} metadata
 */

function scrapeUrl(url, rules) {
  var request = popsicle.request({
    url: url,
    options: {
      jar: process.browser ? null : popsicle.jar()
    }
  });

  return request.then(function (res) {
    return scrapeMetadata(res.body, res.url, rules);
  });
}

/**
 * Scrape metadata from `window`.
 *
 * @param {Window} window
 * @param {Object} rules (optional)
 * @return {Promise} metadata
 */

function scrapeWindow(window, rules) {
  var html = window.document.documentElement.outerHTML;
  var url = window.location.href;
  return scrapeMetadata(html, url, rules);
}

/**
 * Scrape each entry in the metadata result dictionary in parallel.
 *
 * @param {String} html
 * @param {String} url
 * @param {Object} rules (optional)
 * @return {Promise} metadata
 */

function scrapeMetadata(html, url, rules) {
  rules = rules || RULES;
  var keys = Object.keys(rules);
  var $ = cheerio.load(html);
  var promises = keys.map(function (key) {
    return scrapeMetadatum($, url, rules[key]);
  });

  return Promise.all(promises).then(function (values) {
    return keys.reduce(function (memo, key, i) {
      memo[key] = values[i];
      return memo;
    }, {});
  });
}

/**
 * Scrape the first non-null value returned by an array of `rules` functions for
 * a single property in the metadata result dictionary.
 *
 * @param {Cheerio} $
 * @param {String} url
 * @param {Array or Function} rules
 * @return {Promise} value
 */

function scrapeMetadatum($, url, rules) {
  if (!Array.isArray(rules)) rules = [rules];

  return rules.reduce(function (promise, rule) {
    return promise.then(function (value) {
      if (value != null && value !== '') return value;
      var next = rule($, url);
      if (next != null && next !== '') return next;
      return null;
    });
  }, Promise.resolve());
}

/**
 * Export.
 */

module.exports = {
  RULES: RULES,
  scrapeHtml: scrapeHtml,
  scrapeUrl: scrapeUrl,
  scrapeWindow: scrapeWindow
};