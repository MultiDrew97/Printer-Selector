// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  db: {
    user: 'sysadmin',
    pass: 'SoliDeoGLoria10',
    uri: 'mongodb+srv://{0}:{1}@printer-site.qm713.mongodb.net/Printer-Site-Test?retryWrites=true&w=majority'
  },
  auth: {
    user: 'sysadmin',
    pass: 'SoliDeoGloria10'
  },
  emailing: {
    user: 'andrew.warren@austingastro.com',
    pass: 'JasmineLove2697',
    from: "AGIT",
    subject: "Printer Installations"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
