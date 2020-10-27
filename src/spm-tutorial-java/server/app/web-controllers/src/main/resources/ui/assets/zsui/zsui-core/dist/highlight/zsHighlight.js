(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.zsHighlightM = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /**
   * Highlight text fragment in the contents of DOM element using <mark></mark> tag
   * @param {String} searchValue - Keywork to hightlight.
   * @param {Boolean} caseSensitive - Case sensitive or not. False by default.
   * @param {HTMLElement|NodeList} element - Element or NodeList to hightlight in.
   */
  var highlight = function highlight(searchValue, caseSensitive, ele) {
    var sensitivity = caseSensitive ? '' : 'i';
    var regex = new RegExp(searchValue, sensitivity);
    var elements = ele || this;

    if (elements instanceof HTMLElement) {
      elements = [elements];
    }

    for (var i = 0; i < elements.length; i++) {
      lowlight(elements[i]);

      if (searchValue) {
        _highlightAll(elements[i], regex);
      }
    }
  };
  /**
   * Finds the matching text iteratively in a given node and wraps the matching text in <mark> tag.
   * @param {HTMLElement} ele - Element to find the matching string in.
   * @param {RegExp} regex - Regular expression to find the match.
   * @private
   */


  var _highlightAll = function _highlightAll(ele, regex) {
    if (ele.nodeType === 3) {
      // Text node
      var match = ele.data.match(regex);

      if (match) {
        var markEle = document.createElement('mark');
        var foundEle = ele.splitText(match.index);
        foundEle.splitText(match[0].length);
        markEle.appendChild(foundEle.cloneNode(true));
        foundEle.parentNode.replaceChild(markEle, foundEle);
        return 1;
      }
    } else if (ele.nodeType === 1 && ele.childNodes && !/(mark|script|style)/i.test(ele.tagName)) {
      for (var i = 0; i < ele.childNodes.length; i++) {
        i += _highlightAll(ele.childNodes[i], regex);
      }
    }

    return 0;
  };
  /**
   * Removes the highlighting.
   * @param {HTMLElement|NodeList} ele - Element or NodeList to remove hightlighting. 
   */


  var lowlight = function lowlight(ele) {
    var elements = ele || this;

    if (elements instanceof HTMLElement) {
      elements = [elements];
    }

    for (var i = 0; i < elements.length; i++) {
      var highlightedTags = elements[i].getElementsByTagName('mark');

      while (highlightedTags.length) {
        var currentTag = highlightedTags[0];
        var parentNode = currentTag.parentNode;
        parentNode.replaceChild(currentTag.firstChild, currentTag);
        parentNode.normalize();
      }
    }
  }; // Add these functions to zs namespace for backward compatibility.


  window.zs = window.zs || {};
  window.zs.highlight = {
    highlight: highlight,
    lowlight: lowlight
  };
  var _default = {
    highlight: highlight,
    lowlight: lowlight
  };
  _exports.default = _default;
});
//# sourceMappingURL=zsHighlight.js.map
