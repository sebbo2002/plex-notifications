# plex-notifications
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

Tiny script which sends pushover notifications for plex server events.


### Installation

#### Directly

You'll need [node.js](https://nodejs.org/en/) to run this.

```bash
git clone https://github.com/sebbo2002/plex-notifications.git
cd ./plex-notifications
npm install

PUSHOVER_TOKEN=*** PUSHOVER_USER=*** npm start
```


#### Docker

You can also use the docker container to run this script:

```bash
docker run -p 8888 -e 'PUSHOVER_TOKEN=***' -e 'PUSHOVER_USER=***' sebbo2002/plex-notifications
```


### Configuration

Use environment variables to set your pushover credentials:

<table>
    <tr>
        <th scope="row">PORT</td>
        <td>Server port, defaults to 8888</td>
    </tr>
    <tr>
        <th scope="row">PUSHOVER_TOKEN</td>
        <td>Your pushover token. You can get yours <a href="https://pushover.net/apps">here</a>.</td>
    </tr>
    <tr>
        <th scope="row">PUSHOVER_USER</td>
        <td>Your pushover user token. You can get yours <a href="https://pushover.net/">here</a>.</td>
    </tr>
</table>