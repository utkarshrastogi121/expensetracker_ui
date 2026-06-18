
export interface UiState {
  sidebarOpen: boolean;
}

const initialState: UiState = {
  sidebarOpen: false,
};

export const OPEN_SIDEBAR = 'ui/OPEN_SIDEBAR';
export const CLOSE_SIDEBAR = 'ui/CLOSE_SIDEBAR';
export const TOGGLE_SIDEBAR = 'ui/TOGGLE_SIDEBAR';

interface UiAction {
  type: typeof OPEN_SIDEBAR | typeof CLOSE_SIDEBAR | typeof TOGGLE_SIDEBAR;
}

export function openSidebar(): UiAction {
  return { type: OPEN_SIDEBAR };
}

export function closeSidebar(): UiAction {
  return { type: CLOSE_SIDEBAR };
}

export function toggleSidebar(): UiAction {
  return { type: TOGGLE_SIDEBAR };
}

export function uiReducer(state: UiState = initialState, action: UiAction): UiState {
  switch (action.type) {
    case OPEN_SIDEBAR:
      return { ...state, sidebarOpen: true };
    case CLOSE_SIDEBAR:
      return { ...state, sidebarOpen: false };
    case TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      return state;
  }
}
