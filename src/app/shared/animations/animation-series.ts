import { AnimationReferenceMetadata, AnimationTriggerMetadata, transition, trigger, useAnimation } from '@angular/animations';

/**
 * A tuple objet containing the name and the animation metadata for an animation.
 */
export type NamedAnimation = [string, AnimationReferenceMetadata];

/**
 * Abstract ancestor class defining the common behavior fo all animation series objects
 */
export abstract class AnimationSeries {
    /** Series of animations which should be defined in the descendant classes */
    static readonly animations: NamedAnimation[];

    static trigger(ref: string): AnimationTriggerMetadata {

        return trigger(ref, this.animations.map(item => transition(item[0], [useAnimation(item[1])])));
    }
}
