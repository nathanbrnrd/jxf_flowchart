import { h } from 'preact';
import { makeStyles } from '@material-ui/core/styles';

import { connect } from "redux-zero/preact";
import actions from '../../redux/actions';

import { Settings, Save, LockOutlined, Comment, Build, PlayCircleFilled, LockOpenOutlined } from '@material-ui/icons';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BottomNavigation from '@material-ui/core/BottomNavigation';

const useStyles = makeStyles(() => ({
    root: {
        minWidth: '45px'
    }
}));

function Navigation({ drawerView, isLocked, navigate, switchLock }) {
    const classes = useStyles();

    const BOTTOM_NAVS = [
        { value: 'settings', label: 'Page', icon: <Settings /> },
        { value: 'flow', label: 'Flow', icon: <Build />, disabled: isLocked },
        { value: 'note', label: 'Notes', icon: <Comment /> },
        { value: 'video', label: 'Videos', icon: <PlayCircleFilled /> },
        { value: 'save', label: 'Save', showLabel: true, icon: <Save /> },
        { value: 'lock', label: isLocked ? 'Locked' : 'Unlocked', showLabel: true, icon: isLocked ? <LockOutlined/> :  <LockOpenOutlined />, clickEvent: switchLock}
    ];

    const bottomActionChanged = (view, value) => {
        const noActionValue = ['lock', 'save', 'settings', view];
        const drawerView = !noActionValue.includes(value) ? value : undefined;
        navigate(drawerView);
    }

    return (
        <BottomNavigation value={drawerView} onChange={(_, value) => bottomActionChanged(drawerView, value)}>
            {BOTTOM_NAVS.map(nav => (
                <BottomNavigationAction onClick={nav.clickEvent} classes={{ root: classes.root }} disabled={nav.disabled} showLabel={nav.showLabel} value={nav.value} label={nav.label} icon={nav.icon} />
            ))}
        </BottomNavigation>
    );
}

const mapToProps = ({ drawerView, isLocked }) => ({ drawerView, isLocked });

export default connect(
    mapToProps,
    actions
)(Navigation);