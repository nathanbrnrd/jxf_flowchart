import { h } from 'preact';
import { useState, useEffect } from 'preact/compat';

import { connect } from "redux-zero/preact";
import actions from '../../redux/actions';

// Material-UI
import TextField from '@material-ui/core/TextField';

function CommentArea({ updateComment, selected }) {
    const selectedComment = selected ? selected.comment : undefined;
    // Selected output ids controllers
    const [comment, inputComment] = useState(selectedComment);
    const onCommentInput = (e) => inputComment(e.target.value);

    // Sync state to prop on later rendering
    useEffect(() => {
        inputComment(comment);
    }, [selectedComment])

    useEffect(() => {
        updateComment(comment)
    }, [comment])

    return (
        <TextField
            id="outlined-textarea"
            placeholder="Comment"
            multiline
            fullWidth
            value={comment}
            variant="outlined"
            rows={3}
            rowsMax={6}
            onInput={() => onCommentInput(event)}
        />
    )
}

const mapToProps = ({ selected }) => ({ selected });

export default connect(
    mapToProps,
    actions
)(CommentArea);