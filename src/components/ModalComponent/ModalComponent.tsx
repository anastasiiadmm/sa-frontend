import { Divider, Modal } from 'antd';
import React from 'react';

type Props = {
  title?: string;
  open: boolean;
  closable?: boolean;
  dividerShow?: boolean;
  children?: React.ReactNode;
  handleOk?: () => void;
  handleCancel?: () => void;
  classNameTitle?: string;
  width?: number;
  className?: string;
};

const ModalComponent: React.FC<Props> = ({
  title,
  open,
  closable,
  dividerShow = true,
  children,
  handleOk,
  handleCancel,
  classNameTitle,
  width,
  className,
}) => {
  return (
    <Modal
      className={className}
      width={width}
      closable={closable}
      title={<span className={classNameTitle}>{title}</span>}
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
