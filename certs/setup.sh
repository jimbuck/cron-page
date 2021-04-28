npx hostile set 127.0.0.1 localhost.dev
npx mkcert create-ca --organization RecordReminderLocal --state Pennsylvania --locality Mechanicsburg
npx mkcert create-cert --domains localhost,127.0.0.1,localhost.dev