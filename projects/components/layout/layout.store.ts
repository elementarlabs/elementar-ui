import { patchState, signalStore, withMethods, withState, getState} from '@ngrx/signals';

export type VisibilityState = Record<string, boolean>;

const initialState: VisibilityState = {
  root: true,
  drawer: true,
};

export const LayoutSidebarStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    showSidebarVisibility(layoutId: string, isShown: boolean): void {
      patchState(store, {
        [layoutId]: isShown
      });
    },
    getSidebarVisibility(layoutId: string): boolean {
      const state = getState(store);
      return state[layoutId] ?? false;
    }
  })),

);
