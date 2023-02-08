import { Divider, Modal } from 'antd';
import React from 'react';

type Props = {
  title?: string;
  open: boolean;
  children?: React.ReactNode;
  handleOk: (params: any) => any;
  handleCancel: (params: any) => any;
};

const ModalComponent: React.FC<Props> = ({ title, open, children, handleOk, handleCancel }) => {
  return (
    <Modal title={title} open={open} onOk={handleOk} onCancel={handleCancel} footer={null}>
      <Divider />
      {children}
    </Modal>
  );
};

export default ModalComponent;
