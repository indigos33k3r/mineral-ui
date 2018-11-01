/* @flow */
import React, { Children, cloneElement, Component } from 'react';
import composeEventHandlers from '../utils/composeEventHandlers';
import Dropdown from '../Dropdown';
import { MenuItem } from '../Menu';
import IconArrowDropdownDown from '../Icon/IconArrowDropdownDown';
import { INTERNAL_TYPE, PREFIX } from './constants';
import { NavigationRoot } from './styled';
import NavItem from './NavItem';

import type {
  AnchorEvent,
  MenuItemRenderProps,
  NavigationDefaultProps,
  NavigationItem,
  NavigationProps
} from './types';

export default class Navigation extends Component<NavigationProps> {
  static defaultProps: NavigationDefaultProps = {
    itemElement: 'a',
    maxItemWidth: '8.5em',
    messages: {
      moreLabel: 'More navigation items',
      moreText: 'More'
    }
  };

  render() {
    const {
      align,
      items,
      minimal,
      secondary,
      type: typeProp,
      ...restProps
    } = this.props;

    const prefix = secondary ? PREFIX.secondary : PREFIX.primary;
    const type = typeProp
      ? `_${typeProp}`
      : minimal
        ? INTERNAL_TYPE.minimal
        : INTERNAL_TYPE.none;

    const rootProps = {
      align,
      prefix,
      type,
      ...restProps
    };

    return (
      <NavigationRoot {...rootProps}>
        {items
          ? this.renderFromData({ prefix, type })
          : this.renderFromChildren({ prefix, type })}
      </NavigationRoot>
    );
  }

  renderFromChildren = (typeAndPrefix: Object) => {
    // $FlowFixMe — Flow throws an error if you don't destructure `data` here,
    // even though it should be unecessary
    const renderDropdown = (child, { data, ...childProps }) => {
      const dropdownProps = {
        children: cloneElement(child.props.children, {
          ...childProps,
          ...this.getDropdownTriggerProps()
        }),
        data: this.getDropdownData({ data, ...childProps }),
        item: this.getDropdownItem()
      };

      return cloneElement(child, dropdownProps);
    };

    return Children.map(this.props.children, (child, index) => {
      const childProps = this.getNavItemProps({
        index,
        ...child.props,
        ...typeAndPrefix
      });

      return child.type === Dropdown
        ? renderDropdown(child, childProps)
        : cloneElement(child, childProps);
    });
  };

  renderFromData = (typeAndPrefix: Object) => {
    const { items, overflowAtIndex } = this.props;

    let overflowData;
    if (items && overflowAtIndex) {
      overflowData = items.slice(overflowAtIndex);
    }

    return (
      items &&
      items.map(({ disabled, text, ...restItem }, index) => {
        let navItemProps = {
          ...this.getNavItemProps({
            index,
            ...restItem,
            ...typeAndPrefix
          }),
          children: text,
          disabled
        };

        if (overflowAtIndex && index >= overflowAtIndex) {
          if (index === overflowAtIndex) {
            const dropdownProps = {
              data: this.getDropdownData({
                data: overflowData,
                disabled,
                index
              }),
              item: this.getDropdownItem()
            };
            navItemProps = {
              ...navItemProps,
              ...this.getDropdownTriggerProps()
            };

            return (
              <Dropdown key={index} {...dropdownProps}>
                <NavItem {...navItemProps} />
              </Dropdown>
            );
          } else {
            return;
          }
        }
        return <NavItem key={index} {...navItemProps} />;
      })
    );
  };

  getNavItemProps = ({
    disabled,
    element,
    index,
    maxWidth,
    selected,
    ...restItemProps
  }: {
    disabled?: boolean,
    element?: React$Element<*> | string,
    index: number,
    maxWidth?: number | string,
    selected?: boolean
  }) => {
    const {
      itemElement,
      maxItemWidth,
      selectedIndex,
      type: ignoreType,
      ...restNavProps
    } = this.props;

    return {
      disabled,
      element: element || itemElement,
      index,
      maxWidth: maxWidth || maxItemWidth,
      // TODO: This doesn't seem to work for disabled overflow items
      onClick: !disabled
        ? this.handleClick
        : (event) => {
            event.preventDefault();
          },
      selected: selected || index === selectedIndex,
      ...restNavProps,
      ...restItemProps
    };
  };

  getDropdownData = ({
    data,
    disabled,
    index
  }: {
    data: Array<NavigationItem>,
    disabled?: boolean,
    index: number
  }) =>
    // $FlowFixMe: Flow does not recognize that it is mapping over NavigationItems
    data.map(({ onClick, ...item }) => ({
      ...item,
      'data-index': index,
      onClick: composeEventHandlers(
        onClick,
        !disabled
          ? this.handleClick
          : (event) => {
              event.preventDefault();
            }
      )
    }));

  getDropdownItem = () => {
    const { itemElement } = this.props;
    return (props: ?MenuItemRenderProps) => {
      const common = {
        element: itemElement,
        role: null,
        tabIndex: -1
      };
      const itemProps = props ? { ...props.props, ...common } : common;
      return <MenuItem {...itemProps} />;
    };
  };

  getDropdownTriggerProps = () => {
    const { messages } = this.props;

    return {
      'aria-label': messages && messages.moreLabel,
      children: messages && messages.moreText,
      element: 'button',
      href: null,
      iconEnd: <IconArrowDropdownDown />,
      onClick: null
    };
  };

  handleClick = (event: AnchorEvent) => {
    event.persist();
    const { currentTarget: target } = event;
    const selectedIndex = parseInt(target.getAttribute('data-index'));

    if (selectedIndex !== this.props.selectedIndex) {
      this.changeActions(selectedIndex, event);
    }
  };

  changeActions = (selectedIndex: number, event: AnchorEvent) => {
    const { onChange } = this.props;
    onChange && onChange(selectedIndex, event);
  };
}
