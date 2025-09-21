import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { ReturnsActions } from './returns.actions';
import { MedusaService } from '../../shared/api/medusa.service';
import { MedusaReturn, ReturnReason } from '../../shared/interfaces/medusa-return.interface';

export interface ReturnsStateModel {
    returns: MedusaReturn[];
    returnReasons: ReturnReason[];
    selectedReturn: MedusaReturn | null;
    loading: boolean;
    error: string | null;
}

@State<ReturnsStateModel>({
    name: 'returns',
    defaults: {
        returns: [],
        returnReasons: [],
        selectedReturn: null,
        loading: false,
        error: null
    }
})
@Injectable()
export class ReturnsState {
    constructor(private medusaService: MedusaService) {}

    @Selector()
    static getReturns(state: ReturnsStateModel): MedusaReturn[] {
        return state.returns;
    }

    @Selector()
    static getReturnReasons(state: ReturnsStateModel): ReturnReason[] {
        return state.returnReasons;
    }

    @Selector()
    static getSelectedReturn(state: ReturnsStateModel): MedusaReturn | null {
        return state.selectedReturn;
    }

    @Selector()
    static getLoading(state: ReturnsStateModel): boolean {
        return state.loading;
    }

    @Selector()
    static getError(state: ReturnsStateModel): string | null {
        return state.error;
    }

    @Action(ReturnsActions.CreateReturn)
    createReturn(ctx: StateContext<ReturnsStateModel>, action: ReturnsActions.CreateReturn) {
        ctx.patchState({ loading: true, error: null });

        return this.medusaService.createReturn(action.payload).pipe(
            tap({
                next: (response) => {
                    const state = ctx.getState();
                    const updatedReturns = [...state.returns, response.return];
                    ctx.patchState({
                        returns: updatedReturns,
                        loading: false
                    });
                },
                error: (error) => {
                    console.error('Error creating return:', error);
                    ctx.patchState({
                        loading: false,
                        error: error.message || 'Failed to create return'
                    });
                }
            })
        );
    }

    @Action(ReturnsActions.GetReturns)
    getReturns(ctx: StateContext<ReturnsStateModel>, action: ReturnsActions.GetReturns) {
        ctx.patchState({ loading: true, error: null });

        return this.medusaService.getReturns(action.payload?.limit, action.payload?.offset).pipe(
            tap({
                next: (response) => {
                    ctx.patchState({
                        returns: response.returns,
                        loading: false
                    });
                },
                error: (error) => {
                    console.error('Error getting returns:', error);
                    ctx.patchState({
                        loading: false,
                        error: error.message || 'Failed to get returns'
                    });
                }
            })
        );
    }

    @Action(ReturnsActions.GetReturnReasons)
    getReturnReasons(ctx: StateContext<ReturnsStateModel>) {
        ctx.patchState({ loading: true, error: null });

        return this.medusaService.getReturnReasons().pipe(
            tap({
                next: (response) => {
                    ctx.patchState({
                        returnReasons: response.return_reasons,
                        loading: false
                    });
                },
                error: (error) => {
                    console.error('Error getting return reasons:', error);
                    ctx.patchState({
                        loading: false,
                        error: error.message || 'Failed to get return reasons'
                    });
                }
            })
        );
    }

    @Action(ReturnsActions.SetReturns)
    setReturns(ctx: StateContext<ReturnsStateModel>, action: ReturnsActions.SetReturns) {
        ctx.patchState({ returns: action.payload });
    }

    @Action(ReturnsActions.SetReturnReasons)
    setReturnReasons(ctx: StateContext<ReturnsStateModel>, action: ReturnsActions.SetReturnReasons) {
        ctx.patchState({ returnReasons: action.payload });
    }

    @Action(ReturnsActions.SetSelectedReturn)
    setSelectedReturn(ctx: StateContext<ReturnsStateModel>, action: ReturnsActions.SetSelectedReturn) {
        ctx.patchState({ selectedReturn: action.payload });
    }

    @Action(ReturnsActions.ClearReturns)
    clearReturns(ctx: StateContext<ReturnsStateModel>) {
        ctx.patchState({
            returns: [],
            returnReasons: [],
            selectedReturn: null,
            loading: false,
            error: null
        });
    }
} 