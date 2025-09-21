import { createAnimation, Animation } from '@ionic/core';

/**
 * Holds references to the elements participating in the transition.
 *
 * @todo replace by genuine Ionic interface after updating Ionic library
 */
interface TransitionOptions {
    baseEl: HTMLElement;
    enteringEl: HTMLElement;
    leavingEl: HTMLElement;
}

const LEAVING_DURATION = 200; // ms
const ENTERING_DURATION = 300; // ms
const ENTERING_OFFSET = 100; // ms

const CONTENT_SELECTOR = 'ion-header,ion-content,ion-footer';
const PAGE_HEADER_SELECTOR = 'ion-header';
const PAGE_FOOTER_SELECTOR = 'ion-footer';
const STEP_HEADER_SELECTOR = '.step-header';
const STEP_BODY_SELECTOR = '.step-body';

const PAGE_HIDDEN_CLASS = 'page-hidden';
const ANIMATING_CLASS = 'flow-animating';

const CONTENTS_VALUE = 'contents'; // display: contents

/**
 * Sets up transition animation for the flow steps via Ionic Animations and returns the setup instance.
 * Used by Ionic components, which accept an input `Animation` object to customize their animation behavior.
 *
 * @param baseEl base element holding all step page components. In case of Flow this is the router outlet component
 * @param opts transition options of type `TransitionOptions`. Contain references to the leaving and entering elements
 * @returns animation setup instance
 */
export function transitionAnimation(baseEl: HTMLElement, opts?: TransitionOptions): Animation {

    const nodes = Array.from(baseEl.childNodes);
    const forwardDirection = nodes.indexOf(opts.leavingEl) < nodes.indexOf(opts.enteringEl);

    return forwardDirection ? forwardAnimation(baseEl, opts) : backwardAnimation(baseEl, opts);
};

/**
 * Creates a "fade in" animation for the given element or list of nodes.
 *
 * @param el element or list of nodes in question
 * @param offset optional initial Y-offset in px for additional animation "slide up"
 * @param delay optional delay in ms, intended for a staggered animation
 * @returns animation setup instance
 */
function createFadeInAnimation(el: Element | NodeList, offset = 0, delay = 0): Animation {
    return createAnimation()
        .addElement(el)
        .delay(delay)
        .duration(ENTERING_DURATION)
        .fromTo('opacity', 0, 1)
        .fromTo('transform', `translateY(${offset}px)`, 'translateY(0px)')
        .easing('ease-out');
}
/**
 * Creates a "fade out" animation for the given element or list of nodes.
 *
 * @param el element or list of nodes in question
 * @returns animation setup instance
 */
function createFadeOutAnimation(el: Element | NodeList): Animation {
    return createAnimation()
        .addElement(el)
        .duration(LEAVING_DURATION)
        .fromTo('opacity', 1, 0)
        .easing('ease-in');
}

/**
 * Defines the transition animation in the forward direction
 * @param baseEl base element holding all step page components. In case of Flow this is the router outlet component
 * @param opts transition options of type `TransitionOptions`. Contain references to the leaving and entering elements
 * @returns animation setup instance
 */
function forwardAnimation(baseEl: HTMLElement, opts: TransitionOptions): Animation {

    // ion-header, ion-content and ion-footer should be processed separately as they don't have a parent suitable for control
    const leavingContent = opts.leavingEl.querySelectorAll(CONTENT_SELECTOR);
    const enteringContent = opts.enteringEl.querySelectorAll(CONTENT_SELECTOR);

    const enteringPageHeader = opts.enteringEl.querySelector(PAGE_HEADER_SELECTOR);
    const enteringStepHeader = opts.enteringEl.querySelector(STEP_HEADER_SELECTOR);
    const enteringStepBody = opts.enteringEl.querySelector(STEP_BODY_SELECTOR);
    const enteringPageFooter = opts.enteringEl.querySelector(PAGE_FOOTER_SELECTOR);

    const enteringElInitialStyle = opts.enteringEl.style.display;
    const baseElInitialStyle = baseEl.style.display;

    // These nodes should be animated sequentially:
    // * entering page header
    // * all children of entering step header simultaneously with page header
    // * entire entering step body (if exists)
    // * entering page footer (if exists) simultaneously with entering step body
    const enteringNodes = [
        { el: enteringPageHeader, offset: 0, index: 0 },
        ...Array.from(enteringStepHeader.children).map((el, index) => ({ el, offset: 50, index })),
        { el: enteringStepBody, offset: 50, index: enteringStepHeader.children.length },
        { el: enteringPageFooter, offset: 0, index: enteringStepHeader.children.length }
    ];

    // Initially the content of entering page should be completely hidden
    enteringContent.forEach((el: HTMLElement | any) => el.classList.add(PAGE_HIDDEN_CLASS));

    const leavingAnimation = createFadeOutAnimation(leavingContent)
        .afterAddWrite(() => {
            // Upon completion of the leaving animation the content of leaving page should be hidden
            // and the content of entering page should be displayed
            leavingContent.forEach((el: HTMLElement | any) => el.classList.add(PAGE_HIDDEN_CLASS));
            enteringContent.forEach((el: HTMLElement | any) => el.classList.remove(PAGE_HIDDEN_CLASS));
        });

    const enteringAnimation = createAnimation();

    // Create staggered animation for all entering nodes
    enteringNodes.forEach(node => {
        if (node.el != null) {
            enteringAnimation
                .addAnimation(
                    createFadeInAnimation(node.el, node.offset, LEAVING_DURATION + ENTERING_OFFSET * node.index)
                );
        }
    });

    enteringAnimation
        .beforeAddWrite(() => {
            opts.enteringEl.classList.add(ANIMATING_CLASS);
            opts.leavingEl.classList.add(ANIMATING_CLASS);
            // Before starting entering animation, entering page should be visible to apply transition
            // For that entering page and baseEl(In flow routing outlet component) need to style with "display: contents"
            baseEl.style.display = CONTENTS_VALUE;
            opts.enteringEl.style.display = CONTENTS_VALUE;
        })
        .afterAddWrite(() => {
            opts.enteringEl.classList.remove(ANIMATING_CLASS);
            opts.leavingEl.classList.remove(ANIMATING_CLASS);
            // Upon completion of entering animation the visibility of leaving page content should be restored
            // However on iOS 12 and lower the leaving page does not disappear:
            // changing from "display: contents" to "display: none" does not hide the element.
            // Therefore not restoring the content visibility
            // leavingContent.forEach((el: HTMLElement) => el.classList.remove('page-hidden'));
            baseEl.style.display = baseElInitialStyle;
            opts.enteringEl.style.display = enteringElInitialStyle;
        });

    return createAnimation()
        .addAnimation(leavingAnimation)
        .addAnimation(enteringAnimation);
};

/**
 * Defines the transition animation in the backward direction
 * @param baseEl base element holding all step page components. In case of Flow this is the router outlet component
 * @param opts transition options of type `TransitionOptions`. Contain references to the leaving and entering elements
 * @returns animation setup instance
 */
function backwardAnimation(baseEl: HTMLElement, opts: TransitionOptions): Animation {

    // ion-header, ion-content and ion-footer should be processed separately as they don't have a parent suitable for control
    const leavingContent = opts.leavingEl.querySelectorAll(CONTENT_SELECTOR);
    const enteringContent = opts.enteringEl.querySelectorAll(CONTENT_SELECTOR);

    const enteringElInitialStyle = opts.enteringEl.style.display;
    const baseElInitialStyle = baseEl.style.display;

    // Initially the content of entering page should be completely hidden
    enteringContent.forEach((el: HTMLElement | any) => el.classList.add(PAGE_HIDDEN_CLASS));

    const leavingAnimation = createFadeOutAnimation(leavingContent)
        .afterAddWrite(() => {
            // Upon completion of the leaving animation the content of leaving page should be hidden
            // and the content of entering page should be displayed
            leavingContent.forEach((el: HTMLElement | any) => el.classList.add(PAGE_HIDDEN_CLASS));
            enteringContent.forEach((el: HTMLElement | any) => el.classList.remove(PAGE_HIDDEN_CLASS));
        });

    const enteringAnimation = createFadeInAnimation(enteringContent, 0, LEAVING_DURATION)
        .beforeAddWrite(() => {
            opts.enteringEl.classList.add(ANIMATING_CLASS);
            opts.leavingEl.classList.add(ANIMATING_CLASS);
            // Before starting entering animation, entering page should be visible to apply transition
            // For that entering page and baseEl(In flow routing outlet component) need to style with "display: contents"
            baseEl.style.display = CONTENTS_VALUE;
            opts.enteringEl.style.display = CONTENTS_VALUE;
        })
        .afterAddWrite(() => {
            opts.enteringEl.classList.remove(ANIMATING_CLASS);
            opts.leavingEl.classList.remove(ANIMATING_CLASS);
            // Upon completion of entering animation the visibility of leaving page content should be restored
            // However on iOS 12 and lower the leaving page does not disappear:
            // changing from "display: contents" to "display: none" does not hide the element.
            // Therefore not restoring the content visibility
            // leavingContent.forEach((el: HTMLElement) => el.classList.remove('page-hidden'));
            baseEl.style.display = baseElInitialStyle;
            opts.enteringEl.style.display = enteringElInitialStyle;
        });

    return createAnimation()
        .addAnimation(leavingAnimation)
        .addAnimation(enteringAnimation);
};
