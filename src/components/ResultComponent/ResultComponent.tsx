import { Result } from 'antd';
import { ResultStatusType } from 'antd/es/result';
import bem from 'easy-bem';
import React from 'react';

interface Props {
  status?: ResultStatusType;
  icon?: React.ReactNode;
  title?: string;
  subTitle?: string;
  techniqueName: string;
}

const ResultComponent: React.FC<Props> = ({ status, icon, title, subTitle, techniqueName }) => {
  const b = bem('ResultComponent');

  return (
    <Result status={status} icon={icon} title={title} subTitle={subTitle} className={b()}>
      <p>{techniqueName}</p>
    </Result>
  );
};

export default ResultComponent;
