import { h } from 'preact';
// Material UI
import { MoreHoriz } from '@material-ui/icons';

export function FlowpointContent (props) {
    return <div style={{ display: 'table', width: '100%', height: '100%', position: 'relative' }}>
        <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', paddingLeft: 2, paddingRight: 2 }}>
            { props.name || 'No name should not happen' }
        </div>
        { !props.isLocked && <MoreHoriz onClick={props.openDialog} style={{ position: 'absolute', top: 0, right: 0 }} /> }
    </div>;
}
