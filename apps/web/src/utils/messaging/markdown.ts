type ParseNode = {
  parent?: ParseNode;
  syntax?: Syntax;
  index: number;
  content: Array<string | ParseNode>;
};

export function parseMessage(
  text: string,
  syntaxes: Syntax[] = DefaultSyntax
): Array<ParseNode | string> {
  syntaxes = syntaxes.sort((a, b) => b.symbol.length - a.symbol.length);
  const root: ParseNode = {
    index: 0,
    content: [],
  };
  let current: ParseNode = root;
  var last = 0;

  const on = (i: number, syntax: Syntax) => {
    const isOpen =
      current.syntax == null ||
      (current.syntax.allowChildren && current.syntax !== syntax);

    //close content without syntax added
    if (last < i) {
      current.content.push(text.substring(last, i));
    }

    if (isOpen) {
      const child: ParseNode = {
        parent: current,
        syntax: syntax,
        index: i,
        content: [],
      };

      //open new children
      current.content.push(child);
      current = child;
    } else {
      current = current.parent;
    }

    last = i + syntax.symbol.length;
  };

  for (let i = 0; i < text.length; ) {
    for (const syntax of syntaxes) {
      if (!text.startsWith(syntax.symbol, i)) continue;

      on(i, syntax);
      i += syntax.symbol.length;
      break;
    }

    i++;
  }

  return root.content;
}

export function parseMessageExpression(
  text: string,
  syntaxes: Syntax[] = DefaultSyntax
) {
  return parseMessage(text, syntaxes).map((c) => {
    if (typeof c === 'string') return c;
    return compress(c);
  });
}

export function compress(node: ParseNode): Expression {
  return {
    syntax: node.syntax?.id,
    content: node.content.map<Expression | string>((c) => {
      if (typeof c === 'string') return c;

      return compress(c);
    }),
  };
}

export type Expression = {
  /** syntax id */
  syntax: Syntax['id'];
  content: Array<Expression | string>;
};

export const DefaultSyntax: Syntax[] = [
  {
    id: 'bold',
    symbol: '**',
    allowChildren: true,
  },
  {
    id: 'italic',
    symbol: '*',
    allowChildren: true,
  },
  {
    id: 'plain',
    symbol: '\\',
    allowChildren: false,
  },
];

export type Syntax = {
  id: string;
  symbol: string;

  /** Allow syntax in syntax, default: false */
  allowChildren: boolean;
};
