import { Divider, Modal } from 'antd';
import React from 'react';

type Props = {
  title?: string;
  open: boolean;
  closable?: boolean;
  dividerShow?: boolean;
  children?: React.ReactNode;
  handleOk?: (params: any) => any;
  handleCancel?: (params: any) => any;
};

const ModalComponent: React.FC<Props> = ({
  title,
  open,
  closable,
  dividerShow = true,
  children,
  handleOk,
  handleCancel,
}) => {
  return (
    <Modal
      closable={closable}
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      {dividerShow ? <Divider /> : null}
      {children}
    </Modal>
  );
};

export default ModalComponent;
