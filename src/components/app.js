import { h } from 'preact';
import './style.scss';

import FlowDiagram from './flow-diagram/flow-diagram.js';
import JXFDrawer from './drawer/drawer'
import FlowpointControlDialog from './dialog-content/flowpoint-control-dialog';
import Navigation from './navigation/navigation';

import { Provider } from "redux-zero/preact";
import store from "../redux/store";



export default function App() {
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