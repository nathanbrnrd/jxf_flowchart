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
                <Fab color="primary" aria-label="add" size="small" onClick={() => moveHistory('decrement')} disabled={historyPosition === 0}>
                    <Undo />
                </Fab>
                <Fab color="primary" aria-label="add" size="small" onClick={() => moveHistory('increment')} disabled={historyPosition === history.length - 1}>
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

