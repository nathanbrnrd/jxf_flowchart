import { h, Component, createRef, useState } from 'preact';
import dialog from './style.scss';

// Flowspace
import Flowspace from '../api/Flowspace.js';
import Flowpoint from '../api/Flowpoint.js';

// Material UI
import { AddCircleOutline, MoreHoriz } from '@material-ui/icons';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {

            showCreateBox: false,
            selected_point: null,

            flowpoints: {
                "0": {
                    "msg": "point b",
                    "pos": {
                        "x": 300,
                        "y": 150
                    },
                    "outputs": {
                        "1": {
                            "output": "auto",
                            "input": "auto",
                            "dash": 0
                        }
                    }
                },
                "1": {
                    "msg": "point a",
                    "pos": {
                        "x": 300,
                        "y": 250
                    },
                    "outputs": {
                        "2": {
                            "output": "auto",
                            "input": "auto",
                            "dash": 0
                        }
                    }
                },
                "2": {
                    "msg": "point c",
                    "pos": {
                        "x": 480,
                        "y": 140
                    },
                    "outputs": {}
                }
            }
        }
    }

    handleClick() {
        console.log('handle_key');
    }

    handleTouch() {
        console.log('handle_touch');
    }

    createNewItem(name) {
        var newpoint = {
            "3": {
                "msg": name,
                "pos": {
                    "x": 100,
                    "y": 100
                },
                "outputs": {
                    "2": {
                        "output": "auto",
                        "input": "auto",
                        "dash": 0
                    }
                }
            }
        }
        var flowpoints = { ...this.state.flowpoints, ...newpoint }
        this.setState({ flowpoints, showCreateBox: false }, () => console.log(this.state.flowpoints));
    }

    render() {
        return (
            <div>
                <Flowspace
                    theme="blue"
                    variant="outlined"
                    background="black"
                    avoidCollisions
                    connectionSize={4}>
                    {
                        Object.keys(this.state.flowpoints).map(key => {
                            var point = this.state.flowpoints[key]

                            return (

                                <Flowpoint
                                    key={key}
                                    snap={{ x: 10, y: 10 }}
                                    style={{ height: Math.max(50, Math.ceil(point.msg.length / 20) * 30) }}
                                    startPosition={point.pos}
                                    outputs={point.outputs}
                                    onClick={e => { this.handleClick(key, e) }}
                                    onTouch={e => { this.handleTouch(key) }}
                                    onDrag={pos => {
                                        var points = this.state.points;
                                        this.state.flowpoints[key].pos = pos;
                                        this.setState({ points, lastPos: pos })
                                    }}>
                                    <div style={{ display: 'table', width: '100%', height: '100%', position: 'relative' }}>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', paddingLeft: 2, paddingRight: 2 }}>
                                            {
                                                point.msg !== '' ? point.msg : 'Empty'
                                            }
                                        </div>
                                        <MoreHoriz onClick={() => this.setState({ showCreateBox: true })} style={{ position: 'absolute', top: 0, right: 0 }} />
                                    </div>
                                </Flowpoint>

                            )

                        })
                    }
                </Flowspace>

                <Dialog open={this.state.showCreateBox}>
                    <DialogTitle id="form-dialog-title">New item</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="name"
                            type="text"
                            fullWidth
                        />
                        <FormControl>
                            <InputLabel id="demo-mutiple-checkbox-label">Link to</InputLabel>
                            <Select
                                labelId="demo-mutiple-checkbox-label"
                                id="demo-mutiple-checkbox"
                                multiple
                                value={[this.state.personName]}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {Object.keys(this.state.flowpoints).map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={(this.state.personName || []).indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ 'showCreateBox': false })} color="primary">
                            Cancel
                            </Button>
                        <Button color="primary" onClick={() => this.createNewItem()}>
                            Subscribe
                              </Button>
                    </DialogActions>
                </Dialog>


                <div style={{ position: 'fixed', bottom: 0, right: 0, padding: 3 }}>
                    <div style={{ paddingBottom: 3 }}>
                        <div
                            style={{ background: 'light-blue', color: '#000000', zIndex: 6, boxShadow: 'none' }}
                            onClick={() => this.setState({ 'showCreateBox': true })}>
                            <AddCircleOutline color="primary" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}