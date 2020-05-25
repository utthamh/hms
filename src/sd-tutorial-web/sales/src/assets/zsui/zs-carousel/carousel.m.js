/**
 * @module Carousel
 * @author: UI architecture team @ZS
 */

// import { handleEvent, on, off, fire } from '../../../node_modules/zsui-core/src/smart/events.m.js';
import { handleEvent, on, off, fire } from '../events.m';
import { mix } from '../mixin.m.js';
import syncProps from '../syncProps.m';


class Base extends HTMLDivElement {
    constructor(...args) {
        super(...args);
    }
}
mix(Base.prototype, { handleEvent, on, off, fire }, syncProps);


export default class Carousel extends Base {
    constructor(...args) {
        // Constructor caveat https://github.com/WebReflection/document-register-element/
        const _ = super(...args);
        _.init();
        return _;
    }


    _patchIs() {
        if (this.parentNode && this._is) {
            if (this.getAttribute('is') != this._is) {
                this.setAttribute('is', this._is);
            }
        }
    }

    init() {
        this._patchIs();
    }

    render() {
        this.classList.add('zs-carousel');
        this.on(['click'], this, this, false, false);
        if (this.hasAttribute('slider')) {
            this.handleSlideArrows();
            this.on(['scroll'], this, this.carouselContainer, false, false);
            return;
        }
        this.handleArrows();
        this.on(['resize'], this, window, false, false);

        this.startX = 0;
        this.endX = 0;

        this.on(['touchstart'], this, this, false, true);
        this.on(['touchend'], this, this, false, false);
        this.on(['touchmove'], this, this, false, false);
    }

    get carouselContainer() {
        return this.querySelector(".zs-carousel-container");
    }

    get activeSection() {
        return this.querySelector('section[active]');
    }

    get backController() {
        return this.querySelector('.carousel-controller-back');
    }
    get backControllerIcon() {
        return this.querySelector('.carousel-controller-back a.zs-icon');
    }
    get forwardController() {
        return this.querySelector('.carousel-controller-forward');
    }
    get forwardControllerIcon() {
        return this.querySelector('.carousel-controller-forward a.zs-icon');
    }
    get activeIndicator() {
        return this.querySelector('.carousel-indicator[active]');
    }
    get indicatorContainer() {
        return this.querySelector('.carousel-indicator-container');
    }
    onresize() {
        this.carouselContainer.style.transition = 'none';
        this.translateElement();
        setTimeout(() => {
            this.carouselContainer.style.transition = '';
        }, 0)
    }
    ontouchstart(e) {
        if(e.target == this.backControllerIcon || e.target == this.forwardControllerIcon || e.target == this.indicatorContainer){
            return;
        }
        this.startX = e.changedTouches[0].pageX;
    }
    ontouchend(e) {
        if(e.target == this.backControllerIcon || e.target == this.forwardControllerIcon || e.target == this.indicatorContainer){
            return;
        }
        this.carouselContainer.style.transition = '';
        this.endX = e.changedTouches[0].pageX;
        if (this.endX - this.startX < -50) {
            this.moveSection('right');
        }
        else if (this.endX - this.startX > 50) {
            this.moveSection('left');
        }
        else {
            this.translateElement();
        }
    }
    ontouchmove(e) {
        if(e.target == this.backControllerIcon || e.target == this.forwardControllerIcon || e.target == this.indicatorContainer){
            return;
        }
        e.preventDefault();
        var moveX = this.startX - (e.touches[0].pageX || e.changedTouches[0].pageX);
        var activeIndex = this.activeSection.getAttribute('index');
        var carouselControllerWidth = this.backController.offsetWidth || this.forwardController.offsetWidth;
        var translatedval = activeIndex * (this.carouselContainer.offsetWidth - 2 * carouselControllerWidth);
        var toTranslate = translatedval + moveX;
        this.carouselContainer.style.transition = 'none';
        this.carouselContainer.style.transform = 'translateX(-' + toTranslate + 'px)';
    }
    onscroll(e) {
        if (this._renderDebounce) {
            clearTimeout(this._renderDebounce);
            delete this._renderDebounce;
        }
        var self = this;
        this._renderDebounce = setTimeout(function () {
            self.handleSlideArrows();
            delete self._renderDebounce;
        }, 10);
    }
    onclick(event) {
        if (event.target === this.backControllerIcon) {
            if (this.hasAttribute('slider')) {
                this.scrollSection('left');
            }
            else {
                this.moveSection('left');
            }
        }
        else if (event.target === this.forwardControllerIcon) {
            if (this.hasAttribute('slider')) {
                this.scrollSection('right');
            }
            else {
                this.moveSection('right');
            }
        }
        else if (event.target.parentElement === this.indicatorContainer) {
            this.handleIndicatorClick(event);
        }
    }
    handleIndicatorClick(event) {
        var targetIndicator = event.target;
        if (targetIndicator.tagName === 'SPAN') {
            let carouselIndex = targetIndicator.getAttribute('index');
            this.translateElement(parseInt(carouselIndex));
        }
    }
    handleArrows() {
        if (!this.activeSection.previousElementSibling) {
            this.backController.style.display = 'none';
            this.forwardController.style.display = '';
        }
        else if (!this.activeSection.nextElementSibling) {
            this.forwardController.style.display = 'none';
            this.backController.style.display = '';
        }
        else {
            this.backController.style.display = '';
            this.forwardController.style.display = '';
        }
    }
    handleSlideArrows() {
        var scrolledPara = this.carouselContainer.scrollLeft + this.carouselContainer.offsetWidth;
        if (scrolledPara == this.carouselContainer.offsetWidth) {
            this.backController.style.display = 'none';
            this.forwardController.style.display = '';
        }
        else if (Math.abs(scrolledPara - this.carouselContainer.scrollWidth) < 1) {
            this.forwardController.style.display = 'none';
            this.backController.style.display = '';
        }
        else {
            this.backController.style.display = '';
            this.forwardController.style.display = '';
        }
    }
    moveSection(direction) {
        var active = this.activeSection;
        var nowActive = direction === 'left' ? active.previousElementSibling : active.nextElementSibling;
        if (nowActive && nowActive.tagName == 'SECTION') {
            nowActive.setAttribute('active', '');
            active.removeAttribute('active');
        }
        this.translateElement();
    }
    scrollSection(direction) {
        var distance;
        if (direction == 'left') {
            distance = this.carouselContainer.offsetWidth - this.backController.offsetWidth * 2;
            this.sideScroll(this.carouselContainer, 'left', 1, distance, 20);
        }
        else {
            distance = this.carouselContainer.offsetWidth - this.forwardController.offsetWidth * 2;
            this.sideScroll(this.carouselContainer, 'right', 1, distance, 20);
        }
    }
    sideScroll(element, direction, speed, distance, step) {
        var scrollAmount = 0;
        var slideTimer = setInterval(function () {
            if (distance - scrollAmount < step) {
                step = distance - scrollAmount;
            }
            if (direction == 'left') {
                element.scrollLeft = Math.ceil(element.scrollLeft - step);
            } else {
                element.scrollLeft = Math.ceil(element.scrollLeft + step);
            }
            scrollAmount += step;
            if (scrollAmount >= distance) {
                window.clearInterval(slideTimer);
            }
        }, speed);
    }
    translateElement(index, distance, el) {
        var translatedEle = el || this.carouselContainer;
        var index = index || (index === 0 ? 0 : this.activeSection.getAttribute('index'));
        var carouselControllerWidth = this.backController.offsetWidth || this.forwardController.offsetWidth;
        var distance = distance || translatedEle.offsetWidth - (2 * carouselControllerWidth);
        var distanceToMove = index * distance;
        translatedEle.style.transform = "translateX(-" + distanceToMove + "px)";
        var activeSection = translatedEle.querySelector('section[index="' + index + '"]');
        var activeIndicator = this.querySelector('.carousel-indicator[index="' + index + '"]');
        var prevActiveSection = translatedEle.querySelector('section[active]');
        var prevActiveIndicator = this.activeIndicator;
        if (activeSection !== prevActiveSection) {
            prevActiveSection.removeAttribute('active');
            activeSection.setAttribute('active', '');
        }
        prevActiveIndicator.removeAttribute('active');
        activeIndicator.setAttribute('active', '');
        this.handleArrows();
    }
    connectedCallback() {
        this.init();
        window.requestAnimationFrame(() => {
            this.render();
        })
    }
    static define(is, tagName) {
        let Carousel = this;
        is = is || Carousel.prototype._is;
        tagName = tagName === undefined ? Carousel.prototype._tagName : tagName; // tagName could be empty
        if (tagName) {
            Carousel.prototype._is = is; // need to patch is
        } else {
            delete Carousel.prototype._is; // don't need to patch is
        }
        return customElements.define(is, Carousel, tagName ? { extends: tagName } : undefined);
    }
}

// Initial tag and is
Carousel.prototype._is = 'zs-carousel';
Carousel.prototype._tagName = 'div';
