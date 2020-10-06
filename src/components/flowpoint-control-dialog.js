import { h } from 'preact';
import { useState } from 'preact/compat';

// Dialog content
import { NameInput } from './dialog-content/name-input';
import { OutputsSelect } from './dialog-content/outputs-select';
import { CommentArea } from './dialog-content/comment-area';

// Material-UI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DeleteForever } from '@material-ui/icons';

// ADD-ON: check if name already exists
export function FlowpointControlDialog(props) {
    if (!props.isOpen) { return } // abort if not open
    const creating = !props.selected
    const title = creating ? '' : props.selected.name;

    // Get outputs
    let outputs;
    const updateOutputs = (ids) => outputs = ids;
    // Get comment
    let comment;
    const updateComment = (commentText) => comment = commentText;
    // Get name... as state for re-rendering
    const [name, setName] = useState(props.name);

    const action = creating ?
    { label: 'Create', function: () => props.createFlowPoint(name, outputs, comment) } :
    { label: 'Update', function: () => props.updateFlowPoint(name, outputs, comment) };

    return (
        <Dialog open={props.isOpen}>
            <DialogTitle id="form-dialog-title">
                <span>{title || 'New action'}</span>
                {!creating && <DeleteForever color={'error'} onClick={props.deleteFlowpoint}/>}
            </DialogTitle>
            <DialogContent>
                <NameInput name={title} updateName={setName} />
                <OutputsSelect updateOutputs={updateOutputs} />
                <div>
                    <CommentArea updateComment={updateComment}/>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.closeDialog} color="primary">Cancel</Button>
    <Button color="primary" disabled={!name} onClick={action.function}>{action.label}</Button>
            </DialogActions>
        </Dialog>
    );
}