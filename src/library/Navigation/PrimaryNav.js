/* @flow */
import React from 'react';
import Navigation from './Navigation';

import type { PrimaryNavDefaultProps, PrimaryNavProps } from './types';

const PrimaryNav = (props: PrimaryNavProps) => <Navigation {...props} />;

const defaultProps: PrimaryNavDefaultProps = {
  ...Navigation.defaultProps,
  align: 'center'
};

PrimaryNav.defaultProps = defaultProps;

export default PrimaryNav;
