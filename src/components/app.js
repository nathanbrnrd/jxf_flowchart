import { h, Component, createContext } from 'preact';
import './style.scss';

import { cloneDeep } from 'lodash';

// Flowspace
import Flowspace from '../api/Flowspace.js';
import Flowpoint from '../api/Flowpoint.js';

import { AddFlowpointButton } from './create-button';
import { FlowpointContent } from './flowpoint-content';
import { FlowpointControlDialog } from './flowpoint-control-dialog';
import { DUMMY_FLOWPOINTS } from '../fixtures/flowpoints';

// Material-UI
import { Redo, Undo, Clear } from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export const FlowpointOptions = createContext();
export const FlowpointComment = createContext();

const OUTPUT_VALUE = {
    "output": "auto",
    "input": "auto",
    "dash": 0,
    "arrowEnd": true
};


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showCreateBox: false,
            selected: undefined,
            flowpoints: cloneDeep(DUMMY_FLOWPOINTS),
            globalComment: 'This is  comment',
            history: [cloneDeep(DUMMY_FLOWPOINTS)],
            historyPosition: 0
        }
    }

    handleClick() {
        console.log('handle_key');
    }

    handleTouch() {
        console.log('handle_touch');
    }

    undoChanges = () => {
        const newHistoryPosition = this.state.historyPosition - 1;
        this.setState({historyPosition: newHistoryPosition, flowpoints: cloneDeep(this.state.history[newHistoryPosition])});
    }

    redoChanges = () => {
        const newHistoryPosition = this.state.historyPosition + 1;
        this.setState({historyPosition: newHistoryPosition, flowpoints: cloneDeep(this.state.history[newHistoryPosition])});
    }

    clearChanges = () => {
        this.setState({historyPosition: 0, flowpoints: cloneDeep(this.state.history[0]), history: [cloneDeep(DUMMY_FLOWPOINTS)]});
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
        this.setState({flowpoints: remainingFlowPoints}, () => this.updateHistory());
        this.closeDialog();
    }

    updateHistory() {
        const newHistory = this.state.history.filter((_, i) => i <= this.state.historyPosition);
        this.setState({history: [...newHistory, cloneDeep(this.state.flowpoints)], historyPosition: this.state.historyPosition + 1},
            () => console.log(this.state.history));
    }

    createFlowPoint = (name, outputs = [], comment) => {
        const newId = Math.max(...this.state.flowpoints.map(flowpoint => flowpoint.id)) + 1;
        const newFlowpoint = {
            id: newId,
            name: name,
            comment,
            outputs: {},
            pos: {
                "x": 15,
                "y": 0
            },
        }
        outputs.forEach(output => {
            newFlowpoint.outputs[output] = OUTPUT_VALUE;
        });
        const flowpoints = [...this.state.flowpoints, ...newFlowpoint];
        this.setState({ flowpoints, showCreateBox: false }, () => this.updateHistory());
        this.closeDialog();
    }

    updateFlowPoint = (name, outputs, comment) => {
        const selectedId = this.state.selected.id;
        const selectedFlowpoint = this.state.flowpoints.find(flowpoint => flowpoint.id === selectedId);
        selectedFlowpoint.name = name;
        selectedFlowpoint.comment = comment;
        if (outputs) { // outputs undefined if not changed
            selectedFlowpoint.outputs = {}; // Reset selected outputs
            outputs.forEach(output => selectedFlowpoint.outputs[output] = OUTPUT_VALUE) // Rebuild all selected outputs
        }
        this.setState({flowpoints: this.state.flowpoints}, () => this.updateHistory());
        this.closeDialog();
    }

    render(_ , {showCreateBox, flowpoints, selected, globalComment, history, historyPosition}) {
        return (
            <div class="jxf_container">
                <FlowpointOptions.Provider value={this.getOutputs()}>
                    <FlowpointComment.Provider value={this.state.selected ? this.state.selected.comment : undefined}>
                        <FlowpointControlDialog
                            isOpen={showCreateBox}
                            selected={selected}
                            createFlowPoint={this.createFlowPoint}
                            updateFlowPoint={this.updateFlowPoint}
                            deleteFlowpoint={this.deleteFlowpoint}
                            closeDialog={this.closeDialog} />
                        </FlowpointComment.Provider>
                </FlowpointOptions.Provider>
                <div class="jxf_top">
                    <Flowspace
                        theme="blue"
                        variant="outlined"
                        background="black"
                        avoidCollisions
                        connectionSize={2}>
                        {
                            flowpoints.map(flowpoint => {
                                return (
                                    /* TODO: harmonize style */
                                    <Flowpoint
                                        key={flowpoint.id.toString()}
                                        snap={{ x: 10, y: 10 }}
                                        style={{ height: Math.max(50, Math.ceil(flowpoint.name.length / 20) * 30), background: 'rgba(0,0,0,0.8)' }}
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
                    <div class="jxf_actions">
                        <div>
                            {/* TODO: manage style through theming and CSS in JS */}
                            <Fab color="primary" aria-label="add" size="small" onClick={this.clearChanges}>
                                <Clear />
                            </Fab>
                            <Fab color="primary" aria-label="add" size="small" onClick={this.undoChanges} disabled={historyPosition === 0}
                             style={{background: historyPosition === 0 ? 'rgba(63,81,181,0.5)' : 'rgb(63,81,181)', 
                             color: historyPosition === 0 ? 'rgba(255,255,255,0.5)' : 'white'}}>
                                <Undo />
                            </Fab>
                            <Fab color="primary" aria-label="add" size="small"
                                onClick={this.redoChanges} disabled={historyPosition === history.length - 1}
                                style={{background: historyPosition === history.length - 1 ? 'rgba(63,81,181,0.5)' : 'rgb(63,81,181)', 
                             color: historyPosition === history.length - 1 ? 'rgba(255,255,255,0.5)' : 'white'}}>
                                <Redo />
                            </Fab>
                            <AddFlowpointButton openDialog={() => this.openDialog()} />
                        </div>
                        <Button variant="contained">Save</Button>
                    </div>
                </div>

                <div class="jxf_bottom">
                    <TextField
                        id="outlined-textarea"
                        placeholder="Note"
                        multiline
                        fullWidth
                        value={globalComment}
                        variant="outlined"
                        rows={3}
                        onInput={(e) => this.setState({globalComment: e.target.value})}
                    />
                </div>
            </div>
        )
    }
}