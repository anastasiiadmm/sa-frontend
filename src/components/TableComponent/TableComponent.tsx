import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { Key } from 'react';

import PaginationComponent from 'components/TableComponent/PaginationComponent/PaginationComponent';
import { companiesList, userVehicles, userVehiclesPagination } from 'types';

interface Props {
  data: userVehicles[] | companiesList[] | undefined;
  columns: ColumnsType<userVehicles> | ColumnsType<companiesList> | undefined;
  rowKey: (record: userVehicles | companiesList) => Key;
  loading: boolean;
  onChange?: () => void;
  params: userVehiclesPagination | undefined | null;
  pagePrevHandler: () => void;
  pageNextHandler: () => void;
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
      />
    </>
  );
};

export default TableComponent;
