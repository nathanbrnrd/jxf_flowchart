import { h, Component, createContext } from 'preact';

// Flowspace
import Flowspace from '../api/Flowspace.js';
import Flowpoint from '../api/Flowpoint.js';

import { AddFlowpointButton } from './create-button';
import { FlowpointContent } from './flowpoint-content';
import { FlowpointControlDialog } from './flowpoint-control-dialog';
import { DUMMY_FLOWPOINTS } from '../fixtures/flowpoints';

export const FlowpointOptions = createContext();

const OUTPUT_VALUE = {
    "output": "auto",
    "input": "auto",
    "dash": 0
};


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showCreateBox: false,
            selected: undefined,
            flowpoints: DUMMY_FLOWPOINTS
        }
    }

    handleClick() {
        console.log('handle_key');
    }

    handleTouch() {
        console.log('handle_touch');
    }

    openDialog = (selected) => this.setState({selected, showCreateBox: true});
    closeDialog = () => this.setState({showCreateBox: false, selected: undefined}); // TODO: delay setState `selected` => appears undefined before closing Dialog
    getOutputs = () => {
        const availableFlowpoints = this.state.selected ?
         this.state.flowpoints.filter(flowpoint => flowpoint.id !== this.state.selected.id) :
         this.state.flowpoints;
         return {
             available: availableFlowpoints.map(flowpoint => ({id: flowpoint.id.toString(), name: flowpoint.name})),
             selected: this.state.selected ? Object.keys(this.state.selected.outputs) : []
            }
    }

    deleteFlowpoint = () => {
        const id = this.state.selected.id;
        const remainingFlowPoints = this.state.flowpoints.filter(flowpoint => flowpoint.id !== id);
        remainingFlowPoints.forEach(flowpoint => {
            if (flowpoint.outputs && flowpoint.outputs[id.toString()]) {
                delete flowpoint.outputs[id.toString()]
            }
        });
        this.setState({flowpoints: remainingFlowPoints});
        this.closeDialog();
    }

    createFlowPoint = (name, outputs = []) => {
        const newId = Math.max(...this.state.flowpoints.map(flowpoint => flowpoint.id)) + 1;
        const newFlowpoint = {
            id: newId,
            name: name,
            outputs: {},
            pos: {
                "x": 100,
                "y": 100
            },
        }
        outputs.forEach(output => {
            newFlowpoint.outputs[output] = OUTPUT_VALUE;
        });
        const flowpoints = [...this.state.flowpoints, ...newFlowpoint];
        this.setState({ flowpoints, showCreateBox: false });
        this.closeDialog();
    }

    updateFlowPoint = (name, outputs) => {
        const selectedId = this.state.selected.id;
        const selectedFlowpoint = this.state.flowpoints.find(flowpoint => flowpoint.id === selectedId);
        selectedFlowpoint.name = name;
        if (outputs) { // outputs undefined if not changed
            selectedFlowpoint.outputs = {}; // Reset selected outputs
            outputs.forEach(output => selectedFlowpoint.outputs[output] = OUTPUT_VALUE) // Rebuild all selected outputs
        }
        this.setState({flowpoints: this.state.flowpoints});
        this.closeDialog();
    }

    render(_ , {showCreateBox, flowpoints, selected}) {
        return (
            <div>
                <FlowpointOptions.Provider value={this.getOutputs()}>
                    <FlowpointControlDialog
                        isOpen={showCreateBox}
                        selected={selected}
                        createFlowPoint={this.createFlowPoint}
                        updateFlowPoint={this.updateFlowPoint}
                        deleteFlowpoint={this.deleteFlowpoint}
                        closeDialog={this.closeDialog} />
                </FlowpointOptions.Provider>
                <Flowspace
                    theme="blue"
                    variant="outlined"
                    background="black"
                    avoidCollisions
                    connectionSize={4}>
                    {
                        flowpoints.map(flowpoint => {
                            return (
                                <Flowpoint
                                    key={flowpoint.id.toString()}
                                    snap={{ x: 10, y: 10 }}
                                    style={{ height: Math.max(50, Math.ceil(flowpoint.name.length / 20) * 30) }}
                                    startPosition={flowpoint.pos}
                                    outputs={flowpoint.outputs}
                                    onClick={e => { this.handleClick(flowpoint.id, e) }}
                                    onTouch={e => { this.handleTouch(flowpoint.id) }}
                                    onDrag={pos => {
                                        var points = this.state.points;
                                        flowpoint.pos = pos;
                                        this.setState({ points, lastPos: pos })
                                    }}>
                                    <FlowpointContent openDialog={() => this.openDialog(flowpoint)} name={flowpoint.name} />
                                </Flowpoint>

                            )

                        })
                    }
                </Flowspace>

                <AddFlowpointButton openDialog={() => this.openDialog()} />
            </div>
        )
    }
}