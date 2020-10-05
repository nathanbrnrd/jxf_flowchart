import { h } from 'preact';

// Material UI
import { AddCircleOutline } from '@material-ui/icons';

export function AddFlowpointButton(props) {
    return <div style={{ position: 'fixed', bottom: 0, right: 0, padding: 3 }}>
        <div style={{ paddingBottom: 3 }}>
            <div style={{ background: 'light-blue', color: '#000000', zIndex: 6, boxShadow: 'none' }}>
                <AddCircleOutline color="primary" onClick={props.openDialog} />
            </div>
        </div>
    </div>;
}