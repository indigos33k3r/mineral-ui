/* @flow */
import { createStyledComponent } from '../../../../../library/styles';
import { FlexItem as _FlexItem } from '../../../../../library/Flex';
import { boxStyles } from '../../Box/common/DemoBox';

export default createStyledComponent(_FlexItem, (props) => boxStyles(props));
