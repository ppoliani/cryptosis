import React from 'react'
import Paper from 'material-ui/Paper'
import './box.scss'

const TitledBox = ({header, children}) => (
  <div className="titled-box">
    <Paper zDepth={2}>
      <div className='titled-box__header center'>{header}</div>
      <div className='titled-box__body center'>{children}</div>
    </Paper>
  </div>
);

export default TitledBox
