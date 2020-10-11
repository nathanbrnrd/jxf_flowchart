import { h, Component, createContext, componentDidMount } from 'preact';
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
import { Redo, Undo, Clear, Settings, Save, LockOutlined, LockOpenOutlined, Comment, Build, PlayCircleFilled } from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Drawer from '@material-ui/core/Drawer';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BottomNavigation from '@material-ui/core/BottomNavigation';

import { makeStyles } from '@material-ui/core/styles';

import { MapInteractionCSS } from 'react-map-interaction';

export const FlowpointOptions = createContext();
export const FlowpointComment = createContext();

const BOTTOM_NAVS = [
    { value: 'settings', label: 'Page', icon: <Settings />},
    { value: 'flow', label: 'Flow', icon: <Build />},
    { value: 'note', label: 'Notes', icon: <Comment />},
    { value: 'video', label: 'Videos', icon: <PlayCircleFilled />},
    { value: 'save', label: 'Save', showLabel: true, icon: <Save />},
    { value: 'lock', label: 'Lock', showLabel: true, icon: <LockOutlined />} // TODO: retrieve state to build this one
];

const useStyles = makeStyles((theme) => ({
  paper: {
    overflowY: 'visible',
    visibility: 'visible!important',
    bottom: '56px'
  },
  root: {
      minWidth: '45px'
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

    classes = useStyles();

    handleClick = (id) => this.setState({selectedBottom: this.state.flowpoints.find(flowpoint => flowpoint.id === id)})
    handleTouch() {
        // TODO: same as handleClick
        console.log('handle_touch');
    }

    bottomActionChanged(value) {
        const noActionValue = ['lock', 'save', this.state.drawerView];
        const drawerView = !noActionValue.includes(value) ? value : undefined;
        this.setState({drawerView});
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

    render(_ , {showCreateBox, flowpoints, selected, globalComment, history, historyPosition, selectedBottom, isLocked, drawerView}) {
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
                <MapInteractionCSS defaultScale={2}
                onClick={() => this.handleClick(undefined)}
          defaultTranslation={{ x: 100, y: 100 }}
          minScale={0.5}
          maxScale={2}>
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
                                    <Flowpoint
                                        key={flowpoint.id}
                                        snap={{ x: 10, y: 10 }}
                                        style={{ height: Math.max(50, Math.ceil(flowpoint.name.length / 20) * 30), background: 'rgba(0,0,0,0.8)' }}
                                        startPosition={flowpoint.pos}
                                        outputs={flowpoint.outputs}
                                        isLocked={isLocked}
                                        selected={selectedBottom && selectedBottom.id === flowpoint.id}
                                        onClick={ (id) => this.handleClick(id)}
                                        onTouch={(id) => this.handleClick(id)}
                                        onDragEnd={() => console.log('should save in history')}
                                        onDrag={pos => {
                                            // TODO: not necessary
                                            var points = this.state.points;
                                            flowpoint.pos = pos;
                                            this.setState({ points, lastPos: pos })
                                        }}>
                                        <FlowpointContent openDialog={() => this.openDialog(flowpoint)} name={flowpoint.name} isLocked={isLocked}/>
                                    </Flowpoint>

                                )

                            })
                        }
                    </Flowspace>

                
                    </MapInteractionCSS>
                </div>

 
                <Drawer
                    classes={{paper: this.classes.paper}}
                    variant="persistent"
                    anchor="bottom"
                    open={Boolean(drawerView)}
                >
                    {drawerView === 'note' && <div>
                        <TextField
                            id="outlined-textarea"
                            placeholder="Note"
                            multiline
                            fullWidth
                            disabled={isLocked}
                            value={selectedBottom ? selectedBottom.comment || '' : globalComment}
                            variant="outlined"
                            rows={3}
                            onChange={(e) => this.updateBottom(e.target.value)}
                        />
                    </div>}

                    {drawerView === 'flow' && <div class="flow_actions">
                        {/* TODO: manage style through theming and CSS in JS */}
                        <Fab color="primary" aria-label="add" size="small" onClick={this.clearChanges}>
                            <Clear />
                        </Fab>
                        <div>
                            <Fab color="primary" aria-label="add" size="small" onClick={this.undoChanges} disabled={historyPosition === 0}
                                style={{
                                    background: historyPosition === 0 ? 'rgba(63,81,181,0.5)' : 'rgb(63,81,181)',
                                    color: historyPosition === 0 ? 'rgba(255,255,255,0.5)' : 'white'
                                }}>
                                <Undo />
                            </Fab>
                            <Fab color="primary" aria-label="add" size="small"
                                onClick={this.redoChanges} disabled={historyPosition === history.length - 1}
                                style={{
                                    background: historyPosition === history.length - 1 ? 'rgba(63,81,181,0.5)' : 'rgb(63,81,181)',
                                    color: historyPosition === history.length - 1 ? 'rgba(255,255,255,0.5)' : 'white'
                                }}>
                                <Redo />
                            </Fab>
                        </div>
                        <AddFlowpointButton openDialog={() => this.openDialog()} />
                    </div>}
                </Drawer>

                <BottomNavigation value={drawerView} onChange={(e, value) => this.bottomActionChanged(value)}> 
                {BOTTOM_NAVS.map(nav => (
                    <BottomNavigationAction classes={{root: this.classes.root}} disabled={nav.disabled} showLabel={nav.showLabel} value={nav.value} label={nav.label} icon={nav.icon} />
                ))}
                </BottomNavigation>
            </div>
        )
    }
}