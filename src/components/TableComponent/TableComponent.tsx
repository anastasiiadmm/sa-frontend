import { Empty, Table, TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';
import { Key } from 'antd/lib/table/interface';
import React from 'react';

import notFoundImages from 'assets/images/notFound.svg';
import PaginationComponent from 'components/TableComponent/PaginationComponent/PaginationComponent';
import { pagination } from 'interfaces';

interface Props {
  data: any | undefined;
  columns: any | null;
  rowKey: (record: any) => Key;
  loading: boolean;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
    extra: TableCurrentDataSource<any>,
  ) => void;
  params?: pagination | null;
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
}) => {
  const locale = {
    emptyText: (
      <Empty
        image={<img src={notFoundImages} alt='notFoundImages' />}
        imageStyle={{
          height: 300,
        }}
        description={<h2>Данные отсутствуют</h2>}
      />
    ),
  };
  return (
    <>
      <Table
        scroll={{
          x: 950,
        }}
        loading={loading}
        rowKey={rowKey}
        locale={locale}
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
