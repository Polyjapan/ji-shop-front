// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiurl: 'https://shop.japan-impact.ch/api',
  tokenWhitelist: ['shop.japan-impact.ch'],
  sumUpKey: '55e6df95-c448-495c-8c34-71702835d02c',
  sumUpApp: 'japan_impact',
  baseUrl: 'https://shop.japan-impact.ch',

  auth: {
    apiurl: 'https://auth.japan-impact.ch/',
    clientId: '8pdszcUWxht75pmttKnyAxxHzc9HarutYvScP6uHq5WsDXJqGfQcWeCRHGZgHwtGE9dQvKgu'
  },
  reCaptcha: {
    siteKey: '6LclcWoUAAAAAAcrg1eRSxLCIIX5-k3FYkZGoyAV'
  }
};
