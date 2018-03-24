var
    req = require('request'),
    querystring = require('querystring'),
    prty;

module.exports = function(url, apiKey) {
    this.url = url;
    this.apiKey = apiKey;
}

prty = {
    subscribe: function(o, cb) {
	if (this.paramsOk(o, cb)) {
	    o.list = o.list_id;
	    delete o.list_id;
	    this.request('subscribe', o, this.getSub(cb));
	}
    },
    unsubscribe: function(o, cb) {
	if (this.paramsOk(o, cb)) {
	    o.list = o.list_id;
	    delete o.list_id;
	    this.request('unsubscribe', o, this.getSub(cb));
	}
    },
    paramsOk: function(o, cb) {
	if (!o.email) {
	    cb(new Error('Email address is missing'), null);
	    return false;
	} else if (!o.list_id) {
	    cb(new Error('List ID is missing'), null);
	    return false;
	}
	return true;
    },
    getSub: function(cb) {
	return function(err, response, body) {
	    if (err) cb(err, null);
	    else {
		if (body === '1') cb(null, true);
		else cb(new Error(body), null);
	    }
	}
    },
    status: function(o, cb) {
	if (this.paramsOk(o, cb)) {
	    o.api_key = this.apiKey;
	    this.request('api/subscribers/subscription-status.php', o, function(err, response, body) {
		if (err) cb(err, null);
		else {
		    var success = ['Subscribed', 'Unsubscribed', 'Unconfirmed', 'Bounced', 'Soft bounced', 'Complained'];
		    if (success.indexOf(body) === -1) cb(new Error(body), null);
		    else cb(null, body);
		}
	    });
	}
    },
    countActive: function(o, cb) {
	if (!o.list_id) cb(new Error('List ID is missing'), null);
	else {
	    o.api_key = this.apiKey;
	    this.request('api/subscribers/active-subscriber-count.php', o, function(err, response, body) {
		if (err) cb(err, null);
		else {
		    var success = parseInt(body, 10);
		    if (success.toString() === body) cb(null, success);
		    else cb(new Error(body), null);
		}
	    });
	}
    },
	createCampaign: function(o,cb) {
	if (!o.from_name) cb(new Error('Missing "from_name" parameter'), null);
	if (!o.from_email) cb(new Error('Missing "from_email" parameter'), null);
	if (!o.reply_to) cb(new Error('Missing "reply_to" parameter'), null);
	if (!o.subject) cb(new Error('Missing "subject" parameter'), null);
	if (!o.html_text) cb(new Error('Missing "html_text" parameter'), null);
	if (o.send_campaign) {
		o.send_campign = 1;
		if (!o.list_ids) cb(new Error('Missing "list_ids" parameter'));
	}
	if (!o.send_campign) {
		o.send_campign = 0;
		if(!o.brand_id) cb(new Error('Missing "brand_id" parameter'));
	} 
	else {
		o.api_key = this.apiKey;
		this.request('api/campaigns/create.php', o, function(err,response,body){
		if (err) cb(err,null);
		else {
			var success = ['Campaign created','Campaign created and now sending'];
			if (success.indexOf(body) === -1) cb(new Error(body), null);
			else cb(null,body);
		}
		});
	}
	},

    request: function(path, params, cb) {
	params.boolean = true;
	req({
	    method: "POST",
	    headers: {
		"Content-Type": "application/x-www-form-urlencoded"
	    },
	    url: this.url + path,
	    body: querystring.stringify(params)
	}, cb);
	    
    }
};

for (var k in prty) module.exports.prototype[k] = prty[k];


