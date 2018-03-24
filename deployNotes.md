## Step 1
- clone this branch,
- or cd into `~/new-links-app` and do `git pull`

## Step 2

Build this using 8.5.0 version, locally or on the server, if built locally, then upload the whole etherapp_3008_3009 folder and the contents,

```
cd MoonlyApp
nvm use 8.5.0
sh build.sh
cd ../moonly_3003
```
it is using 3003 port
on moonly_3003 folder,

```
nvm use 4.6.1
sh makeusable.sh
nvm use 8.5.0
sh run.sh
```

The whole thing in one line for lazy persons.
If you are running for first time, make sure you have pm2 and nvm installed.
