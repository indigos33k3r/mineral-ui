/* @flow */
import React from 'react';
import Navigation from '../Navigation';
import NavItem from '../NavItem';
import { mountInWrapper } from '../../../../utils/enzymeUtils';

const defaultProps = {
  items: [
    {
      href: 'page-0',
      text: 'Item 0'
    },
    {
      href: 'page-1',
      text: 'Item 1'
    },
    {
      href: 'page-2',
      text: 'Item 2'
    }
  ]
};

function mountNavigation(props = {}) {
  const navigationProps = {
    ...defaultProps,
    ...props
  };

  return mountInWrapper(<Navigation {...navigationProps} />);
}

const getNavItemAtIndex = (wrapper, index: number) => {
  return wrapper.find(NavItem).at(index);
};

const simulateAtIndex = (wrapper, index: number, event: string, args = {}) => {
  const navLink = getNavItemAtIndex(wrapper, index).find('a');
  navLink.simulate(event, args);
};

describe('Navigation', () => {
  it('renders', () => {
    const wrapper = mountNavigation();

    expect(wrapper.exists()).toEqual(true);
  });

  it('calls onChange', () => {
    const onChange = jest.fn();
    const wrapper = mountNavigation({ onChange });

    simulateAtIndex(wrapper, 1, 'click');

    expect(onChange).toHaveBeenCalled();
  });
});
