# Barber Shop Management — Windows

Desktop version built with Electron.

## Default login
- Username: `admin`
- Password: `1234`

Change the password from **الإعدادات** after first login.

## Build locally
```bash
npm install
npm start
npm run dist
```

The Windows installer will be generated in `release/`.

## GitHub
The included GitHub Actions workflow builds the Windows `.exe` automatically on every push to `main`. Open **Actions**, select **Build Windows App**, and download the generated artifact from the completed run.

Data is stored locally in the Windows user's Electron app-data folder, not in the GitHub repository.
