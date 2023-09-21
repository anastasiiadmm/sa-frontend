import { Drawer, DrawerProps } from 'antd';
import bem from 'easy-bem';
import React, { CSSProperties } from 'react';

import 'components/DrawerComponent/_drawerComponent.scss';

interface Props {
  closable?: boolean;
  onClose?: () => void;
  title?: string;
  height?: string | number;
  width?: string | number;
  bodyStyle?: CSSProperties;
  placement: DrawerProps['placement'];
  open: boolean;
  children: React.ReactNode;
  className?: string;
  closeIcon?: React.ReactNode;
}

const DrawerComponent: React.FC<Props> = ({
  closable = false,
  onClose,
  open,
  placement,
  height,
  children,
  width,
  bodyStyle,
  title,
  className,
  closeIcon,
}) => {
  const b = bem('DrawerComponent');

  return (
    <Drawer
      title={title}
      bodyStyle={bodyStyle}
      width={width}
      height={height}
      closeIcon={closeIcon}
      className={b(`${placement === 'bottom' ? `border-placement ${className}` : ''}`)}
      placement={placement}
      closable={closable}
      onClose={onClose}
      open={open}
      data-testid='drawer-id'
    >
      {children}
    </Drawer>
  );
};

export default DrawerComponent;
