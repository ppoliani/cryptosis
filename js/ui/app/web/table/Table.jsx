import React from 'react';
import DataTables from 'material-ui-datatables';

export default props => (
   <DataTables
      height={'auto'}
      selectable={false}
      showRowHover={true}
      columns={props.columns}
      data={props.data}
      showCheckboxes={false}
      onCellClick={props.handleCellClick}
      onRowSizeChange={props.onRowSizeChange}
      onNextPageClick={props.onNextPageClick}
      onPreviousPageClick={props.onPreviousPageClick}
      page={props.page}
      rowSize={props.limit}
      count={props.count}
    />
)
