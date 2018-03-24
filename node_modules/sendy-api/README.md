sendy-api
=========

node.js module for Sendy API - [http://sendy.co/api] (http://sendy.co/api)

## Example:

```js
var Sendy = require('sendy-api'),
    sendy = new Sendy('http://your_sendy_installation/', 'your_api_key');

sendy.subscribe({email: "user@example.com", list_id: 'your_list_id'}, function(err, result) {
    if (err) console.log(err.toString());
    else console.log('Success: ' + result);
});
```

## API

#### subscribe

```js
var params = {
    email: 'user@example.com',
    list_id: 'your_list_id'
}

sendy.subscribe(params, function(err, result) {
    if (err) console.log(err.toString());
    else console.log('Subscribed succesfully');
});
```

#### unsubscribe

```js
var params = {
    email: 'user@example.com',
    list_id: 'your_list_id'
}

sendy.unsubscribe(params, function(err, result) {
    if (err) console.log(err.toString());
    else console.log('Unsubscribed succesfully);
});
```

#### status

```js
var params = {
    email: 'user@example.com',
    list_id: 'your_list_id'
}

sendy.status(params, function(err, result) {
    if (err) console.log(err.toString());
    else console.log('Status: ' + result);
});
```

#### countActive

```js
var params = {
    list_id: 'your_list_id'
}

sendy.countActive(params, function(err, result) {
    if (err) console.log(err.toString());
    else console.log('Active subscribers: ' + result);
});
```

#### createCampaign

```js
var params = {
    from_name: 'Your name',
    from_email: 'email@example.com',
    reply_to: 'email@example.com',
    subject: 'Your Subject',
    plain_text: 'Campaign text'  // optional
    html_text: '<h1>Campaign text</h1>',
    send_campaign: 'true' // optional, set to false if you just want to create a draft campaign
    list_ids: 'your_list_id' // seperate multiple lists with a comma. Only required if send_campaign parameter is true
    brand_id: 'your_brand_id' // only required if send_campaign parameter is false
};

sendy.createCampaign(params, function(err,result){
    if (err) console.log(err.toString());
    else console.log(result);
});
```
