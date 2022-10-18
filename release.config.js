module.exports = {
  extends: '@technologiestiftung/semantic-release-config',
  branches: [
    {
      name: 'main',
    },

    { name: 'staging', channel: 'pre/rc', prerelease: 'rc' },
  ],
  npmPublish: false,
}
