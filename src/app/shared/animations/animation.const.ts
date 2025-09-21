/* eslint-disable @typescript-eslint/naming-convention */
import { slideAnimation, fadeOutAnimation, flipAnimation } from './nav-animation';


// The entering page will always get z-index 101.
// Therefore when the leaving page should appear on top it should have z - index 102.;
export const UPPER_PAGE_INDEX = 102;

/** Defines various page animation duration values */
export const PageAnimationDuration = {
    SLIDING: 200, // ms
    FLIPPING: 400, // ms
    FADING: 300, // ms
};

/** Collection of all CSS properties, which can be used in animation */
export const AnimatedProperty = {
    TRANSFORM: 'transform',
    PERSPECTIVE: 'perspective',
    OPACITY: 'opacity',
    Z_INDEX: 'z-index',
    OVERFLOW: 'overflow',
};

/**
 * Collection of all CSS property values, which can be used in animation
 */
export const AnimatedValue = {
    VISIBLE: 'visible',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    // value for CSS size-like property with size in view-width units, e.g. "50vw"
    VIEW_WIDTH: (arg: number): string => `${arg}vw`,
    // *rotateY()* value for CSS property *transform* with angle in degrees, e.g. "rotateY(90deg)"
    ROTATE_Y: (arg: number): string => `rotateY(${arg}deg)`,
    // *translateY()* value for CSS property *transformY* with offset in percent, e.g. "transformY(100%)"
    TRANSLATE_Y_PCT: (arg: number): string => `translateY(${arg}%)`,
    // *scale()* value for CSS property *transform* with scale coefficient, e.g. "scale(0.9)"
    SCALE: (arg: number): string => `scale(${arg})`,
};

/** Reserved Ionic class used to hide the entering page in the beginning of the animation */
export const PAGE_INVISIBLE_CLASS = 'ion-page-invisible';

/** Definition of page animation types. */
export enum AnimationType {
    /** Applies standard exit animation  */
    GENERIC = 'generic',
    /** Applies slide up and down animation for forward and back navigation correspondingly */
    SLIDE_UP_DOWN = 'slide-up-down',
    /** Applies flipping animation */
    FLIP = 'flip',
    /** Applies fade-out animation */
    FADE_OUT = 'fade-out'
}

/** Dictionary of animation functions for each page animation type */
export const pageAnimations = {
    // [AnimationType.SLIDE_UP_DOWN]: slideAnimation,
    // [AnimationType.FADE_OUT]: fadeOutAnimation,
    // [AnimationType.FLIP]: flipAnimation,
};
