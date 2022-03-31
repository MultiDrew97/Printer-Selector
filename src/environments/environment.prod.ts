export const environment = {
  production: true,
  db: {
    user: 'username',
    pass: 'password',
    uri: 'mongodb+srv://{0}:{1}@printer-site.qm713.mongodb.net/Printer-Site?retryWrites=true&w=majority'
  },
  auth: {
    user: 'username',
    pass: 'password'
  },
  emailing: {
    user: 'andrew.warren@austingastro.com',
    pass: 'password',
    from: "AGIT",
    subject: "Printer Installations"
  }
};
