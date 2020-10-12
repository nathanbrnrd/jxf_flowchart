import { h } from 'preact';
import { useState, useEffect } from 'preact/compat';

import { connect } from "redux-zero/preact";
import actions from '../../redux/actions';


// lodash
import { orderBy } from 'lodash';

// Material-UI
import Chip from '@material-ui/core/Chip';

// Context from FlowpointOptions
function getOutputs(flowpoints, selected) {
    const availableFlowpoints = selected ?
        flowpoints.filter(flowpoint => flowpoint.id !== selected.id) :
        flowpoints;
    return {
        available: availableFlowpoints.map(flowpoint => ({ id: flowpoint.id, name: flowpoint.name })),
        selected: selected ? selected.outputs.map(output => output.linkedTo) : []
    }
}


function OutputsSelect({ updateOutputs, selected, flowpoints }) {

    const outputs = getOutputs(flowpoints, selected);
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
        updateOutputs(selectedOutputIds)
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

const mapToProps = ({ selected, flowpoints }) => ({ selected, flowpoints });

export default connect(
    mapToProps,
    actions
)(OutputsSelect);