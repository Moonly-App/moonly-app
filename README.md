# Moonly 🌙

This is an open-source app built using [VulcanJS](http://vulcanjs.org/). It is a place for discovering and sharing useful content for web developers, designers, marketers, growth hackers etc. 
It is a web app, and it also has [Chrome extension](https://github.com/Moonly-App/moonly-extension) as part of it. 

**Technology stack**: React, GraphQL, Apollo, Meteor

**Live website**: https://moon.ly

**Some of the Features**:

- User registration
- User profile page
- Submit post option
- Commenting
- Likes, Votes
- Filtering posts by category or view (latest, popular etc)
- Tags/Categories
- Save posts to profile
- etc...

![](https://i.imgur.com/I4y7TLL.png)


## Installation


Install the latest version of Node and NPM. We recommend the usage of [NVM](https://github.com/creationix/nvm/blob/master/README.md).

You can then install [Meteor](https://www.meteor.com/install).

Prerequisites for Linux:
```bash
sudo apt install g++
```

To get started: clone this repo

```
git clone https://github.com/Moonly-App/moonly-app

cd moonly-app

npm install

npm start

```

Then refer to the [Vulcan documentation](http://docs.vulcanjs.org/) for further information.


## Dependencies

The Moonly app depends on the following VulcanJS [packages](https://github.com/Moonly-App/moonly-app/blob/master/packages/moonly/package.js#L7-L15):

- `vulcan:core`
- `vulcan:forms`
- `vulcan:forms-upload`
- `vulcan:accounts`
- `vulcan:voting`
- `example-forum`

See also `package.json` for a list of NPM dependencies.


## Usage

Check this [video tutorial](https://www.youtube.com/watch?v=-Ndiqsoza1E) on how to use Moonly app and extension.



## Contributing guidance

**All PRs should be made to the `develop` branch, not `master`.**

Before going ahead with customizing components and creating new features, please have in mind that you should

**Never edit original core Vulcanjs packages!** You should only change what's inside the Moonly package.

Check [this part](http://docs.vulcanjs.org/example-customization.html) of documentation to see how to customize existing and create new features.


## Getting help

If you have questions, concerns, bug reports, etc, please file an issue in this repository's issue tracker. 

## Stay In Touch


- [Vanila.io community chat](https://chat.vanila.io/channel/moonly-os)
- [Vulcan.js community chat](http://slack.vulcanjs.org/)

## Credits and references

- [Vanila.io](https://vanila.io) : Team which created and maintain the Moonly app.

| [<img src="https://avatars2.githubusercontent.com/u/8379017?s=460&v=4" width="100px;"/><br /><sub><b>Jelena Jovanovic</b></sub>](https://github.com/jelenajjo)<br /><br />[<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/instagram_circle-256.png" width="18px;"/>](https://instagram.com/plavookac) [<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-256.png" width="18px;"/>](https://twitter.com/plavookac) [<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/youtube_circle-256.png" width="18px;"/>](https://youtube.com/c/plavookac) | [<img src="https://avatars3.githubusercontent.com/u/8284972?s=460&v=4" width="100px;"/><br /><sub><b>Abu Taher</b></sub>](https://github.com/entrptaher)<br /><br />[<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/instagram_circle-256.png" width="18px;"/>](https://instagram.com/entrptaher) [<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-256.png" width="18px;"/>](https://twitter.com/entrptaher) [<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/facebook_circle-256.png" width="18px;"/>](https://www.facebook.com/entrptaher) | [<img src="https://avatars0.githubusercontent.com/u/1984909?s=460&v=4" width="100px;"/><br /><sub><b>Stefan Smiljkovic</b></sub>](https://www.github.com/shtefcs)<br /><br />[<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/linkedin_circle-256.png" width="18px;"/>](https://www.linkedin.com/in/stefan-smiljkovic-196abb30/) [<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-256.png" width="18px;"/>](https://twitter.com/shtefcs) [<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/facebook_circle-256.png" width="18px;"/>](https://www.facebook.com/stefan.smiljkovic) | [<img src="https://cdn.dribbble.com/users/914722/avatars/small/ae6a55c06a4fdea7301bb328912d007a.png?1483854374" width="100px;"/><br /><sub><b>Vijay Verma</b></sub>](http://vijayverma.co/)<br /><br /> [<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/instagram_circle-256.png" width="18px;"/>](https://instagram.com/realvjy) [<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-256.png" width="18px;"/>](https://twitter.com/realvjy) [<img src="https://cdn1.iconfinder.com/data/icons/social-icon-1-1/512/social_style_1_dribb-256.png" width="18px;"/>](https://www.dribbble.com/realvjy)|
| :---: | :---: | :---: | :---: |
  
- [Vulcan.js](https://vulcanjs.org) : The full-stack React+GraphQL framework which is OS as well and Moonly is built with it.
  
| [<img src="https://pbs.twimg.com/profile_images/2487116271/j8ehsrukq7v6bh6tswfc_400x400.png" width="100px;"/><br /><sub><b>Sacha Greif<br/>VulcanJS Creator</b></sub>](https://github.com/SachaG)<br /><br />[<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/instagram_circle-256.png" width="18px;"/>](https://instagram.com/sachagreif) [<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-256.png" width="18px;"/>](https://twitter.com/SachaGreif) [<img src="https://cdn1.iconfinder.com/data/icons/social-icon-1-1/512/social_style_1_dribb-256.png" width="18px;"/>](https://dribbble.com/c/sacha) |
  | :---: |

## Contributors

Join us in contributions and your name will be listed here as well! Thank you for support! :heart: 

| [<img src="https://avatars3.githubusercontent.com/u/12301022?s=460&v=4" width="100px;"/><br /><sub><b>Vladimir Jovanovic</b></sub>](https://github.com/VladimirDev93)<br /><br />[<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/instagram_circle-256.png" width="18px;"/>](https://instagram.com/whyse_man) [<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-256.png" width="18px;"/>](https://twitter.com/_WhyseMan_) [<img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/linkedin_circle-256.png" width="18px;"/>](https://www.linkedin.com/in/vladimirdev/)|
| :---: |
