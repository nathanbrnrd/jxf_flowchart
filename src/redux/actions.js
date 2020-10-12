import * as Flowpoint from './flowpoint-actions';
import * as History from './history-actions'

import { cloneDeep } from 'lodash';
import { DUMMY_FLOWPOINTS } from '../fixtures/flowpoints';

const actions = store => ({
    openDialog: (state, selected) => ({ showCreateBox: true, selected }),
    closeDialog: () => ({ showCreateBox: false, selected: undefined }),
    // Flowpoint
    createFlowpoint: (state, name, outputs, comment) => ({ flowpoints: Flowpoint.create(state, name, outputs, comment) }),
    updateFlowpoint: (state, name, outputs, comment) => ({ flowpoints: Flowpoint.update(state, name, outputs, comment) }),
    deleteFlowpoint: (state) => ({ flowpoints: Flowpoint.remove(state) }),
    // History
    updateHistory: (state) => ({ history: History.update(state), historyPosition: state.historyPosition + 1 }),
    moveHistory: (state, type) => {
        const newPosition = History.movePosition(state, type);
        return { historyPosition: newPosition, flowpoints: cloneDeep(state.history[newPosition]) }
    },
    clearHistory: (state) => ({ historyPosition: 0, flowpoints: cloneDeep(state.history[0]), history: [cloneDeep(DUMMY_FLOWPOINTS)] }),
    // Navigation
    navigate: (state, view) => ({ drawerView: view }),
    // Bottom
    selectBottom: (state, selectedBottom) => ({ selectedBottom })
});

export default actions;