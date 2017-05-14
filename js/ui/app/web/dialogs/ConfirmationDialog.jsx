import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class ConfirmationDialog extends Component {
  render() {
    const {onSubmit, handleClose, open, message} = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={onSubmit}
      />,
    ];

    return (
      <div>
        <Dialog
          title="Dialog With Actions"
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={this.handleClose}
        >
          {message}
        </Dialog>
      </div>
    );
  }
}
