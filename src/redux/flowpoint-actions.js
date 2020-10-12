import { cloneDeep } from 'lodash';

const OUTPUT_VALUE = {
    "output": "auto",
    "input": "auto",
    "dash": 0,
    "arrowEnd": true
};

export function create (state, name, outputs = [], comment) {
    const newId = Math.max(...state.flowpoints.map(flowpoint => flowpoint.id)) + 1;
    const newFlowpoint = {
        id: newId,
        name: name,
        comment,
        outputs: outputs.map(output => ({linkedTo: output, ...OUTPUT_VALUE})),
        pos: {
            "x": 15,
            "y": 0
        },
    }
    const flowpoints = [...state.flowpoints, ...newFlowpoint];
    return flowpoints;
}

export function update (state, name, outputs, comment) {
    const flowpoints = cloneDeep(state.flowpoints);
    const selectedId = state.selected.id;
    const selectedFlowpoint = flowpoints.find(flowpoint => flowpoint.id === selectedId);
    selectedFlowpoint.name = name;
    selectedFlowpoint.comment = comment;
    if (outputs) { // outputs undefined if not changed
        selectedFlowpoint.outputs = outputs.map(output => ({linkedTo: output, ...OUTPUT_VALUE}));
    }
    return flowpoints;
}

export function remove(state) {
    const flowpoints = cloneDeep(state.flowpoints)
    const id = state.selected.id;
    const remainingFlowPoints = flowpoints.filter(flowpoint => flowpoint.id !== id);
    remainingFlowPoints.forEach(flowpoint => {
        flowpoint.outputs = flowpoint.outputs.filter(output => output.linkedTo !== id);
    });
    return remainingFlowPoints;
}