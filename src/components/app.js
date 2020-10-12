import { h, Component } from 'preact';
import './style.scss';

import { cloneDeep } from 'lodash';

import FlowDiagram from './flow-diagram/flow-diagram.js';
import JXFDrawer from './drawer/drawer'
import FlowpointControlDialog from './dialog-content/flowpoint-control-dialog';
import Navigation from './navigation/navigation';

import { DUMMY_FLOWPOINTS } from '../fixtures/flowpoints';

import { Provider } from "redux-zero/preact";
import store from "../redux/store";



export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showCreateBox: false,
            selected: undefined,
            flowpoints: cloneDeep(DUMMY_FLOWPOINTS),
            globalComment: 'This is  comment',
            history: [cloneDeep(DUMMY_FLOWPOINTS)],
            historyPosition: 0,
            selectedBottom: undefined,
            isLocked: false,
            drawerView: undefined
        }
    }

    render() {
        return (
            <Provider store={store}>
                <div class="jxf_container">
                    <FlowpointControlDialog />

                    <div class="jxf_top">
                        <FlowDiagram />
                    </div>

                    <JXFDrawer />
                    <Navigation />
                </div>
            </Provider>
        )
    }
}