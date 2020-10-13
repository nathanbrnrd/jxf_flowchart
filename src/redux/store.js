import createStore from "redux-zero";
import { applyMiddleware } from "redux-zero/middleware";
import { connect } from "redux-zero/devtools";

import { cloneDeep } from 'lodash';
import { DUMMY_FLOWPOINTS, DUMMY_PAGE } from '../fixtures/flowpoints';

const initialState = {
    showCreateBox: false,
    selected: undefined,
    flowpoints: cloneDeep(DUMMY_FLOWPOINTS),
    globalComment: 'This is  comment',
    history: [cloneDeep(DUMMY_FLOWPOINTS)],
    historyPosition: 0,
    isLocked: false,
    drawerView: undefined,
    pageOptions: cloneDeep(DUMMY_PAGE)
};

const middlewares = connect ? applyMiddleware(connect(initialState)) : [];

const store = createStore(initialState, middlewares);

export default store;