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
      initialSort={{column: 'date', order: 'desc'}}
      onCellClick={props.handleCellClick}
      onRowSizeChange={props.onRowSizeChange}
      page={props.page}
      rowSize={props.limit}
      count={props.count}
    />
)

// Aditional props
// {onCellDoubleClick={this.handleCellDoubleClick}}
// {onFilterValueChange={this.handleFilterValueChange}}
// {onSortOrderChange={this.handleSortOrderChange}}
