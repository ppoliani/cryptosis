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
      onCellClick={this.handleCellClick}
      onCellDoubleClick={this.handleCellDoubleClick}
      onFilterValueChange={this.handleFilterValueChange}
      onSortOrderChange={this.handleSortOrderChange}
      page={props.page}
      count={props.limit}
    />
)
