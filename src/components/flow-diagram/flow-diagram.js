import { h } from 'preact';

import { connect } from "redux-zero/preact";
import actions from '../../redux/actions';

import FlowpointContent from './flowpoint-content';
// Flowspace
import Flowspace from '../../api/Flowspace.js';
import Flowpoint from '../../api/Flowpoint.js';
// Third party
import { MapInteractionCSS } from 'react-map-interaction';

import store from '../../redux/store'

// TODO: find better way. state in functional component is old state in callback function
function handleClick(flowpoint) {
    const flowpoints = store.getState().flowpoints;
    const selected = flowpoints.find(f => f.id === flowpoint.id);
    store.setState({selected})
}

function FlowDiagram({ flowpoints, isLocked, selected, selectFlowpoint }) {
    return (
        <MapInteractionCSS defaultScale={2}
            defaultTranslation={{ x: 100, y: 100 }}
            minScale={0.5}
            maxScale={2}>
            <Flowspace
                theme="blue"
                variant="outlined"
                background="black"
                avoidCollisions
                connectionSize={2}
                onClick={() => selectFlowpoint()}>
                    
                {
                    // TODO: problem with click callback
                    flowpoints.map(flowpoint => {
                        return (
                            <Flowpoint
                                key={flowpoint.id}
                                snap={{ x: 10, y: 10 }}
                                style={{ height: Math.max(50, Math.ceil(flowpoint.name.length / 20) * 30), background: 'rgba(0,0,0,0.8)' }}
                                startPosition={flowpoint.pos}
                                outputs={flowpoint.outputs}
                                isLocked={isLocked}
                                selected={selected && selected.id === flowpoint.id}
                                onClick={() => handleClick(flowpoint)} // TODO: make Flowpoint return e
                                onTouch={() => selectFlowpoint(flowpoint)}
                                onDragEnd={() => console.log('should save in history')}
                                onDrag={pos => {
                                    // TODO: not necessary
                                    var points = this.state.points;
                                    flowpoint.pos = pos;
                                    // this.setState({ points, lastPos: pos })
                                }}>
                                <FlowpointContent flowpoint={flowpoint} />
                            </Flowpoint>
                        )

                    })
                }
            </Flowspace>
        </MapInteractionCSS>
    );
}

const mapToProps = ({ flowpoints, isLocked, selected }) => ({ flowpoints, isLocked, selected });

export default connect(
    mapToProps,
    actions
)(FlowDiagram);