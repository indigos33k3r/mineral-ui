/**
 * Copyright 2017 CA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* @flow */
import React, { Children, cloneElement, Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Manager } from 'react-popper';
import { createStyledComponent } from '../styles';
import {
  composeEventHandlers,
  composePropsWithGetter,
  generateId
} from '../utils';
import EventListener from '../EventListener';
import Portal from '../Portal';
import PopoverTrigger from './PopoverTrigger';
import PopoverContent, {
  componentTheme as popoverContentComponentTheme
} from './PopoverContent';
import { componentTheme as popoverArrowComponentTheme } from './PopoverArrow';

type Props = {
  /** Trigger for the Popover */
  children: React$Node,
  /** Content of the Popover */
  content: $FlowFixMe,
  /** For use with uncontrolled components, in which the Popover is immediately open upon initialization */
  defaultIsOpen?: boolean,
  /** Disables the Popover */
  disabled?: boolean,
  /**
   * Determines whether focus will be set to the trigger when the Popover is
   * closed.
   */
  focusTriggerOnClose?: boolean,
  /** Include an arrow on the Popover content pointing to the trigger */
  hasArrow?: boolean,
  /** Id of the Popover */
  id?: string,
  /** For use with controlled components, in which the app manages Popover state */
  isOpen?: boolean,
  /**
   * Plugins that are used to alter behavior. See
   * [PopperJS docs](https://popper.js.org/popper-documentation.html#modifiers)
   * for options.
   */
  modifiers?: Object,
  /** Called when Popover is closed */
  onClose?: (event: SyntheticEvent<>) => void,
  /** Called when Popover is opened */
  onOpen?: (event: SyntheticEvent<>) => void,
  /** Function that returns props to be applied to the content */
  getContentProps?: (props: Object, scope?: Object) => Object,
  /** Function that returns props to be applied to the trigger */
  getTriggerProps?: (props: Object, scope?: Object) => Object,
  /** Placement of the Popover */
  placement?:
    | 'auto'
    | 'auto-end'
    | 'auto-start'
    | 'bottom'
    | 'bottom-end'
    | 'bottom-start'
    | 'left'
    | 'left-end'
    | 'left-start'
    | 'right'
    | 'right-end'
    | 'right-start'
    | 'top'
    | 'top-end'
    | 'top-start',
  /** Subtitle displayed under the title */
  subtitle?: React$Node,
  /** Title of the Popover */
  title?: React$Node,
  /** @Private ref for the Popover trigger */
  triggerRef?: (node: ?React$Component<*, *>) => void,
  /** Use a Portal to render the Popover to the body rather than as a sibling to the trigger */
  usePortal?: boolean,
  /** Display the content with default styles */
  wrapContent?: boolean
};

type State = {
  isOpen?: boolean
};

export const componentTheme = (baseTheme: Object) => ({
  ...popoverArrowComponentTheme(baseTheme),
  ...popoverContentComponentTheme(baseTheme),
  ...baseTheme
});

const Root = createStyledComponent(
  Manager,
  {
    display: 'inline-block'
  },
  {
    displayName: 'Popover',
    forwardProps: ['tag'],
    rootEl: 'span'
  }
);

/**
 * Popovers float over page content and hold supporting information or user controls.
 */
export default class Popover extends Component<Props, State> {
  static defaultProps = {
    focusTriggerOnClose: true,
    hasArrow: true,
    placement: 'bottom',
    wrapContent: true
  };

  state: State = {
    isOpen: Boolean(this.props.defaultIsOpen)
  };

  id: string = this.props.id || `popover-${generateId()}`;

  popoverContent: ?React$Component<*, *>;

  popoverTrigger: ?React$Component<*, *>;

  render() {
    const { ...restProps } = this.props;
    const isOpen = this.getControllableValue('isOpen');

    const rootProps = {
      ...restProps,
      tag: 'span'
    };

    return (
      <Root {...rootProps}>
        <PopoverTrigger {...this.getTriggerProps({})} />
        {isOpen && this.renderPopoverContent()}
        {isOpen && (
          <EventListener
            listeners={[
              {
                target: 'document',
                event: 'click',
                handler: this.handleDocumentClick,
                options: true
              },
              {
                target: 'document',
                event: 'keydown',
                handler: this.handleDocumentKeydown,
                options: true
              }
            ]}
          />
        )}
      </Root>
    );
  }

  renderPopoverContent = () => {
    const { content, usePortal, wrapContent } = this.props;
    let popoverContent;

    if (wrapContent) {
      popoverContent = (
        <PopoverContent {...this.getContentProps({})}>{content}</PopoverContent>
      );
    } else {
      popoverContent = cloneElement(content, {
        ref: node => {
          this.popoverContent = node;
        }
      });
    }

    if (usePortal) {
      popoverContent = <Portal>{popoverContent}</Portal>;
    }

    return popoverContent;
  };

  getTriggerProps = (props: Object) => {
    const contentId = `${this.id}-popoverContent`;
    const isOpen = this.getControllableValue('isOpen');
    const { children, disabled, getTriggerProps, triggerRef } = this.props;
    const child = Children.only(children);

    return composePropsWithGetter(
      {
        ...props,
        'aria-describedby': contentId,
        'aria-disabled': disabled,
        'aria-expanded': isOpen,
        'aria-owns': contentId,
        children: child,
        disabled:
          child.props.disabled !== undefined ? child.props.disabled : disabled,
        onBlur: this.onBlur,
        onClick: !disabled
          ? composeEventHandlers(this.toggleOpenState, child.props.onClick)
          : undefined,
        ref: node => {
          this.popoverTrigger = node;
          triggerRef && triggerRef(node);
        },
        role: 'button'
      },
      getTriggerProps
    );
  };

  getContentProps = (props: Object) => {
    const contentId = `${this.id}-popoverContent`;
    const {
      getContentProps,
      hasArrow,
      modifiers,
      placement,
      subtitle,
      title
    } = this.props;

    return composePropsWithGetter(
      {
        ...props,
        hasArrow,
        id: contentId,
        modifiers,
        onBlur: this.onBlur,
        placement,
        ref: node => {
          this.popoverContent = node;
        },
        subtitle,
        tabIndex: 0,
        title
      },
      getContentProps
    );
  };

  onBlur = (event: SyntheticEvent<>) => {
    const isOpen = this.getControllableValue('isOpen');
    if (isOpen && this.isEventOutsideComponent(event)) {
      this.close(event);
    }
  };

  close = (event: SyntheticEvent<>) => {
    if (this.isControlled('isOpen')) {
      this.closeActions(event);
    } else {
      this.setState(
        () => ({ isOpen: false }),
        () => {
          this.closeActions(event);
        }
      );
    }
  };

  closeActions = (event: SyntheticEvent<>) => {
    const { focusTriggerOnClose, onClose } = this.props;
    onClose && onClose(event);
    const isOpen = this.getControllableValue('isOpen');
    !isOpen && focusTriggerOnClose && this.focusTrigger();
  };

  focusTrigger = () => {
    const node = findDOMNode(this.popoverTrigger); // eslint-disable-line react/no-find-dom-node
    if (node && node.firstChild && node.firstChild instanceof HTMLElement) {
      node.firstChild.focus();
    }
  };

  handleDocumentClick = (event: SyntheticEvent<>) => {
    if (this.isEventOutsideComponent(event)) {
      this.close(event);
    }
  };

  handleDocumentKeydown = (event: SyntheticEvent<>) => {
    if (event.key === 'Escape') {
      this.close(event);
    }
  };

  isEventOutsideComponent = (event: SyntheticEvent<>) => {
    /* eslint-disable react/no-find-dom-node */
    const { usePortal } = this.props;
    const node = findDOMNode(this);
    const popoverContentNode = findDOMNode(this.popoverContent);
    /* $FlowFixMe */
    const target = event.type === 'blur' ? event.relatedTarget : event.target;

    if (usePortal) {
      return (
        node &&
        node instanceof HTMLElement &&
        target &&
        target instanceof HTMLElement &&
        !node.contains(target) &&
        popoverContentNode &&
        popoverContentNode instanceof HTMLElement &&
        !popoverContentNode.contains(target)
      );
    } else {
      return (
        node &&
        node instanceof HTMLElement &&
        target &&
        target instanceof HTMLElement &&
        !node.contains(target)
      );
    }
  };

  isControlled = () => {
    return this.props.isOpen !== undefined;
  };

  open = (event: SyntheticEvent<>) => {
    if (this.isControlled('isOpen')) {
      this.openActions(event);
    } else {
      this.setState(
        () => ({ isOpen: true }),
        () => {
          this.openActions(event);
        }
      );
    }
  };

  openActions = (event: SyntheticEvent<>) => {
    this.focusTrigger();
    this.props.onOpen && this.props.onOpen(event);
  };

  toggleOpenState = (event: SyntheticEvent<>) => {
    const isOpen = this.getControllableValue('isOpen');
    if (isOpen) {
      this.close(event);
    } else {
      this.open(event);
    }
  };

  isControlled = (prop: string) => {
    return this.props[prop] !== undefined;
  };

  getControllableValue = (key: string) => {
    return this.isControlled(key) ? this.props[key] : this.state[key];
  };
}
