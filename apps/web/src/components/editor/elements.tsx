import { RenderElementProps } from 'slate-react';
import { MentionType } from 'utils/markdown/types';
import { EveryoneMention, MentionEntity } from './entities';

export function renderElements(props: RenderElementProps) {
  const element = props.element;

  switch (element.type) {
    case 'mention':
      const data = element.data;
      let content;

      switch (element.mention_type) {
        case MentionType.Everyone:
          content = <EveryoneMention />;
          break;
        default:
          content = <MentionEntity id={data.id} name={data.name} avatar={data.avatar} />;
      }

      return (
        <span {...props.attributes} contentEditable={false}>
          {props.children}
          {content}
        </span>
      );
    default:
      return <p {...props.attributes}>{props.children}</p>;
  }
}
