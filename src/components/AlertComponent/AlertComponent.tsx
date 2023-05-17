import { Alert } from 'antd';
import React from 'react';

type Props = {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error' | undefined;
  showIcon: boolean;
};

const AlertComponent: React.FC<Props> = ({ message, type, showIcon }) => {
  return <Alert message={message} type={type} showIcon={showIcon} />;
};

export default AlertComponent;
