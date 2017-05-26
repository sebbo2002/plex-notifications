const express = require('express'), 
      request = require('request'), 
      multer  = require('multer'),
      Pushover = require('pushover-notifications')

      upload = multer({ dest: '/tmp/' }),
      app = express(),

      p = new Pushover( {
		user: process.env['PUSHOVER_USER'],
		token: process.env['PUSHOVER_TOKEN'],
	  }),

	  emojis = {
	  	"media.play": "▶️",
	  	"media.pause": "⏸",
	  	"media.resume": "⏯",
	  	"media.stop": "⏹"
	  };


app.post('/', upload.single('thumb'), function(req, res, next) {
	let payload = JSON.parse(req.body.payload),
		msg = {};

	if(!emojis[ payload.event ]) {
		return res.send(201);
	}


	msg.title = emojis[ payload.event ] + " " + payload.Account.title;

	// Movies
	if(payload.Metadata.librarySectionType === 'movie') {
		msg.message = payload.Metadata.title;
	}

	// TV Shows
	else if(payload.Metadata.librarySectionType === 'show') {
		msg.message = payload.Metadata.grandparentTitle + 
						" S" + (payload.Metadata.parentIndex < 10 ? "0" : "") + payload.Metadata.parentIndex + 
						"E" + payload.Metadata.index;
	}

	// Trailer
	else if(payload.Metadata.cinemaTrailer) {
		msg.message = 'Trailer: ' + payload.Metadata.title;
	}

	else {
		return;
	}

	msg.url = "https://app.plex.tv/web/app#!/server/" + 
				payload.Server.uuid + "/details/" + 
				encodeURIComponent(payload.Metadata.key);
	msg.url_title = "View details";

	p.send( msg, function(err, result) {
		if( err ) {
			res.status(500).send(err);
		}

		res.sendStatus(201);
	});
});

app.listen(process.env.PORT || 8888);