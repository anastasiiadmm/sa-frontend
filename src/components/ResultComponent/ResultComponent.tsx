import { Result } from 'antd';
import { ResultStatusType } from 'antd/es/result';
import React from 'react';

interface Props {
  status?: ResultStatusType;
  icon?: React.ReactNode;
  title?: string;
  subTitle?: string;
  techniqueName?: string;
}

const ResultComponent: React.FC<Props> = ({ status, icon, title, subTitle, techniqueName }) => {
  return (
    <Result status={status} icon={icon} title={title} subTitle={subTitle}>
      <p>{techniqueName}</p>
    </Result>
  );
};

export default ResultComponent;
