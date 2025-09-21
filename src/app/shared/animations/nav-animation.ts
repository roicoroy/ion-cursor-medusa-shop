import { createAnimation, Animation } from '@ionic/angular';
import { AnimatedProperty, AnimatedValue, PageAnimationDuration, PAGE_INVISIBLE_CLASS, UPPER_PAGE_INDEX } from './animation.const';
import { TransitionOptions } from './animation.model';

export const slideAnimation = (baseEl: HTMLElement, opts?: TransitionOptions | any): Animation =>
    opts.direction === 'forward'
        ? slideUpAnimation(baseEl, opts)
        : slideDownAnimation(baseEl, opts);

export function slideUpAnimation(baseEl: HTMLElement, opts?: TransitionOptions | any): Animation {
    return createAnimation()
        .addElement(opts.enteringEl)
        .duration(PageAnimationDuration.SLIDING)
        .easing(AnimatedValue.EASE_OUT)
        .beforeStyles({
            [AnimatedProperty.OPACITY]: 1,
            [AnimatedProperty.Z_INDEX]: UPPER_PAGE_INDEX
        })
        .fromTo(AnimatedProperty.TRANSFORM, AnimatedValue.TRANSLATE_Y_PCT(100), AnimatedValue.TRANSLATE_Y_PCT(0));
}

export function slideDownAnimation(baseEl: HTMLElement, opts?: TransitionOptions | any): Animation {
    opts.enteringEl.classList.remove(PAGE_INVISIBLE_CLASS);

    const leaveAnimation = createAnimation()
        .addElement(opts.leavingEl)
        .duration(PageAnimationDuration.SLIDING)
        .fromTo(AnimatedProperty.TRANSFORM, AnimatedValue.TRANSLATE_Y_PCT(0), AnimatedValue.TRANSLATE_Y_PCT(100))
        .easing(AnimatedValue.EASE_OUT);

    return createAnimation()
        .addAnimation(leaveAnimation);
}

/**
 * Sets up entering and leaving animation for a *flipping page* effect.
 * Used by Ionic components, which accept an input `Animation` object to customize their animation behavior.
 *
 * @param baseEl the base router outlet component
 * @param opts transition options of type `TransitionOptions`. Contain references to the leaving and entering elements
 * @returns animation setup instance
 */
export function flipAnimation(baseEl: HTMLElement, opts?: TransitionOptions | any): Animation {
    const baseAnimation = createAnimation()
        .addElement(baseEl)
        .beforeStyles({
            [AnimatedProperty.PERSPECTIVE]: AnimatedValue.VIEW_WIDTH(500),
            [AnimatedProperty.OVERFLOW]: AnimatedValue.VISIBLE
        })
        .duration(PageAnimationDuration.FLIPPING / 2)
        .direction('alternate')
        .iterations(2)
        .fromTo(AnimatedProperty.TRANSFORM, AnimatedValue.SCALE(1), AnimatedValue.SCALE(0.9))
        .afterClearStyles([
            AnimatedProperty.PERSPECTIVE,
            AnimatedProperty.OVERFLOW
        ]);

    const leaveAnimation = createAnimation()
        .addElement(opts.leavingEl)
        .duration(PageAnimationDuration.FLIPPING / 2)
        .fromTo(AnimatedProperty.TRANSFORM, AnimatedValue.ROTATE_Y(0), AnimatedValue.ROTATE_Y(-90))
        .easing(AnimatedValue.EASE_IN);

    const enterAnimation = createAnimation()
        .addElement(opts.enteringEl)
        .delay(PageAnimationDuration.FLIPPING / 2)
        .beforeRemoveClass(PAGE_INVISIBLE_CLASS)
        .duration(PageAnimationDuration.FLIPPING / 2)
        .fromTo(AnimatedProperty.TRANSFORM, AnimatedValue.ROTATE_Y(90), AnimatedValue.ROTATE_Y(0))
        .easing(AnimatedValue.EASE_OUT);

    return createAnimation()
        .addAnimation(baseAnimation)
        .addAnimation(leaveAnimation)
        .addAnimation(enterAnimation);
}

/**
 * Sets up leaving animation for a page fade-out effect.
 * Used by Ionic components, which accept an input `Animation` object to customize their animation behavior.
 *
 * @param baseEl the base router outlet component
 * @param opts transition options of type `TransitionOptions`. Contain references to the leaving and entering elements
 * @returns animation setup instance
 */
export function fadeOutAnimation(baseEl: HTMLElement, opts?: TransitionOptions | any): Animation {
    opts?.enteringEl.classList.remove(PAGE_INVISIBLE_CLASS);

    const leavingAnimation = createAnimation()
        .addElement(opts?.leavingEl)
        .beforeStyles({
            [AnimatedProperty.Z_INDEX]: UPPER_PAGE_INDEX
        })
        .duration(PageAnimationDuration.FADING)
        .fromTo(AnimatedProperty.OPACITY, 1, 0)
        .easing(AnimatedValue.EASE_OUT);

    return createAnimation()
        .addAnimation(leavingAnimation);
}
