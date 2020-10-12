import { h } from 'preact';

import { connect } from "redux-zero/preact";
import actions from '../../redux/actions';

import FlowpointContent from './flowpoint-content';
// Flowspace
import Flowspace from '../../api/Flowspace.js';
import Flowpoint from '../../api/Flowpoint.js';
// Third party
import { MapInteractionCSS } from 'react-map-interaction';

function FlowDiagram({ flowpoints, isLocked, selectedBottom, selectBottom }) {

    const handleClick = (id) => selectBottom(flowpoints.find(flowpoint => flowpoint.id === id));

    const handleTouch = () => console.log('handle_touch: same as handleClick');

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
                onClick={() => selectBottom()}>
                {
                    flowpoints.map(flowpoint => {
                        return (
                            <Flowpoint
                                key={flowpoint.id}
                                snap={{ x: 10, y: 10 }}
                                style={{ height: Math.max(50, Math.ceil(flowpoint.name.length / 20) * 30), background: 'rgba(0,0,0,0.8)' }}
                                startPosition={flowpoint.pos}
                                outputs={flowpoint.outputs}
                                isLocked={isLocked}
                                selected={selectedBottom && selectedBottom.id === flowpoint.id}
                                onClick={(id) => handleClick(id)}
                                onTouch={(id) => handleClick(id)}
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

const mapToProps = ({ flowpoints, isLocked, selectedBottom }) => ({ flowpoints, isLocked, selectedBottom });

export default connect(
    mapToProps,
    actions
  )(FlowDiagram);