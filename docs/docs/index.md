![REDA](img/REDA_logo.png)

[REDA](https://reda-sta.azores.gov.pt/) is an educational resources platform that are available to everyone, helping teachers and students to improve their knowledge and assist teachers during their classes.

## Development dependencies

- npm: v5.3.0
- nodejs: v8.6.0
- mysql v5.7.25
- reactjs: v16.3.2
- redux: v4.0.0

Use "yarn run build" to build for production

## Logs management
Each interaction made with the server via API is stored in a log file, inside the `logs` folder. In order to keep these logs clean, you should run two cronjobs:

```
# Delete log files from REDA
00 02   * * *   root    find <REDA root folder path>/logs* -mtime +365 -type f -delete

# GZIP older log files
00 00   * * *   root    for i in `find <REDA root folder path>/logs -type f | grep -v "$(date +\%Y-\%m-\%d)" | grep -P 'debug-access-'`; do gzip "$i" ; done
```

The first job will delete all files that were created 1 year ago. You can change the `+365` to anything that will meet your requirements, such as `+30` for a month. The number represents the total amount of days since the current day (today).

The second job finds any log files that are before the current day (today) and gzips them. Keep in mind that you must install `gzip` in your Linux distribution. **This job must run in the begining of each new day in order to keep the older logs gzipped.**