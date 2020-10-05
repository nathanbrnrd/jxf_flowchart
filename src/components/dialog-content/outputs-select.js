import { h } from 'preact';
import { useContext, useState, useEffect } from 'preact/compat';

// Component
import { FlowpointOptions } from '../app';

// lodash
import { orderBy } from 'lodash';

// Material-UI
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

export function OutputsSelect(props) {

    const outputs = useContext(FlowpointOptions);
    // Selected output ids controllers
    const [selectedOutputIds, selectOutputIds] = useState(outputs.selected);
    const onOutputIdsChange = (e) => selectOutputIds(e.target.value.map(value => value.id));

    const options = orderBy(outputs.available, ['name']);
    const isOptionChecked = (optionId) => selectedOutputIds.includes(optionId);
    const getSelectedOptions = () => options.filter(option => selectedOutputIds.includes(option.id));

    // Sync state to prop on later rendering
    useEffect(() => {
        selectOutputIds(selectedOutputIds);
    }, [outputs.selected])

    useEffect(() => {
        props.updateOutputs(selectedOutputIds)
    }, [selectedOutputIds])

    return (
        <FormControl>
            <InputLabel id="demo-mutiple-checkbox-label">Link to</InputLabel>
            <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                multiple
                input={<Input fullWidth />}
                value={getSelectedOptions()}
                onChange={() => onOutputIdsChange(event)}
                renderValue={(selected) => selected.map(sel => sel.name).join(', ')}
            >
                {options.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        <Checkbox checked={isOptionChecked(option.id)} />
                        <ListItemText primary={option.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}