import React from 'react'
import Paper from 'material-ui/Paper'
import 'box.scss'

const TitledBox = ({header, children}) => (
  <Paper className='titled-box'>
    <div className='titled-box__header'>{header}</div>
    <div className='titled-box__body'>{children}</div>
  </Paper>
);

export default TitledBox
