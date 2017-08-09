import React from 'react'
import mixin from './index'
import ConfirmationDialog from '../dialogs/ConfirmationDialog'

export default mixin({
  state: {
    isDialogOpen: false
  },

  onSubmit() {
    this.closeDialog();
    this.state.onSubmit && this.state.onSubmit();
  },

  closeDialog() {
    this.setState(Object.assign({}, this.state, {isDialogOpen: false}));
  },

  openDialog(onSubmit) {
    this.setState(Object.assign({}, this.state, {isDialogOpen: true, onSubmit}));
  },

  renderDialogBox(message) {
    const isOpen = this.state.isDialogOpen === undefined ? false : this.state.isDialogOpen;

    return <ConfirmationDialog
      open={isOpen}
      handleClose={() => this.closeDialog()}
      message={message}
      onSubmit={() => this.onSubmit()} />
  }
})
