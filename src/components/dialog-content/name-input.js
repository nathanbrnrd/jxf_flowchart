import { h } from 'preact';
import { useState, useEffect } from 'preact/compat';
// Material-UI
import TextField from '@material-ui/core/TextField';

export function NameInput(props) {

    // Name controllers
    const [name, setName] = useState(props.name);
    const onNameInput = (e) => setName(e.target.value);

    // Sync state to prop on later rendering
    useEffect(() => {
        setName(props.name);
    }, [props.name])

    useEffect(() => {
        props.updateName(name)
    }, [name])

    return (
        <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onInput={() => onNameInput(event)}
        />
    );
}