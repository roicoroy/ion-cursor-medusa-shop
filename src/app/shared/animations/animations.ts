import { animation, style, animate } from '@angular/animations';
import { AnimationSeries, NamedAnimation } from './animation-series';

/**
 * Animation series defining sliding animation with zooming effect for entering and leaving states
 */
class SlideWithZoomAnimation extends AnimationSeries {
    /** Definition of reusable animations */
    static override readonly animations: NamedAnimation[] = [[
        ':enter',
        animation([
            style({ height: 0, opacity: 0, transform: 'scale3d(0.5, 0.5, 1)', transformOrigin: 'top center' }),
            animate('100ms ease-out')
        ])
    ], [
        ':leave',
        animation([
            animate('100ms ease-out',
                style({ height: 0, opacity: 0, transform: 'scale3d(0.5, 0.5, 1)', transformOrigin: 'top center' })
            )
        ])
    ]];
}
export const slideWithZoom = () => SlideWithZoomAnimation.trigger('slideWithZoom');


/**
 * Animation series defining fading animation
 */
class FadeAnimation extends AnimationSeries {
    /** Definition of reusable animations */
    static override readonly animations: NamedAnimation[] = [[
        ':enter',
        animation([
            style({ opacity: 0 }),
            animate('350ms ease-out')
        ])
    ], [
        ':leave',
        animation([
            animate('350ms ease-out',
                style({ opacity: 0 })
            )
        ])
    ]];
}
export const fade = () => FadeAnimation.trigger('fade');


/**
 * Animation series defining fading animation with zooming effect for entering state
 */
class FadeWithZoomAnimation extends AnimationSeries {
    /** Definition of reusable animations */
    static override readonly animations: NamedAnimation[] = [[
        ':enter',
        animation([
            style({ opacity: 0, transform: 'scale3d(0.8, 0.8, 1)' }),
            animate('150ms cubic-bezier(0.5, 0.5, 0.75, 1.5)')
        ])
    ]];
}
export const fadeWithZoom = () => FadeWithZoomAnimation.trigger('fadeWithZoom');


/**
 * Animation series defining sliding upwards animation with fading effect for entering and leaving states
 */
class SlideUpAnimation extends AnimationSeries {
    /** Definition of reusable animations */
    static override readonly animations: NamedAnimation[] = [[
        ':enter',
        animation([
            style({ opacity: 0, transform: 'translateY(10%)' }),
            animate('200ms ease-in')
        ])
    ], [
        ':leave',
        animation([
            animate('200ms ease-in',
                style({ opacity: 0 })
            )
        ])
    ]];
}
export const slideUp = () => SlideUpAnimation.trigger('slideUp');


/**
 * Animation series defining height scaling animation for entering and leaving states
 */
class ScaleHeightAnimation extends AnimationSeries {
    /** Definition of reusable animations */
    static override readonly animations: NamedAnimation[] = [[
        ':enter',
        animation([
            style({ maxHeight: 0, opacity: 0 }),
            animate('500ms',
                style({ maxHeight: '500px', opacity: 1 })
            )
        ])
    ], [
        ':leave',
        animation([
            animate('150ms',
                style({ height: 0, opacity: 0 })
            )
        ])
    ]];
}
export const scaleHeight = () => ScaleHeightAnimation.trigger('scaleHeight');
