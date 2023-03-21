import { Table } from 'antd';
import React, { Key } from 'react';

import PaginationComponent from 'components/TableComponent/PaginationComponent/PaginationComponent';
import { companiesList, userVehicleInfo, userVehicles, userVehiclesPagination } from 'types';

interface Props {
  data: any | undefined;
  columns: any | null;
  rowKey: (record: userVehicles | companiesList | userVehicleInfo) => Key;
  loading: boolean;
  onChange?: () => void;
  params?: userVehiclesPagination | undefined | null;
  pagePrevHandler?: () => void;
  pageNextHandler?: () => void;
  disabledButton?: boolean;
}

const TableComponent: React.FC<Props> = ({
  loading,
  columns,
  data,
  onChange,
  rowKey,
  params,
  pagePrevHandler,
  pageNextHandler,
  disabledButton,
}) => {
  return (
    <>
      <Table
        scroll={{
          x: 950,
        }}
        loading={loading}
        rowKey={rowKey}
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={false}
      />
      <PaginationComponent
        params={params}
        pagePrevHandler={pagePrevHandler}
        pageNextHandler={pageNextHandler}
        disabledButton={disabledButton}
      />
    </>
  );
};

export default TableComponent;
