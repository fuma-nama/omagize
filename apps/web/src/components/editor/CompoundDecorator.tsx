/**
 * @prettier
 */

import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  DraftDecorator,
} from 'draft-js';
import { List } from 'immutable';
import { JSXElementConstructor } from 'react';

const Span = (props: any) => <span>{props.children}</span>;

export default class CompoundDecorator {
  decorators: CompositeDecorator[];

  constructor(decorators: Array<CompositeDecorator | DraftDecorator> = []) {
    this.decorators = decorators.map((decorator) => {
      if (decorator instanceof CompositeDecorator) return decorator;
      else return new CompositeDecorator([decorator]);
    });
  }

  getDecorations(block: ContentBlock, contentState: ContentState) {
    const emptyTuples = Array(block.getText().length).fill(
      Array(this.decorators.length).fill(null)
    );

    const decorations = this.decorators.reduce((tuples, decorator, index) => {
      const blockDecorations = decorator.getDecorations(block, contentState);

      return tuples.map((tuple, tupleIndex) => {
        return [
          ...tuple.slice(0, index),
          blockDecorations.get(tupleIndex),
          ...tuple.slice(index + 1),
        ];
      });
    }, emptyTuples);

    return List(decorations.map((d) => JSON.stringify(d)));
  }

  getComponentForKey(key: string) {
    const tuple = JSON.parse(key);
    return (props: {
      children: any;
      decoratorProps: any;
      compositionProps: any;
    }) => {
      const { decoratorProps, ...compositionProps } = props;
      const Composed = tuple.reduce(
        (
          Composition: JSXElementConstructor<any>,
          decoration: string,
          index: number
        ) => {
          if (decoration !== null) {
            const decorator = this.decorators[index];
            const Component = decorator.getComponentForKey(decoration);
            const componentProps = {
              ...compositionProps,
              ...decoratorProps[index],
            };
            return () => (
              <Component {...componentProps}>
                <Composition {...compositionProps} />
              </Component>
            );
          }
          return Composition;
        },
        Span
      );
      return <Composed>{props.children}</Composed>;
    };
  }

  getPropsForKey(key: string) {
    const tuple = JSON.parse(key);
    return {
      decoratorProps: tuple.map((decoration: string, index: number) => {
        const decorator = this.decorators[index];
        return decoration !== null ? decorator.getPropsForKey(decoration) : {};
      }),
    };
  }
}
