import { h } from 'preact';
import Drawer from '@material-ui/core/Drawer';
import Note from './drawer-content/note';
import FlowControls from './drawer-content/flow-controls';
import { connect } from "redux-zero/preact";
import actions from '../../redux/actions';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  paper: {
    overflowY: 'visible',
    visibility: 'visible!important',
    bottom: '56px',
    borderTop: 'none'
  },
}));

function JXFDrawer({ drawerView }) {

  const classes = useStyles();

  return (
    <Drawer
      classes={{ paper: classes.paper }}
      variant="persistent"
      anchor="bottom"
      open={Boolean(drawerView)}
    >
      {drawerView === 'note' && <Note />}

      {drawerView === 'flow' && <FlowControls />}
    </Drawer>
  );
}

const mapToProps = ({ drawerView }) => ({ drawerView });

export default connect(
  mapToProps,
  actions
)(JXFDrawer);