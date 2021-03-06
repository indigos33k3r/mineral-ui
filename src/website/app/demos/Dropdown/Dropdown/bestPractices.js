/* @flow */
import React from 'react';
import IconMenu from 'mineral-ui-icons/IconMenu';
import Button from '../../../../../library/Button';
import Dropdown from '../../../../../library/Dropdown';

import type { MenuItems } from '../../../../../library/Menu/types';
import type { BestPractices } from '../../../pages/ComponentDoc/types';

const data: MenuItems = [
  { text: 'Settings' },
  { text: 'Help' },
  { text: 'Log out' }
];

const shortData: MenuItems = [{ text: 'Reload' }];

const navData: MenuItems = [
  { text: 'Preferences' },
  { text: 'Account' },
  { text: 'About us' },
  { text: 'Pricing' },
  { text: 'Community' },
  { text: 'Help' },
  { text: 'Log in' }
];

const bestPractices: BestPractices = [
  {
    type: 'do',
    description: `Populate Dropdown with options that are related to the trigger,
so users can find actions easily.`,
    example: (
      <Dropdown data={data}>
        <Button primary>Account</Button>
      </Dropdown>
    )
  },
  {
    type: 'dont',
    description: `Don't present a Dropdown with only one option. If your app
renders only one option depending on state, consider a different layout for that
special case.`,
    example: (
      <Dropdown data={shortData}>
        <Button primary>File</Button>
      </Dropdown>
    )
  },
  {
    type: 'dont',
    description: `Don't use Dropdown for navigation, even on mobile devices.
Either reduce the amount of navigation in your application, or consider building
a drawer with the [Menu](/components/menu).`,
    example: (
      <Dropdown data={navData}>
        <Button iconStart={<IconMenu />} />
      </Dropdown>
    )
  }
];

export default bestPractices;
