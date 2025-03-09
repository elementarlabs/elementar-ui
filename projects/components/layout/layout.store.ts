import { patchState, signalStore, withMethods, withState, getState } from '@ngrx/signals';

export type VisibilityState = Record<'root' | 'drawer', boolean>;
export type StateLayoutId = keyof VisibilityState;

const initialState: VisibilityState = {
  root: true,
  drawer: true,
};

export const LayoutSidebarStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    showSidebarVisibility(layoutId: StateLayoutId, isShown: boolean): void {
      patchState(store, {
        [layoutId]: isShown
      });
    },
    getSidebarVisibility(layoutId: StateLayoutId): boolean {
      const state = getState(store);
      return state[layoutId] ?? false;
    }
  })),

);
