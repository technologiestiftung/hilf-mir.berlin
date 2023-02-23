module.exports = {
  extends: '@technologiestiftung/semantic-release-config',
  branches: [
    {
      name: 'main',
    },

    { name: 'staging', channel: 'pre/rc', prerelease: 'rc' },
  ],
  npmPublish: false,
  plugins: [
    [
      '@saithodev/semantic-release-backmerge',
      {
        branches: [{ from: 'main', to: 'staging' }],
        backmergeStrategy: 'merge',
      },
    ],
  ],
}
