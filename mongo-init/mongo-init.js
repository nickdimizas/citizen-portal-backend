db = db.getSiblingDB('citizen_portal_db');

db.createUser({
  user: 'appuser',
  pwd: 'app_password',
  roles: [{ role: 'readWrite', db: 'citizen_portal_db' }],
});
