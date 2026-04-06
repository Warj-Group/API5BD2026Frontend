export default {
  parserPreset: {
    parserOpts: {
      // Adicionamos parênteses no final (.+) para capturar o "subject"
      headerPattern: /^(feat|fix|doc|style|refactor|test|chore|ci)\/(WARJ-\d+|main|sprint-\d+): (.+)$/,
      // Mapeamos os 3 grupos: o tipo, o ID/Branch e a descrição (subject)
      headerCorrespondence: ['type', 'scope', 'subject']
    }
  },
  rules: {
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'type-enum': [2, 'always', ['feat', 'fix', 'doc', 'style', 'refactor', 'test', 'chore', 'ci']]
  }
};