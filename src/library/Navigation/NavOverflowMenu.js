/* @flow */
import React from 'react';
import composeEventHandlers from '../utils/composeEventHandlers';
import Dropdown from '../Dropdown';
import IconArrowDropdownDown from '../Icon/IconArrowDropdownDown';
import { MenuItem } from '../Menu';
import NavItem from './NavItem';

import type {
  GetDropdownData,
  GetDropdownItem,
  MenuItemRenderProps,
  NavigationItem,
  NavOverflowMenuProps
} from './types';

const getDropdownData: GetDropdownData = ({ data, disabled, onClick, index }) =>
  // $FlowFixMe: Flow does not recognize that it is mapping over NavigationItems
  data.map(({ icon, onClick: itemOnClick, ...item }) => ({
    ...item,
    'data-index': index,
    iconStart: icon,
    onClick: composeEventHandlers(
      itemOnClick,
      !disabled
        ? onClick
        : (selectedIndex, event) => {
            event.preventDefault();
          }
    )
  }));

const getDropdownItem: GetDropdownItem = (itemElement) => (
  props: ?MenuItemRenderProps
) => {
  const common = {
    element: itemElement,
    role: null,
    tabIndex: -1
  };
  const itemProps = props ? { ...props.props, ...common } : common;
  return <MenuItem {...itemProps} />;
};

const NavOverflowMenu = (props: NavOverflowMenuProps) => {
  const {
    data,
    disabled,
    index,
    itemElement,
    onClick,
    prefix,
    messages,
    type
  } = props;

  const rootProps = {
    data: getDropdownData({
      data,
      disabled,
      onClick,
      index
    }),
    item: getDropdownItem(itemElement)
  };
  const triggerProps = {
    'aria-label': messages.moreLabel,
    children: messages.moreText,
    element: 'button',
    href: null,
    iconEnd: <IconArrowDropdownDown />,
    onClick: null,
    prefix,
    type
  };

  return (
    <Dropdown {...rootProps}>
      <NavItem {...triggerProps} />
    </Dropdown>
  );
};

export default NavOverflowMenu;
