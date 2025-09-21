/**
 * Holds references to the elements participating in the transition.
 *
 * @todo replace by genuine Ionic interface after updating Ionic library
 */
export interface TransitionOptions {
    baseEl: HTMLElement;
    enteringEl: HTMLElement;
    leavingEl?: HTMLElement;
    direction: string;
}
