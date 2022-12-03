/*
 * The markdown style of Omagize is different
 *
 * It only supports part of markdown syntax and allow mentions
 */

export enum MentionType {
  User = 'user',
  Role = 'role',
  Everyone = 'all',
}

export const Syntax = {
  Quote: /^> (.+)$/gm, // > Hello
  Header: /^# (.+)$/gm, // # Hello
  CodeBlock: /```((.|\n)*)```/gm, // ```Hello \n World```
};

export function toAPIMentionType(type: MentionType): 'user' | 'role' | 'everyone' {
  switch (type) {
    case MentionType.Everyone:
      return 'everyone';
    case MentionType.Role:
      return 'role';
    case MentionType.User:
      return 'user';
  }
}
