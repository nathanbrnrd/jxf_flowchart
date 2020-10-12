import { cloneDeep } from 'lodash';

// TODO: try to add all state in history
export function update(state) {
    const newHistory = state.history.filter((_, i) => i <= state.historyPosition);
    return [...newHistory, cloneDeep(state.flowpoints)];
}

export function movePosition(state, action) {
    switch (action) {
        case 'increment':
            return state.historyPosition + 1;
        case 'decrement':
            return state.historyPosition - 1
    }
}