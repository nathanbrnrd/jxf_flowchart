import { h } from 'preact';
import { useState, useEffect, useContext } from 'preact/compat';
import { FlowpointComment } from '../app';

// Material-UI
import TextField from '@material-ui/core/TextField';

export function CommentArea(props) {

    const selectedComment = useContext(FlowpointComment);
    // Selected output ids controllers
    const [comment, inputComment] = useState(selectedComment);
    const onCommentInput = (e) => inputComment(e.target.value);

    // Sync state to prop on later rendering
    useEffect(() => {
        inputComment(comment);
    }, [selectedComment])

    useEffect(() => {
        props.updateComment(comment)
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