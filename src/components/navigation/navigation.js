import { h } from 'preact';
import { makeStyles } from '@material-ui/core/styles';

import { connect } from "redux-zero/preact";
import actions from '../../redux/actions';

import { Settings, Save, LockOutlined, Comment, Build, PlayCircleFilled } from '@material-ui/icons';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BottomNavigation from '@material-ui/core/BottomNavigation';

const BOTTOM_NAVS = [
    { value: 'settings', label: 'Page', icon: <Settings />},
    { value: 'flow', label: 'Flow', icon: <Build />},
    { value: 'note', label: 'Notes', icon: <Comment />},
    { value: 'video', label: 'Videos', icon: <PlayCircleFilled />},
    { value: 'save', label: 'Save', showLabel: true, icon: <Save />},
    { value: 'lock', label: 'Lock', showLabel: true, icon: <LockOutlined />} // TODO: retrieve state to build this one
];

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '45px'
    }
  }));

function Navigation({drawerView, navigate}) {
    const classes = useStyles();

    const bottomActionChanged = (view, value) => {
        const noActionValue = ['lock', 'save', view];
        const drawerView = !noActionValue.includes(value) ? value : undefined;
        navigate(drawerView);
    }

    return (
        <BottomNavigation value={drawerView} onChange={(e, value) => bottomActionChanged(drawerView, value)}>
            {BOTTOM_NAVS.map(nav => (
                <BottomNavigationAction classes={{ root: classes.root }} disabled={nav.disabled} showLabel={nav.showLabel} value={nav.value} label={nav.label} icon={nav.icon} />
            ))}
        </BottomNavigation>
    );
}

const mapToProps = ({ drawerView }) => ({ drawerView });

export default connect(
    mapToProps,
    actions
)(Navigation);