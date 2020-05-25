/**
 * Highlight text fragment in the contents of DOM element using <mark></mark> tag
 * @param {String} searchValue - Keywork to hightlight.
 * @param {Boolean} caseSensitive - Case sensitive or not. False by default.
 * @param {HTMLElement|NodeList} element - Element or NodeList to hightlight in.
 */
var highlight = function (searchValue, caseSensitive, ele) {
	var sensitivity = caseSensitive ? '' : 'i';
	var regex = new RegExp(searchValue, sensitivity);
	var elements = ele || this;

	if (elements instanceof HTMLElement) {
		elements = [elements];
	}

	for (let i = 0; i < elements.length; i++) {
		lowlight(elements[i]);
		if (searchValue) {
			_highlightAll(elements[i], regex);
		}
	}
}

/**
 * Finds the matching text iteratively in a given node and wraps the matching text in <mark> tag.
 * @param {HTMLElement} ele - Element to find the matching string in.
 * @param {RegExp} regex - Regular expression to find the match.
 * @private
 */
var _highlightAll = function (ele, regex) {
	if (ele.nodeType === 3) { // Text node
		var match = ele.data.match(regex);
		if (match) {
			var markEle = document.createElement('mark');
			var foundEle = ele.splitText(match.index);
			foundEle.splitText(match[0].length);
			markEle.appendChild(foundEle.cloneNode(true));
			foundEle.parentNode.replaceChild(markEle, foundEle);
			return 1;
		}
	} else if ((ele.nodeType === 1 && ele.childNodes) && !/(mark|script|style)/i.test(ele.tagName)) {
		for (var i = 0; i < ele.childNodes.length; i++) {
			i += _highlightAll(ele.childNodes[i], regex);
		}
	}
	return 0;
}

/**
 * Removes the highlighting.
 * @param {HTMLElement|NodeList} ele - Element or NodeList to remove hightlighting. 
 */
var lowlight = function (ele) {
	var elements = ele || this;

	if (elements instanceof HTMLElement) {
		elements = [elements];
	}

	for (let i = 0; i < elements.length; i++) {
		let highlightedTags = elements[i].getElementsByTagName('mark');
		while (highlightedTags.length) {
			var currentTag = highlightedTags[0];
			var parentNode = currentTag.parentNode;
			parentNode.replaceChild(currentTag.firstChild, currentTag);
			parentNode.normalize();
		}
	}
}

// Add these functions to zs namespace for backward compatibility.
window.zs = window.zs || {};
window.zs.highlight = {
	highlight: highlight,
	lowlight: lowlight
}

export default { highlight, lowlight };
