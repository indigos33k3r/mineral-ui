/* @flow */
import Dropdown from '../../../../../../library/Dropdown';
import { NavItem } from '../../../../../../library/Navigation';
import DemoLayout from '../../../common/DemoLayout';
import PrimaryNav from '../../common/PrimaryNav';

export default {
  id: 'overflow',
  title: 'Overflow',
  description: `If there is not sufficient space to display all navigation
items, they can be overflowed into a [Dropdown](/components/dropdown) menu.

Use the \`overflowAtIndex\` property when using the \`items\` prop to define
navigation items. Render a Dropdown yourself when using \`children\`.`,
  scope: { DemoLayout, Dropdown, NavItem, PrimaryNav },
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
      <DemoLayout style={{ width: '22em' }}>
        <PrimaryNav>
          <NavItem href={items[0].href}>{items[0].text}</NavItem>
          <NavItem href={items[1].href}>{items[1].text}</NavItem>
          <Dropdown data={items.slice(2)}>
            <NavItem>More</NavItem>
          </Dropdown>
        </PrimaryNav>
        <PrimaryNav items={items} overflowAtIndex={2} />
      </DemoLayout>
    );
  }`
};
