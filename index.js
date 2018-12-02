const express = require('express');
const multer = require('multer');
const Pushover = require('pushover-notifications');

const upload = multer({dest: '/tmp/'});
const app = express();

const p = new Pushover({
    user: process.env['PUSHOVER_USER'],
    token: process.env['PUSHOVER_TOKEN']
});

const lastMsg = {};
const emojis = {
    'media.play': '▶️',
    'media.pause': '⏸',
    'media.resume': '⏯',
    'media.stop': '⏹'
};


if (!process.env['PUSHOVER_USER']) {
    throw new Error('Unable to start: PUSHOVER_USER empty');
}
if (!process.env['PUSHOVER_TOKEN']) {
    throw new Error('Unable to start: PUSHOVER_TOKEN empty');
}

app.get('/ping', function (req, res) {
    res.send('pong');
});

app.post('/', upload.single('thumb'), function (req, res) {
    let payload = JSON.parse(req.body.payload),
        msg = {};

    res.send(201);
    if (!emojis[payload.event]) {
        return;
    }

    if (
        lastMsg[payload.Account.id] &&
        lastMsg[payload.Account.id].e === payload.event &&
        lastMsg[payload.Account.id].k === payload.Metadata.key
    ) {
        // Notification already sent!
        return;
    }

    lastMsg[payload.Account.id] = {
        e: payload.event,
        k: payload.Metadata.key
    };


    msg.title = emojis[payload.event] + ' ' + payload.Account.title;

    // Movies
    if (payload.Metadata.librarySectionType === 'movie') {
        msg.message = payload.Metadata.title;
    }

    // TV Shows
    else if (payload.Metadata.librarySectionType === 'show') {
        msg.message = payload.Metadata.grandparentTitle +
            ' S' + (payload.Metadata.parentIndex < 10 ? '0' : '') + payload.Metadata.parentIndex +
            'E' + payload.Metadata.index;
    }

    // Trailer
    else if (payload.Metadata.cinemaTrailer) {
        msg.message = 'Trailer: ' + payload.Metadata.title;
    }

    else {
        return;
    }

    msg.url = 'https://app.plex.tv/web/app#!/server/' +
        payload.Server.uuid + '/details/' +
        encodeURIComponent(payload.Metadata.key);
    msg.url_title = 'View details';

    p.send(msg, function (err) {
        if (err) {
            console.log('Pushover Error:', err);
            res.status(500).send(err);
            return;
        }

        res.sendStatus(201);
    });
});

app.listen(process.env.PORT || 8888);