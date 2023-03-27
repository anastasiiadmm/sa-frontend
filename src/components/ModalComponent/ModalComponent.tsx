import { Divider, Modal } from 'antd';
import React from 'react';

type Props = {
  userId: string | null;
  title?: string;
  open: boolean;
  dividerShow?: boolean;
  children?: React.ReactNode;
  handleOk: (params: any) => any;
  handleCancel: (params: any) => any;
};

const ModalComponent: React.FC<Props> = ({
  title,
  open,
  dividerShow = true,
  children,
  handleOk,
  handleCancel,
}) => {
  return (
    <Modal title={title} open={open} onOk={handleOk} onCancel={handleCancel} footer={null}>
      {dividerShow ? <Divider /> : null}
      {children}
    </Modal>
  );
};

export default ModalComponent;
