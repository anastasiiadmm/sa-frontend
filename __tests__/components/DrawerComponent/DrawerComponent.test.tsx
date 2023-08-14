import React from 'react';
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import '../../../__mocks__/matchMedia.mock';
import DrawerComponent from "../../../src/components/DrawerComponent/DrawerComponent";

describe('DrawerComponent', () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
  });

  it('should render the DrawerComponent correctly when open is true', () => {
    render(
      <DrawerComponent onClose={onCloseMock} open={true} placement='right'>
        <div>Content</div>
      </DrawerComponent>
    );

    const drawerContent = screen.getByRole('dialog', { class: 'ant-drawer-content' });
    expect(drawerContent).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should not render the DrawerComponent when open is false', () => {
    render(
      <DrawerComponent onClose={onCloseMock} open={false} placement='right'>
        <div>Content</div>
      </DrawerComponent>
    );

    const drawerContent = screen.queryByRole('dialog', { name: /drawer/i });
    expect(drawerContent).not.toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

});
