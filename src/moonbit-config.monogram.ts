import {
  alt,
  defineGrammar,
  many,
  opt,
  rule,
  token,
} from '../vendor/monogram/src/api.ts';

const digit = String.raw`[0-9]`;
const decimal = String.raw`${digit}[0-9_]*`;
const escape = String.raw`\\(?:['"\\nrtbf/ ]|x[0-9a-fA-F]{2}|o[0-3][0-7]{2}|u[0-9a-fA-F]{4}|u\{[0-9a-fA-F]+\}|.)`;
const identStart = String.raw`[a-zA-Z_\u0080-\uFFFF]`;
const identContinue = String.raw`[a-zA-Z0-9_\u0080-\uFFFF]`;

const ConfigLineComment = token(/\/\/[^\n]*/, {
  skip: true,
  scope: 'comment.line.double-slash',
});
const ConfigPackageAlias = token(new RegExp(String.raw`@${identStart}${identContinue}*(?:\/${identStart}${identContinue}*)*`), {
  scope: 'entity.name.namespace',
});
const ConfigString = token(new RegExp(String.raw`"(?:[^"\\\n]|${escape})*"`), {
  string: true,
  escape: new RegExp(escape),
  escapeValid: new RegExp(escape),
  scope: 'string.quoted.double',
});
const ConfigInt = token(new RegExp(decimal), { scope: 'constant.numeric.integer' });
const ConfigIdent = token(new RegExp(String.raw`${identStart}${identContinue}*`), {
  identifier: true,
});

const ConfigBarePath = rule($ => [
  ConfigIdent,
  [$, '/', ConfigIdent],
]);

const ConfigKey = rule($ => [
  ConfigIdent,
  ConfigString,
]);

const ConfigExpr = rule($ => [
  ConfigString,
  ConfigInt,
  'true',
  'false',
  ['[', many($, opt(',')), ']'],
  ['{', many(ConfigField, opt(',')), '}'],
]);

const ConfigField = rule($ => [
  [ConfigKey, ':', ConfigExpr],
]);

const ConfigArgument = rule($ => [
  [ConfigKey, ':', ConfigExpr],
  ConfigExpr,
]);

const ConfigArguments = rule($ => [
  ['(', many(ConfigArgument, opt(',')), ')'],
]);

const ConfigImportItem = rule($ => [
  [ConfigString, opt(alt(ConfigPackageAlias, ['as', ConfigPackageAlias]))],
  [ConfigIdent, ConfigString],
]);

const ConfigImportItems = rule($ => [
  ['{', many(ConfigImportItem, opt(',')), '}'],
  ['(', many(ConfigImportItem, opt(',')), ')'],
]);

const ConfigImportDecl = rule($ => [
  ['import', opt(ConfigString), ConfigImportItems, opt('for', ConfigString)],
  ['import', ConfigString],
]);

const ConfigAssignDecl = rule($ => [
  [ConfigIdent, '=', ConfigExpr],
]);

const ConfigApplyDecl = rule($ => [
  [alt('options', 'rule', 'dev_build'), ConfigArguments],
  [ConfigIdent, ConfigArguments],
]);

const ConfigModuleDecl = rule($ => [
  ['module', ConfigString],
]);

const ConfigPackageDecl = rule($ => [
  ['package', ConfigBarePath],
]);

const ConfigStatement = rule($ => [
  ConfigImportDecl,
  ConfigAssignDecl,
  ConfigApplyDecl,
  ConfigModuleDecl,
  ConfigPackageDecl,
]);

const ConfigProgram = rule($ => [
  [many(ConfigStatement, opt(';'))],
]);

export default defineGrammar({
  name: 'moonbit-config',
  scopeName: 'source.moonbit.config',
  tokens: {
    ConfigLineComment,
    ConfigPackageAlias,
    ConfigString,
    ConfigInt,
    ConfigIdent,
  },
  rules: {
    ConfigBarePath,
    ConfigKey,
    ConfigExpr,
    ConfigField,
    ConfigArgument,
    ConfigArguments,
    ConfigImportItem,
    ConfigImportItems,
    ConfigImportDecl,
    ConfigAssignDecl,
    ConfigApplyDecl,
    ConfigModuleDecl,
    ConfigPackageDecl,
    ConfigStatement,
    ConfigProgram,
  },
  scopes: {
    'keyword.control.import': ['import'],
    'keyword.control.context': ['for'],
    'storage.type': ['module', 'package'],
    'support.function': ['options', 'rule', 'dev_build'],
    'keyword.operator.expression': ['as'],
    'keyword.operator.assignment': ['='],
    'constant.language.boolean.true': ['true'],
    'constant.language.boolean.false': ['false'],
    'punctuation.bracket.round': ['(', ')'],
    'punctuation.bracket.curly': ['{', '}'],
    'punctuation.bracket.square': ['[', ']'],
    'punctuation.separator.comma': [','],
    'punctuation.separator.colon': [':'],
    'punctuation.separator.path': ['/'],
    'punctuation.terminator.statement': [';'],
  },
  entry: ConfigProgram,
});
