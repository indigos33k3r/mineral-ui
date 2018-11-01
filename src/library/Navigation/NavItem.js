/* @flow */
import React from 'react';
import Truncate from '../Truncate';
import { INTERNAL_TYPE } from './constants';
import { NavItemRoot } from './styled';

import type { NavItemDefaultProps, NavItemProps } from './types';

const NavItem = (props: NavItemProps) => {
  const {
    children,
    disabled,
    icon,
    index,
    minimal: ignoreMinimal,
    selected,
    type,
    ...restProps
  } = props;

  const rootProps = {
    'aria-disabled': disabled,
    'aria-current': selected ? 'page' : undefined,
    circular: type === INTERNAL_TYPE.pills,
    'data-index': index,
    disabled,
    iconStart: icon,
    selected,
    size:
      type === INTERNAL_TYPE.pills
        ? 'small'
        : type === INTERNAL_TYPE.tabs
          ? 'medium'
          : 'large',
    type,
    ...restProps
  };

  return (
    <NavItemRoot {...rootProps}>
      <Truncate>{children}</Truncate>
    </NavItemRoot>
  );
};

const defaultProps: NavItemDefaultProps = {
  element: 'a'
};

NavItem.defaultProps = defaultProps;

export default NavItem;
