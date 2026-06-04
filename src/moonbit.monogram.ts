import {
  alt,
  defineGrammar,
  left,
  many,
  none,
  op,
  opt,
  prefix,
  right,
  rule,
  sep,
  token,
} from '../vendor/monogram/src/api.ts';

const digit = String.raw`[0-9]`;
const decimal = String.raw`${digit}[0-9_]*`;
const hex = String.raw`0[xX][0-9a-fA-F][0-9a-fA-F_]*`;
const octal = String.raw`0[oO][0-7][0-7_]*`;
const binary = String.raw`0[bB][01][01_]*`;
const intSuffix = String.raw`(?:UL|U|L|N)?`;
const intLiteral = String.raw`(?:${hex}|${octal}|${binary}|${decimal})${intSuffix}`;
const doubleDec = String.raw`${decimal}\.[0-9_]*(?:[eE][+-]?${decimal})?(?!\.)`;
const doubleHex = String.raw`${hex}\.[0-9a-fA-F_]*(?:[pP][+-]?${decimal})?(?!\.)`;
const floatDec = String.raw`${decimal}\.[0-9_]*(?:[eE][+-]?${decimal})?F`;
const floatHex = String.raw`${hex}\.[0-9a-fA-F_]*[pP][+-]?${decimal}F`;
const escape = String.raw`\\(?:['"\\nrtbf/ ]|x[0-9a-fA-F]{2}|o[0-3][0-7]{2}|u[0-9a-fA-F]{4}|u\{[0-9a-fA-F]+\}|.)`;
const interpolatedChunk = String.raw`\\\{(?:[^{}\n"'\\]|${escape}|"(?:[^"\\\n]|${escape})*"|'(?:[^'\\\n]|${escape})*'|\{[^{}\n]*\})*\}`;
const identStart = String.raw`[a-zA-Z_\u0080-\uFFFF]`;
const identContinue = String.raw`[a-zA-Z0-9_\u0080-\uFFFF]`;

// Comments and attributes come first so they cannot be split into punctuation plus identifiers.
const DocComment = token(/\/\/\/[^\n]*/, { skip: true, scope: 'comment.line.documentation' });
const LineComment = token(/\/\/[^\n]*/, { skip: true, scope: 'comment.line.double-slash' });
const AttributeName = token(/#[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)?/, {
  scope: 'entity.name.function.decorator',
});

const TryQuestion = token(/try\?/, { scope: 'keyword.control.exception' });
const TryBang = token(/try!/, { scope: 'keyword.control.exception' });
const LexmatchQuestion = token(/lexmatch\?/, { scope: 'keyword.control.conditional' });

const DotInt = token(/\.[0-9]+/, { scope: 'constant.numeric.integer.tuple-index' });
const PackageName = token(new RegExp(String.raw`@${identStart}${identContinue}*(?:\/${identStart}${identContinue}*)*`), {
  scope: 'entity.name.namespace',
});
const Float = token(new RegExp(`(?:${floatHex}|${floatDec})`), { scope: 'constant.numeric.float' });
const Double = token(new RegExp(`(?:${doubleHex}|${doubleDec})`), { scope: 'constant.numeric.double' });
const Int = token(new RegExp(intLiteral), { scope: 'constant.numeric.integer' });
const RegexLiteral = token(new RegExp(String.raw`re"(?:[^"\\\n]|${interpolatedChunk}|${escape})*"`), {
  scope: 'string.regexp',
});
const Bytes = token(new RegExp(String.raw`b"(?:[^"\\\n]|${escape})*"`), {
  string: true,
  scope: 'string.quoted.double.bytes',
});
const StringLiteral = token(new RegExp(String.raw`"(?:[^"\\\n]|${interpolatedChunk}|${escape})*"`), {
  string: true,
  escape: new RegExp(escape),
  escapeValid: new RegExp(escape),
  template: { open: '"', interpOpen: String.raw`\{`, interpClose: '}' },
  scope: 'string.quoted.double',
});
const MultilineInterp = token(/\$\|[^\n]*/, { scope: 'string.quoted.other.multiline.interpolated' });
const MultilineString = token(/#\|[^\n]*/, { scope: 'string.quoted.other.multiline' });
const Byte = token(new RegExp(String.raw`b'(?:${escape}|[^\\'\n])+'`), { scope: 'constant.character.byte' });
const Char = token(new RegExp(String.raw`'(?:${escape}|[^\\'\n])+'`), { scope: 'constant.character' });
const Ident = token(new RegExp(String.raw`${identStart}${identContinue}*`), { identifier: true });

const SimplePath = rule($ => [
  Ident,
  [PackageName, '.', Ident],
  [$, '.', Ident],
]);

const TypeName = rule($ => [
  Ident,
  ['&', Ident],
  [PackageName, '.', Ident],
  ['&', PackageName, '.', Ident],
  [TypeName, '::', Ident],
]);

const TypeParam = rule($ => [
  Ident,
  '_',
  [Ident, ':', sep(Type, '+')],
]);

const TypeParams = rule($ => [
  ['[', sep(TypeParam, ','), ']'],
]);

const TypeArgs = rule($ => [
  ['[', sep(Type, ','), ']'],
]);

const Type = rule($ => [
  TypeName,
  'Unit', 'Bool', 'Byte', 'Char', 'Int', 'Int64', 'UInt', 'UInt64', 'Float', 'Double',
  'String', 'Bytes', 'Array', 'FixedArray', 'Option', 'Result', 'Json',
  ['_',],
  ['(', sep($, ','), ')'],
  ['[', sep($, ','), ']'],
  ['{', many(RecordTypeField), '}'],
  ['async', $],
  [$, '?'],
  [$, TypeArgs],
  [$, '->', $],
  [$, 'noraise'],
  [$, 'raise', '?'],
  [$, 'raise', $],
], { type: true });

const RecordTypeField = rule($ => [
  [many(Attribute), opt(Visibility), opt('mut'), Ident, ':', Type],
]);

const Binder = rule($ => [
  Ident,
  '_',
]);

const Param = rule($ => [
  [many(Attribute), opt('mut'), Binder, opt('~'), opt('?',), opt(':', Type), opt('=', Expr)],
]);

const Params = rule($ => [
  ['(', sep(Param, ','), ')'],
]);

const Argument = rule($ => [
  ['...', Expr],
  [Ident, '?', '=', Expr],
  [Ident, alt('~', '?'), opt(':', Expr)],
  [Ident, '=', Expr],
  Expr,
]);

const AttributeArgument = rule($ => [
  [Ident, '=', Expr],
  Expr,
]);

const Attribute = rule($ => [
  [AttributeName, opt('(', sep(AttributeArgument, ','), ')')],
]);

const Literal = rule($ => [
  Int,
  Float,
  Double,
  Char,
  Byte,
  Bytes,
  StringLiteral,
  MultilineString,
  MultilineInterp,
  RegexLiteral,
  'true',
  'false',
]);

const ArrayItem = rule($ => [
  ['..', Expr],
  Expr,
]);

const MapKey = rule($ => [
  Literal,
  ['-', Int],
  ['-', Float],
  ['-', Double],
]);

const RecordField = rule($ => [
  ['..', Expr],
  [MapKey, ':', Expr],
  [StringLiteral, ':', Expr],
  [Ident, ':', Expr],
  [Ident, '=', Expr],
  Ident,
]);

const MatchCase = rule($ => [
  [Pattern, opt('if', Expr), '=>', Expr, opt(';')],
  ['...', opt(';')],
]);

const ForBinding = rule($ => [
  [Binder, '=', Expr],
]);

const LexPattern = rule($ => [
  '_',
  Binder,
  RegexLiteral,
  StringLiteral,
  TypeName,
  [PackageName, '.', Ident],
  [RegexLiteral, 'as', Binder],
  [$, 'as', Binder],
  [$, '|', $],
  [$, '+', $],
  [$, RegexLiteral],
  [$, StringLiteral],
  [$, TypeName],
  [$, Binder],
  ['(', sep($, ','), ')'],
  [$, '(', $, ')'],
  [$, ';', $],
]);

const LexCase = rule($ => [
  [LexPattern, opt('if', Expr), '=>', Expr, opt(';')],
  ['...', opt(';')],
]);

const RegexMatchItem = rule($ => [
  [LexPattern, 'as', Binder],
  [Ident, '=', Binder],
  [Ident, '~'],
  LexPattern,
]);

const Expr = rule($ => [
  Literal,
  SimplePath,
  ['&', Ident, '::', Ident],
  ['&', PackageName, '.', Ident, '::', Ident],
  [TypeName, '::', Ident],
  [TypeName, '::', PackageName, '.', Ident],
  '_',
  ['...'],
  ['...', $],
  [prefix, $],
  [TryQuestion, $],
  [TryBang, $],
  [$, op, $],
  [$, '?', $, ':', $],
  [$, DotInt],
  [$, '.', alt(Ident, Int, ['(', sep($, ','), ')'])],
  [$, '..', Ident, '(', sep(Argument, ','), ')'],
  [$, '::', Ident],
  [$, '::', PackageName, '.', Ident],
  [$, '::', '{', sep(RecordField, ','), '}'],
  [$, '(', sep(Argument, ','), ')'],
  [$, '[', sep($, ','), ']'],
  [$, '[', opt($), ':', opt($), ']'],
  [$, TypeArgs],
  [$, 'as', Type],
  [$, 'is', Pattern],
  [$, LexmatchQuestion, LexPattern, opt('with', Ident)],
  [$, '=~', alt(LexPattern, ['(', sep(RegexMatchItem, ','), ')'])],
  [$, '<+', TemplateRhs],
  [$, '<?', TemplateRhs],
  ['(', $, ':', Type, ')'],
  ['(', sep($, ','), ')'],
  ['[', sep(ArrayItem, ','), ']'],
  ['[', 'for', Pattern, 'in', $, opt('if', $), opt('=>', $), ']'],
  ['[', 'for', sep(ForBinding, ','), opt(';', opt($), opt(';', sep(ForBinding, ','))), opt('if', $), opt('=>', $), ']'],
  ['{', sep(RecordField, ','), '}'],
  ['fn', opt(TypeParams), Params, opt(ReturnType), opt('=', $), opt(Block)],
  ['async', 'fn', opt(TypeParams), Params, opt(ReturnType), opt('=', $), opt(Block)],
  ['if', $, Block, opt('else', alt(Block, $))],
  ['if', $, Block, 'else', 'if', $, Block, opt('else', alt(Block, $))],
  ['guard', $, 'else', Block],
  ['match', $, '{', many(MatchCase), '}'],
  [Binder, '=>', $],
  [Params, '=>', $],
  ['loop', $, '{', many(MatchCase), '}', opt(alt('else', 'nobreak'), Block)],
  ['loop', opt(Params), Block],
  [Ident, '~', ':', 'loop', $, '{', many(MatchCase), '}', opt(alt('else', 'nobreak'), Block)],
  ['while', $, Block, opt(alt('else', 'nobreak'), alt(Block, ['if', $, Block, opt('else', alt(Block, $))]))],
  [Ident, '~', ':', 'while', $, Block, opt(alt('else', 'nobreak'), Block)],
  ['for', Pattern, 'in', $, Block],
  ['for', sep(ForBinding, ','), opt(';', opt($), opt(';', sep(ForBinding, ','))), Block, opt(alt('else', 'nobreak'), Block), opt('where', '{', sep(RecordField, ','), '}')],
  ['for', ';', opt($), opt(';', sep(ForBinding, ',')), Block, opt(alt('else', 'nobreak'), Block), opt('where', '{', sep(RecordField, ','), '}')],
  [Ident, '~', ':', 'for', Pattern, 'in', $, Block, opt(alt('else', 'nobreak'), Block), opt('where', '{', sep(RecordField, ','), '}')],
  ['try', $],
  ['try', $, 'catch', alt(['{', many(MatchCase), '}'], ['!', '{', many(MatchCase), '}']), opt(alt('else', 'noraise'), '{', many(MatchCase), '}')],
  [$, 'catch', alt(['{', many(MatchCase), '}'], ['!', '{', many(MatchCase), '}']), opt(alt('else', 'noraise'), '{', many(MatchCase), '}')],
  ['raise', $],
  ['throw', $],
  ['return', opt($)],
  ['break', opt(Ident, '~'), opt($)],
  ['continue', opt(Ident, '~'), opt(sep($, ','))],
  [LexmatchQuestion, $, opt('with', Ident), '{', many(LexCase), '}'],
  ['lexmatch', $, opt('with', Ident), '{', many(LexCase), '}'],
  Block,
]);

const TemplateRhs = rule($ => [
  StringLiteral,
  MultilineString,
  MultilineInterp,
  ['{', sep(TemplateField, ','), '}'],
]);

const TemplateField = rule($ => [
  [StringLiteral, ':', Expr],
]);

const Pattern = rule($ => [
  '_',
  Binder,
  Literal,
  ['..'],
  ['..', Binder],
  ['..', '_'],
  ['..', 'as', Binder],
  ['-', Int],
  ['-', Float],
  ['-', Double],
  [PackageName, '.', Ident],
  [TypeName, '::', Ident],
  [TypeName, '::', PackageName, '.', Ident],
  [$, 'as', Binder],
  [$, '|', $],
  [$, '..<', $],
  [$, '..=', $],
  [$, '..', $],
  ['(', sep($, ','), ')'],
  ['[', sep($, ','), ']'],
  ['{', sep(PatternField, ','), '}'],
  [Ident, '(', sep(PatternArgument, ','), ')'],
]);

const PatternArgument = rule($ => [
  ['..'],
  ['..', Binder],
  ['..', '_'],
  ['..', 'as', Binder],
  [Ident, '~'],
  [Ident, '?'],
  [Ident, '=', Pattern],
  [Ident, ':', Pattern],
  Pattern,
]);

const PatternField = rule($ => [
  ['..'],
  [Literal, ':', Pattern],
  [StringLiteral, ':', Pattern],
  [Ident, ':', Pattern],
  [Ident, '=', Pattern],
  Ident,
]);

const ReturnType = rule($ => [
  ['->', Type, opt('raise', opt('?'), opt(Type)), opt('noraise')],
]);

const Visibility = rule($ => [
  'pub',
  'priv',
  ['pub', '(', 'readonly', ')'],
  ['pub', '(', 'all', ')'],
  ['pub', '(', 'open', ')'],
]);

const Derive = rule($ => [
  ['derive', opt('(', sep(Ident, ','), ')')],
]);

const FunName = rule($ => [
  Ident,
  [Ident, '::', Ident],
  [TypeName, '::', Ident],
]);

const FunDecl = rule($ => [
  [many(Attribute), opt('declare'), opt('extern', opt(StringLiteral)), opt(Visibility), opt('async'), 'fn', opt(TypeParams), FunName, opt('!'), opt(TypeParams), opt(Params), opt(ReturnType), DeclBody],
  [many(Attribute), opt('declare'), opt('extern', opt(StringLiteral)), opt(Visibility), opt('async'), 'fn', FunName, opt('!'), opt(TypeParams), opt(Params), opt(ReturnType), DeclBody],
]);

const DeclBody = rule($ => [
  ['=', Expr],
  ['=', StringLiteral],
  ['=', StringLiteral, StringLiteral],
  ['=', MultilineString, many(MultilineString)],
  Block,
  [';'],
]);

const ValDecl = rule($ => [
  [many(Attribute), opt('declare'), opt(Visibility), alt('let', 'const'), Pattern, opt(':', Type), opt('=', Expr)],
  ['letrec', Binder, opt(':', Type), '=', Expr, many('and', Binder, opt(':', Type), '=', Expr)],
  ['letrec', sep(FunDecl, 'and')],
]);

const TypeHeader = rule($ => [
  [many(Attribute), opt('declare'), opt(Visibility), alt('type', 'struct', 'enum', 'extenum', 'suberror'), opt('!'), Ident, opt(TypeParams)],
]);

const TypeDecl = rule($ => [
  [TypeHeader, TypeBody, opt(Derive)],
  [TypeHeader, '=', Type, opt(Derive)],
  [TypeHeader, opt(Derive)],
  [many(Attribute), opt(Visibility), 'extenum', PackageName, '.', Ident, opt(TypeParams), '+=', '{', many(TypeMember), '}', opt(Derive)],
  [many(Attribute), opt(Visibility), 'enumview', opt(TypeParams), Ident, '{', many(TypeMember), '}', 'for', Type, 'with', Ident, Params, Block],
  [many(Attribute), opt('declare'), opt(Visibility), 'typealias', TypeAliasTarget],
  [many(Attribute), opt(Visibility), 'traitalias', Ident, '=', TypeName],
  [many(Attribute), opt(Visibility), 'fnalias', FunAliasTarget],
]);

const TypeAliasTarget = rule($ => [
  [TypeName, opt('as', Ident)],
  [PackageName, '.', Ident, opt('as', Ident)],
  [PackageName, '.', '(', sep(TypeName, ','), ')'],
]);

const FunAliasTarget = rule($ => [
  [opt(TypeName, '::'), Ident, opt('as', Ident)],
  [PackageName, '.', Ident, opt('as', Ident)],
  ['(', sep(Ident, ','), ')'],
]);

const TypeBody = rule($ => [
  ['{', many(TypeMember), '}'],
  ['(', sep(Type, ','), ')'],
  ['+=', '{', many(TypeMember), '}'],
]);

const TypeMember = rule($ => [
  [many(Attribute), opt(Visibility), opt('mut'), Ident, ':', Type],
  [many(Attribute), Ident, '(', sep(Type, ','), ')'],
  [many(Attribute), Ident, opt(Params), opt(':', Type)],
  [many(Attribute), Ident, opt(TypeArgs), opt(Params)],
  ['..', StringLiteral],
]);

const TraitDecl = rule($ => [
  [many(Attribute), opt(Visibility), 'trait', Ident, opt(TypeParams), opt(':', sep(Type, '+')), TraitBody],
]);

const TraitMethod = rule($ => [
  [many(Attribute), opt('async'), 'fn', opt(TypeParams), FunName, opt('!'), opt(TypeParams), opt(Params), opt(ReturnType), opt('=', Expr)],
]);

const TraitBody = rule($ => [
  ['{', many(alt(FunDecl, TraitMethod, ValDecl, TypeDecl)), '}'],
  [';'],
]);

const ImplWithType = rule($ => [
  Type,
]);

const ImplDecl = rule($ => [
  [many(Attribute), opt(Visibility), 'impl', opt(TypeParams), TypeName, 'with', opt('fn'), Ident, opt('!'), Params, opt(ReturnType), DeclBody],
  [many(Attribute), opt(Visibility), 'impl', opt(TypeParams), opt(TypeName, 'for'), Type, 'with', ImplBody],
  [many(Attribute), opt(Visibility), 'impl', opt(TypeParams), opt(TypeName, 'for'), Type, 'with', ImplWithType, ImplBody],
  [many(Attribute), opt(Visibility), 'impl', opt(TypeParams), opt(TypeName, 'for'), Type, ImplBody],
  [many(Attribute), opt(Visibility), 'impl', TypeName, opt(TypeParams), opt(Params), opt(ReturnType), DeclBody],
]);

const ImplBody = rule($ => [
  ['{', many(alt(FunDecl, ValDecl, TypeDecl)), '}'],
  FunDecl,
  [';'],
]);

const ImportDecl = rule($ => [
  ['import', StringLiteral],
  ['using', PackageName, opt('(', sep(Ident, ','), ')')],
  ['using', PackageName, '{', sep(alt(Ident, TypeDecl, FunDecl), ';'), '}'],
]);

const TestDecl = rule($ => [
  [many(Attribute), opt('async'), 'test', opt(StringLiteral), opt(Params), Block],
]);

const ControlStmt = rule($ => [
  ['defer', Expr],
  ['return', opt(Expr)],
  ['raise', Expr],
  ['throw', Expr],
  ['break'],
  ['continue'],
]);

const AssignStmt = rule($ => [
  [Expr, alt('=', '+=', '-=', '*=', '/=', '%='), Expr],
]);

const Stmt = rule($ => [
  FunDecl,
  ValDecl,
  TypeDecl,
  TraitDecl,
  ImplDecl,
  ImportDecl,
  TestDecl,
  ControlStmt,
  AssignStmt,
  Expr,
]);

const Block = rule($ => [
  ['{', many(Stmt), '}'],
]);

const Program = rule($ => [
  [many(Stmt)],
]);

export default defineGrammar({
  name: 'moonbit',
  scopeName: 'source.moonbit',
  tokens: {
    DocComment,
    LineComment,
    AttributeName,
    TryQuestion,
    TryBang,
    LexmatchQuestion,
    DotInt,
    PackageName,
    Float,
    Double,
    Int,
    RegexLiteral,
    Bytes,
    String: StringLiteral,
    MultilineInterp,
    MultilineString,
    Byte,
    Char,
    Ident,
  },
  prec: [
    right('=', '+=', '-=', '*=', '/=', '%='),
    left('|>'),
    right('<|'),
    right('=>'),
    right('->'),
    left('..', '..=', '..<', '..<=', '>..', '>=..'),
    right('||'),
    right('&&'),
    left('|'),
    left('^'),
    left('&'),
    none('==', '!=', '<', '>', '<=', '>=', '=~', 'is'),
    left('<<', '>>'),
    left('+', '-'),
    left('*', '/', '%'),
    right(prefix('!', 'not', '+', '-', 'try', 'raise')),
  ],
  rules: {
    SimplePath,
    TypeName,
    TypeParam,
    TypeParams,
    TypeArgs,
    Type,
    RecordTypeField,
    Binder,
    Param,
    Params,
    Argument,
    AttributeArgument,
    Attribute,
    Literal,
    ArrayItem,
    MapKey,
    RecordField,
    MatchCase,
    ForBinding,
    LexPattern,
    LexCase,
    RegexMatchItem,
    Expr,
    TemplateRhs,
    TemplateField,
    Pattern,
    PatternArgument,
    PatternField,
    ReturnType,
    Visibility,
    Derive,
    FunName,
    FunDecl,
    DeclBody,
    ValDecl,
    TypeHeader,
    TypeDecl,
    TypeAliasTarget,
    FunAliasTarget,
    TypeBody,
    TypeMember,
    TraitDecl,
    TraitMethod,
    TraitBody,
    ImplWithType,
    ImplDecl,
    ImplBody,
    ImportDecl,
    TestDecl,
    ControlStmt,
    AssignStmt,
    Stmt,
    Block,
    Program,
  },
  scopes: {
    'keyword.control.conditional': ['if', 'else', 'match', 'guard', 'lexmatch'],
    'keyword.control.loop': ['for', 'while', 'loop', 'in', 'break', 'continue'],
    'keyword.control.flow': ['return', 'raise', 'throw', 'defer'],
    'keyword.control.exception': ['try', 'catch'],
    'keyword.control.import': ['import', 'using'],
    'storage.type.function': ['fn'],
    'storage.type': ['let', 'letrec', 'const', 'type', 'struct', 'enum', 'enumview', 'extenum', 'trait', 'impl', 'typealias', 'traitalias', 'fnalias', 'suberror', 'test'],
    'storage.modifier': ['pub', 'priv', 'readonly', 'extern', 'mut', 'async', 'declare', 'noraise', 'nobreak'],
    'keyword.operator.expression': ['as', 'is', 'not'],
    'keyword.operator.assignment': ['=', '+=', '-=', '*=', '/=', '%='],
    'keyword.operator.comparison': ['==', '!=', '<', '>', '<=', '>=', '=~'],
    'keyword.operator.logical': ['&&', '||'],
    'keyword.operator.bitwise': ['|', '&', '^', '<<', '>>'],
    'keyword.operator.arithmetic': ['+', '-', '*', '/', '%'],
    'keyword.operator.range': ['..', '..=', '..<', '..<=', '>..', '>=..', '...'],
    'keyword.operator.pipe': ['|>', '<|'],
    'storage.type.function.arrow': ['->', '=>'],
    'punctuation.accessor': ['.', '::'],
    'punctuation.bracket.round': ['(', ')'],
    'punctuation.bracket.curly': ['{', '}'],
    'punctuation.bracket.square': ['[', ']'],
    'punctuation.separator.comma': [','],
    'punctuation.separator.colon': [':'],
    'punctuation.terminator.statement': [';'],
    'constant.language.boolean.true': ['true'],
    'constant.language.boolean.false': ['false'],
    'support.type.primitive': ['Unit', 'Bool', 'Byte', 'Char', 'Int', 'Int64', 'UInt', 'UInt64', 'Float', 'Double', 'String', 'Bytes'],
    'support.class': ['Eq', 'Compare', 'Hash', 'Show', 'Default', 'ToJson', 'FromJson', 'Error'],
  },
  entry: Program,
  expression: Expr,
});
