import { h } from 'preact';
import TextField from '@material-ui/core/TextField';

import { connect } from "redux-zero/preact";
import actions from '../../../redux/actions';

function Note({ isLocked, selectedBottom, globalComment }) {
    const updateBottom = (value) => {
        if (this.state.selectedBottom) {
            const id = this.state.selectedBottom.id;
            const selectedBottom = { ...this.state.selectedBottom, comment: value };
            const flowpointIndex = this.state.flowpoints.findIndex(flowpoint => flowpoint.id === id);
            const flowpoints = this.state.flowpoints;
            flowpoints[flowpointIndex] = selectedBottom;
            this.setState({ selectedBottom, flowpoints });
        } else {
            this.setState({ globalComment: value });
        }
    }

    return (
        <TextField
            id="outlined-textarea"
            placeholder="Note"
            multiline
            fullWidth
            disabled={isLocked}
            value={selectedBottom ? selectedBottom.comment || '' : globalComment}
            variant="outlined"
            rows={3}
            onChange={(e) => updateBottom(e.target.value)}
        />
    );
}

const mapToProps = ({ isLocked, selectedBottom, globalComment }) => ({ isLocked, selectedBottom, globalComment });

export default connect(
    mapToProps,
    actions
)(Note);