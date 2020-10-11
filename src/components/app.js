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
import { Redo, Undo, Clear, Settings, Save } from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';

import { makeStyles } from '@material-ui/core/styles';

export const FlowpointOptions = createContext();
export const FlowpointComment = createContext();

const useStyles = makeStyles((theme) => ({
  paper: {
    overflowY: 'visible',
    visibility: 'visible!important'
  }
}));

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
            drawerOpen: true,
            showCreateBox: false,
            selected: undefined,
            flowpoints: cloneDeep(DUMMY_FLOWPOINTS),
            globalComment: 'This is  comment',
            history: [cloneDeep(DUMMY_FLOWPOINTS)],
            historyPosition: 0,
            selectedBottom: undefined
        }
    }

    classes = useStyles();

    handleClick = (id) => this.setState({selectedBottom: this.state.flowpoints.find(flowpoint => flowpoint.id === id)})
    handleTouch() {
        // TODO: same as handleClick
        console.log('handle_touch');
    }

    updateBottom = (value) => {
        if (this.state.selectedBottom) {
            const id = this.state.selectedBottom.id;
            const selectedBottom = {...this.state.selectedBottom, comment: value};
            const flowpointIndex = this.state.flowpoints.findIndex(flowpoint => flowpoint.id === id);
            const flowpoints = this.state.flowpoints;
            flowpoints[flowpointIndex] = selectedBottom;
            this.setState({ selectedBottom, flowpoints});
        } else {
            this.setState({ globalComment: value });
        }
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
             available: availableFlowpoints.map(flowpoint => ({id: flowpoint.id, name: flowpoint.name})),
             selected: this.state.selected ? this.state.selected.outputs.map(output => output.linkedTo) : []
            }
    }

    deleteFlowpoint = () => {
        const id = this.state.selected.id;
        const remainingFlowPoints = this.state.flowpoints.filter(flowpoint => flowpoint.id !== id);
        remainingFlowPoints.forEach(flowpoint => {
            flowpoint.outputs = flowpoint.outputs.filter(output => output.linkedTo !== id);
        });
        this.setState({flowpoints: remainingFlowPoints}, () => this.updateHistory());
        this.closeDialog();
    }

    updateHistory() { // TODO: try to add all state in history
        const newHistory = this.state.history.filter((_, i) => i <= this.state.historyPosition);
        this.setState({history: [...newHistory, cloneDeep(this.state.flowpoints)], historyPosition: this.state.historyPosition + 1});
    }

    createFlowPoint = (name, outputs = [], comment) => {
        const newId = Math.max(...this.state.flowpoints.map(flowpoint => flowpoint.id)) + 1;
        const newFlowpoint = {
            id: newId,
            name: name,
            comment,
            outputs: outputs.map(output => ({linkedTo: output, ...OUTPUT_VALUE})),
            pos: {
                "x": 15,
                "y": 0
            },
        }
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
            selectedFlowpoint.outputs = outputs.map(output => ({linkedTo: output, ...OUTPUT_VALUE}));
        }
        this.setState({flowpoints: this.state.flowpoints}, () => this.updateHistory());
        this.closeDialog();
    }

    render(_ , {showCreateBox, flowpoints, selected, globalComment, history, historyPosition, drawerOpen, selectedBottom}) {
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
                        connectionSize={2}
                        onClick={() => this.setState({selectedBottom: undefined})}>
                        {
                            flowpoints.map(flowpoint => {
                                return (
                                    /* TODO: harmonize style */
                                    <Flowpoint
                                        key={flowpoint.id}
                                        snap={{ x: 10, y: 10 }}
                                        style={{ height: Math.max(50, Math.ceil(flowpoint.name.length / 20) * 30), background: 'rgba(0,0,0,0.8)' }}
                                        startPosition={flowpoint.pos}
                                        outputs={flowpoint.outputs}
                                        onClick={ (id) => this.handleClick(Number(id))}
                                        onTouch={e => { this.handleTouch(flowpoint.id) }}
                                        onDragEnd={() => console.log('should save in history')}
                                        onDrag={pos => {
                                            // TODO: not necessary
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
                        <div>
                            <Fab color="primary" aria-label="add" size="small">
                                <Settings />
                            </Fab>
                            <Fab color="default" aria-label="add" size="small">
                                <Save />
                            </Fab>
                        </div>
                    </div>
                </div>

 
                <Drawer
                    classes={{paper: this.classes.paper}}
                    variant="persistent"
                    anchor="bottom"
                    open={drawerOpen}
                >
                    <div style={{color: 'white', margin: 0, position: 'absolute', width: '100%', top: '-20px'}}>
                        <span onClick={() => this.setState({drawerOpen: !drawerOpen, selectedBottom: undefined})}>Notes</span>
                    {drawerOpen && <span> for {selectedBottom ? selectedBottom.name : 'global'}</span>}
                    </div>
                    <TextField
                        id="outlined-textarea"
                        placeholder="Note"
                        multiline
                        fullWidth
                        value={selectedBottom ? selectedBottom.comment || '' : globalComment}
                        variant="outlined"
                        rows={3}
                        onChange={(e) => this.updateBottom(e.target.value)}
                    />
                </Drawer>
            </div>
        )
    }
}