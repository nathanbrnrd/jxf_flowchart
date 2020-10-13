import { h } from 'preact';
import { useState } from 'preact/compat';

import { connect } from "redux-zero/preact";
import actions from '../../redux/actions';

// Dialog content
import { NameInput } from './name-input';
import OutputsSelect from './outputs-select';
import CommentArea from './comment-area';

// Material-UI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DeleteForever } from '@material-ui/icons';

// ADD-ON: check if name already exists
function FlowpointControlDialog({ showCreateBox, selected, deleteFlowpoint, createFlowpoint, updateFlowpoint, closeDialog, updateHistory }) {
    if (!showCreateBox) { return } // abort if not open
    const creating = !selected
    const title = creating ? '' : selected.name;

    // Get outputs
    let outputs;
    const updateOutputs = (ids) => outputs = ids;
    // Get name... as state for re-rendering
    const [name, setName] = useState(title);
    // Get comment
    const [comment, updateComment] = useState(selected ? selected.comment : '');

    const manageFlowpoint = (manageAction) => {
        manageAction();
        updateHistory();
        closeDialog();
    }

    const action = creating ?
        { label: 'Create', function: () => manageFlowpoint(() => createFlowpoint(name, outputs, comment)) } :
        { label: 'Update', function: () => manageFlowpoint(() => updateFlowpoint(name, outputs, comment)) };

    return (
        <Dialog open={showCreateBox}>
            <DialogTitle id="form-dialog-title">
                <span>{title || 'New action'}</span>
                {!creating && <DeleteForever color={'error'} onClick={() => manageFlowpoint(() => deleteFlowpoint())} />}
            </DialogTitle>
            <DialogContent>
                <NameInput name={title} updateName={setName} />
                <OutputsSelect updateOutputs={updateOutputs} />
                <div>
                    <CommentArea updateComment={updateComment} />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="primary">Cancel</Button>
                <Button color="primary" disabled={!name} onClick={action.function}>{action.label}</Button>
            </DialogActions>
        </Dialog>
    );
}

const mapToProps = ({ showCreateBox, selected }) => ({ showCreateBox, selected });

export default connect(
    mapToProps,
    actions
)(FlowpointControlDialog);