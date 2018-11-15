/* @flow */
import Dropdown from '../../../../../../library/Dropdown';
import { NavItem } from '../../../../../../library/Navigation';
import DemoLayout from '../../../common/DemoLayout';
import SecondaryNav from '../../common/SecondaryNav';

export default {
  id: 'overflow',
  title: 'Overflow',
  description: `If there is not sufficient space to display all navigation
items, e.g. when a media query dictates a narrow width, they can be overflowed
into a [Dropdown](/components/dropdown) menu.

Use the \`overflowAtIndex\` property when using the \`items\` prop to define
navigation items. Render a Dropdown yourself when using \`children\`.`,
  scope: { DemoLayout, Dropdown, NavItem, SecondaryNav },
  source: `() => {
    const items = [
      {
        href: '/malachite',
        text: 'Malachite'
      },
      {
        href: '/fluorite',
        text: 'Fluorite'
      },
      {
        href: '/magnetite',
        text: 'Magnetite'
      },
      {
        href: '/aragonite',
        text: 'Aragonite'
      }
    ];

    return (
      <DemoLayout style={{ width: '23em' }}>
        <SecondaryNav>
          <NavItem href={items[0].href}>{items[0].text}</NavItem>
          <NavItem href={items[1].href}>{items[1].text}</NavItem>
          <Dropdown data={items.slice(2)}>
            <NavItem>More</NavItem>
          </Dropdown>
        </SecondaryNav>
        <SecondaryNav items={items} overflowAtIndex={2} />
      </DemoLayout>
    );
  }`
};
