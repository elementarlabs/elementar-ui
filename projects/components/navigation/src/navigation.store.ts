import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export interface NavigationState {
  activeKey: any;
  activeGroupKey: any;
}

const initialState: NavigationState = {
  activeKey: null,
  activeGroupKey: null
};

export const NavigationStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    setActiveKey(activeKey: any) {
      patchState(store, {
        activeKey
      });
    },
    setActiveGroupKey(activeGroupKey: any) {
      patchState(store, {
        activeGroupKey
      });
    },
  }))
);
