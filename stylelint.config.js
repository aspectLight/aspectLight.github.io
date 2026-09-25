/** BEM: block, block__element, block--modifier, all kebab-case. */
const BEM_CLASS_PATTERN =
  '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$';

export default {
  extends: ['stylelint-config-standard', 'stylelint-config-html/astro'],
  rules: {
    'selector-class-pattern': [
      BEM_CLASS_PATTERN,
      { message: 'Use BEM class names (block__element--modifier).' },
    ],
    'declaration-no-important': true,
    'selector-max-id': 0,
    'color-no-hex': true,
    'max-nesting-depth': 1,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
  },
  overrides: [
    {
      files: ['src/styles/tokens.css'],
      rules: { 'color-no-hex': null },
    },
  ],
};
