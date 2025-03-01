import type React from 'react';
import { createElement, useId } from 'react';
import type * as Api from './api.js';

export const DEFAULT_FONT_SIZE = 50;

export type ComponentBaseProps = {
  /**
   * Component children.
   */
  children?: React.ReactNode;
  /**
   * Id of a component.
   */
  id?: Api.ComponentId;
};

export type SceneComponent = Api.Component | string;
export type SceneBuilder<P> = (props: P, children: SceneComponent[]) => Api.Component;

export function createSmelterComponent<P extends ComponentBaseProps>(
  sceneBuilder: SceneBuilder<P>
): (props: P) => React.ReactNode {
  return (props: P): React.ReactNode => {
    const { children, ...otherProps } = props;
    const autoId = useId();

    return createElement(
      'smelter',
      {
        sceneBuilder,
        props: { ...otherProps, id: otherProps.id ?? autoId },
      },
      ...(Array.isArray(children) ? children : [children])
    );
  };
}

export function sceneComponentIntoApi(component: SceneComponent): Api.Component {
  if (typeof component === 'string') {
    return {
      type: 'text',
      text: component,
      font_size: DEFAULT_FONT_SIZE,
    };
  }
  return component;
}
