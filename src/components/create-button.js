import { h } from 'preact';

// Material UI
import { Add } from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';

export function AddFlowpointButton(props) {
    return (
        <div style={{ paddingBottom: 3 }}>
            <div style={{ background: 'light-blue', color: '#000000', zIndex: 6, boxShadow: 'none' }}>
            <Fab color="primary" aria-label="add" onClick={props.openDialog} size="small">
                <Add />
            </Fab>
            </div>
        </div>
    );
}