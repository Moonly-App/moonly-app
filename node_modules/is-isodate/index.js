
/**
 * Expose `isIsodate`.
 */

module.exports = isIsodate;


/**
 * ISO date matcher.
 *
 * http://www.w3.org/TR/NOTE-datetime
 */

var matcher = new RegExp(
  '^\\d{4}-\\d{2}-\\d{2}' +        // Match YYYY-MM-DD
  '((T\\d{2}:\\d{2}(:\\d{2})?)' +  // Match THH:mm:ss
  '(\\.\\d{1,6})?' +               // Match .sssss
  '(Z|(\\+|-)\\d{2}:\\d{2})?)?$'   // Time zone (Z or +hh:mm)
);


/**
 * Test whether a `string` is an ISO date.
 *
 * @param {String} string
 */

function isIsodate (string) {
  return (
    typeof string === 'string' &&
    matcher.test(string) &&
    !isNaN(Date.parse(string))
  );
}