import { h } from 'preact';

import { connect } from "redux-zero/preact";
import actions from '../../../redux/actions';

import Fab from '@material-ui/core/Fab';
import { Redo, Undo, Clear } from '@material-ui/icons';
import { AddFlowpointButton } from '../../create-button';

function FlowControls({ historyPosition, history, moveHistory, openDialog }) {
    return (
        <div class="flow_actions">
            <Fab color="primary" aria-label="add" size="small" onClick={this.clearChanges}>
                <Clear />
            </Fab>
            <div>
                <Fab color="primary" aria-label="add" size="small" onClick={() => moveHistory('decrement')} disabled={historyPosition === 0}
                    style={{
                        background: historyPosition === 0 ? 'rgba(63,81,181,0.5)' : 'rgb(63,81,181)',
                        color: historyPosition === 0 ? 'rgba(255,255,255,0.5)' : 'white'
                    }}>
                    <Undo />
                </Fab>
                <Fab color="primary" aria-label="add" size="small"
                    onClick={() => moveHistory('increment')} disabled={historyPosition === history.length - 1}
                    style={{
                        background: historyPosition === history.length - 1 ? 'rgba(63,81,181,0.5)' : 'rgb(63,81,181)',
                        color: historyPosition === history.length - 1 ? 'rgba(255,255,255,0.5)' : 'white'
                    }}>
                    <Redo />
                </Fab>
            </div>
            <AddFlowpointButton openDialog={() => openDialog()} />
        </div>
    );
}

const mapToProps = ({ historyPosition, history }) => ({ historyPosition, history });

export default connect(
    mapToProps,
    actions
)(FlowControls);

