import { h } from 'preact';
import './note.scss'

// Material-UI
import TextField from '@material-ui/core/TextField';

import { connect } from "redux-zero/preact";
import actions from '../../../redux/actions';

function Note({ isLocked, selected, pageOptions, updateFlowpoint, selectFlowpoint, updatePageOptions }) {
    const pageNote = pageOptions.notes;
    const updateNote = (value) => {
        if (selected) {
            const updatedSelected = { ...selected, comment: value };
            const {name, outputs, comment} = { ...updatedSelected };
            updateFlowpoint(name, outputs, comment);
            selectFlowpoint(updatedSelected);
        } else {
            updatePageOptions(pageOptions.name, value)
        }
    }

    return (
        <TextField
            className="drawerNote"
            placeholder="Note"
            multiline
            disabled={isLocked}
            value={selected ? selected.comment || '' : pageNote}
            rows={3}
            onChange={(e) => updateNote(e.target.value)}
        />
    );
}

const mapToProps = ({ isLocked, selected, pageOptions }) => ({ isLocked, selected, pageOptions });

export default connect(
    mapToProps,
    actions
)(Note);