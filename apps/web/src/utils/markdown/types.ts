/*
 * The markdown style of Omagize is different
 *
 * It only supports part of markdown syntax and allow mentions
 */

export enum MentionType {
  User = 'user',
  Group = 'group',
  Everyone = 'all',
}

export const Syntax = {
  Bold: /\*\*(.+?)\*\*/g, // **Hello**
  Italic: /\^\^(.+?)\^\^/g, // ^^Hello^^
  Underline: /__(.+?)__/g, // __Hello__
  Delete: /~~(.+?)~~/g, // ~~Hello~~
  Code: /`(.+?)`/g, // `Hello`

  Quote: /> (.+)/g, // > Hello
  Header: /^# (.+)$/gm, // # Hello
  CodeBlock: /```((.|\n)*)```/gm, // ```Hello \n World```
};
