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
import Chip from '@material-ui/core/Chip';

export function OutputsSelect(props) {

    const outputs = useContext(FlowpointOptions);
    // Selected output ids controllers
    const [selectedOutputIds, selectOutputIds] = useState(outputs.selected);
    const onOutputIdsChange = (id, alreadySelected) => {
        const newSelectedIds = alreadySelected ?
            selectedOutputIds.filter(selId => selId !== id) :
            [...selectedOutputIds, id]
        selectOutputIds(newSelectedIds);
    }
    const options = orderBy(outputs.available, ['name']);
    const isOptionChecked = (optionId) => selectedOutputIds.includes(optionId);
    // Sync state to prop on later rendering
    useEffect(() => {
        selectOutputIds(selectedOutputIds);
    }, [outputs.selected])

    useEffect(() => {
        props.updateOutputs(selectedOutputIds)
    }, [selectedOutputIds])

    return (
        <div>
            <p>Link to</p>
            {options.map(option => {
                const isSelected = isOptionChecked(option.id);
                return (
                <Chip label={option.name}
                    key={option.id}
                    size="small"
                    color={isSelected ? 'primary' : 'default'}
                    onClick={() => onOutputIdsChange(option.id, isSelected)} />
            );
                })}
        </div>
    )
}