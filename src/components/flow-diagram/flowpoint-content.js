import { h } from 'preact';

import { connect } from "redux-zero/preact";
import actions from '../../redux/actions';

// Material UI
import { MoreHoriz } from '@material-ui/icons';

function FlowpointContent ({ flowpoint, isLocked, openDialog }) {
    return <div style={{ display: 'table', width: '100%', height: '100%', position: 'relative' }}>
        <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', paddingLeft: 2, paddingRight: 2 }}>
            { flowpoint.name || 'No name should not happen' }
        </div>
        { !isLocked && <MoreHoriz onClick={() => openDialog(flowpoint)} style={{ position: 'absolute', top: 0, right: 0 }} /> }
    </div>;
}

const mapToProps = ({ isLocked }) => ({ isLocked });

export default connect(
    mapToProps,
    actions
  )(FlowpointContent);