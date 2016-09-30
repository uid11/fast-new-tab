'use strict'; /* global document, chrome */

/** 
 * @file This code need only for opening links with "chrome" protocol
 * on New Tab page.
 */

(function () {

/**
 * Make onClicker callback, that opens new tab.
 * @param  {string=} href Link for new tab (default -- New Tab Page).
 * @param  {boolean=} closeOld If true, onClicker close current tab.
 * @return {function(event|tab)} onClicker
 */
function makeOnClicker(href, closeOld) {

  var details = { url: href };

  return function onClicker(event) {
    if (event.preventDefault) event.preventDefault();
    if (event.stopPropagation) event.stopPropagation();

    if (closeOld) chrome.tabs.getCurrent(function (tab) {

      if (tab) chrome.tabs.remove(tab.id);

    });

    if (closeOld && typeof href === 'string') {
      chrome.tabs.create(details, function () {
        chrome.history.addUrl(details);
      });
    } else {
      chrome.tabs.create(details);
    }
    
  };
}

/**
 * If url === undefined, chrome.tabs.create() open New Tab Page.
 */
chrome.browserAction.onClicked.addListener(makeOnClicker());

var links = document.getElementsByTagName("A"),
    link;

for (var i = 0; i < links.length; i++) {

  link = links[i];
  link.addEventListener("click", makeOnClicker(link.href, true));

}

})();