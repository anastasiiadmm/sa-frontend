import { Drawer, DrawerProps } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import 'components/DrawerComponent/_drawerComponent.scss';

interface Props {
  onClose?: () => void;
  height?: string | number;
  placement: DrawerProps['placement'];
  open: boolean;
  children: React.ReactNode;
}

const DrawerComponent: React.FC<Props> = ({ onClose, open, placement, height, children }) => {
  const b = bem('DrawerComponent');

  return (
    <Drawer
      height={height}
      className={b('')}
      placement={placement}
      closable={false}
      onClose={onClose}
      open={open}
      data-testid='drawer-id'
    >
      {children}
    </Drawer>
  );
};

export default DrawerComponent;
