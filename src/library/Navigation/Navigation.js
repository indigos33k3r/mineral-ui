/* @flow */
import React, { Children, cloneElement, Component } from 'react';
import { INTERNAL_TYPE, PREFIX } from './constants';
import { NavigationRoot } from './styled';
import NavItem from './NavItem';
import NavOverflowMenu from './NavOverflowMenu';

import type {
  AnchorEvent,
  NavigationDefaultProps,
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
      items: ignoreItems,
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
        {this.renderFromData({ prefix, type })}
      </NavigationRoot>
    );
  }

  renderFromData = (typeAndPrefix: Object) => {
    const {
      children,
      itemElement,
      items: itemsProp,
      messages,
      overflowAtIndex
    } = this.props;

    const items = children
      ? Children.map(children, (child) => {
          const { children, ...rest } = child.props;
          return {
            child,
            text: children,
            ...rest
          };
        })
      : itemsProp;

    let overflowData;
    if (items && overflowAtIndex) {
      overflowData = items.slice(overflowAtIndex);
    }

    return (
      items &&
      items.length &&
      items.map(({ disabled, child, text, ...restItem }, index) => {
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
            const menuProps = {
              data: overflowData,
              disabled,
              onClick: this.handleClick,
              index,
              itemElement,
              messages,
              ...typeAndPrefix
            };

            return <NavOverflowMenu key={index} {...menuProps} />;
          } else {
            return;
          }
        }

        // return child ? (
        //   cloneElement(child, { key: index, ...navItemProps })
        // ) : (
        //   <NavItem key={index} {...navItemProps} />
        // );
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
        : (selectedIndex, event) => {
            event.preventDefault();
          },
      selected: selected || index === selectedIndex,
      ...restNavProps,
      ...restItemProps
    };
  };

  // TODO: Switch order of params?
  handleClick = (selectedIndexTemp: number, event: AnchorEvent) => {
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
