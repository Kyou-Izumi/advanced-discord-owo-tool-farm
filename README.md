# ADVANCED DISCORD OWO TOOL FARM

This is a community version and currently in progress

Please report bugs and keep on track with our announcement!

> `Advanced discord OwO selfbot` is currently in maintenance mode. Future updates focus on bug fixes and improvements rather than new features. Thank you for trusting and being with us throughout the 2-year journey.
>
> If you have any question/suggestion, feel free to submit your idea to us.
> 
> Please report if you have any issue/bug/error while using, I will try my best to help with responsibility.


```
>>> Captcha from owobot.com/captcha is now supported
```

> [!TIP]
> **Check out this discussion: https://github.com/Kyou-Izumi/discord-owo-selfbot/discussions/45**

## Requirement
__Node.js Version:__ v22.11.0 and above

For laptop and PC: Windows 10/11 or higher, Linux and MacOS

For Android: Download and install [Termux](https://f-droid.org/en/packages/com.termux/) 

For IOS: Not yet (please tell us if you know any supporting method)

__Note:__ Termux from Google Play Store is unsupported.

## Installation

### Node.js installation

##### Windows/Linux/MacOS:

Please make sure that you have installed [Node.js LTS](https://nodejs.org/en/download) on your devices.

![Imgur](https://i.imgur.com/swvzF0k.png)

##### Termux:

On Termux, run the following commands:
```bash
apt update
apt upgrade
apt install nodejs-lts
apt install git
```

### Tool installation

[Download and extract the module](https://github.com/Kyou-Izumi/advanced-discord-owo-tool-farm/archive/refs/heads/main.zip) or clone/pull it using [Git](https://git-scm.com/downloads):
```bash
git clone https://github.com/Kyou-Izumi/advanced-discord-owo-tool-farm.git
```

[Open the terminal inside folder](https://www.groovypost.com/howto/open-command-window-terminal-window-specific-folder-windows-mac-linux/) where you downloaded the tool
```bash
cd advanced-discord-owo-tool-farm
```
and run the following command:

```bash
npm install
```
This will install all the requirements (libraries) for the tool to run correctly.

### Get token

Method 1: Follow [this instruction](https://pcstrike.com/how-to-get-discord-token/) to get your account token.

Method 2: Press __Ctrl + Shift + I__ and paste the following function.

```javascript
window.webpackChunkdiscord_app.push([
  [Math.random()],
  {},
  req => {
    if (!req.c) return;
    for (const m of Object.keys(req.c)
      .map(x => req.c[x].exports)
      .filter(x => x)) {
      if (m.default && m.default.getToken !== undefined) {
        return copy(m.default.getToken());
      }
      if (m.getToken !== undefined) {
        return copy(m.getToken());
      }
    }
  },
]);
console.log('%cWorked!', 'font-size: 50px');
console.log(`%cYou now have your token in the clipboard!`, 'font-size: 16px');
```

## Usage

### Normal usage (Interactive Command Line User Interfaces)

For running the tool, please use the following command (inside tool folder)

```bash
npm start
```

If you see the following warning 

![Imgur](https://i.imgur.com/jSTfrOr.png)

Congratulation, you have installed our `Advanced discord OwO tool farm` successfully.

Type "Y", enter and enjoy your time! (The tool will exit if you press enter only)

#### Account Login

We support 2 ways to login: via **token** and **QR Code**

![Imgur](https://i.imgur.com/UwU9Z9B.png)

##### Via token: 

__- Step 1: Get your discord account token__

See [How to get your discord token](#get-token)

__- Step 2: Simply paste your token into the terminal, this will take a while__

![Imgur](https://i.imgur.com/v7LlsSg.png)

##### Via QR Code
Simply scan the QR Code on the screen by your discord mobile and wait patiently...

![Imgur](https://i.imgur.com/xm8F3Cy.png)

### CLI usage (Command Line Interface)

```bash
node . [options]
npm start -- -- [options]

# Example
npm start -- -- -g // generate autorun.json
npm start -- -- -i myfile.json // Trigger auto import and run with given myfile.json
```

#### CLI Options:
```sh
    -g, --generate [filename]
    -i, --import <filename>
    -d, --debug
```

If success, a list of joined servers will be shown up.

__A full tutorial on how to use the tool will be uploaded to Youtube soon!__

## Caution
Recently, there have been reports of hacked accounts and lost currency associated with the use of certain tools. For your safety, it is advised to avoid any kind of obfuscated or suspicious code. Prioritize security and exercise caution when using external code or tools. Stay informed, trust reliable sources, and adopt good security practices to protect your accounts and data.

![Imgur](https://i.imgur.com/dWFr5uv.png)
## Achievements
✔ CLI support

✔ Attempt to solve captcha by using 3rd party captcha-api website

✔ Solve captcha from OwO website (1 week usage for every 10 stars, further info in [discord server](https://discord.gg/Yr92g5Zx3e))

✔ DMs selfbot account to send captcha answer to OwO (user -> selfbot -> OwO)

✔ ~~Use Slash Command~~ [removed due to instability]

✔ Selfbot Commands

✔ Send notification via webhook/DMs/Call

✔ Cool Activities

✔ Prompt sent command with time

✔ Level up with random stored quotes

✔ Unhandled Rejection Handler

✔ Double/Triple spam error Handler

✔ Automatic resume on captcha solved

✔ Automatic loot boxes and use gems

✔ Automatic run/pup/piku randomly

✔ Automatic claim daily reward

✔ Automatic sell animals once cash runs out

✔ Automatic reload configuration daily

✔ Automatic gamble (blackjack/slot/coinflip)

✔ ~~Automatic send/receive, upgrade trait huntbot~~ [removed]

✔ Automatic check for update

✔ Clean code

✔ __Open source__ [halfly]

__-- Coming soon list --__

⬜ Selfbot captcha solving API (No longer 3rd party)

⬜ Huntbot captcha solving API (No longer 3rd party)

⬜ Automatic vote OwO on top.gg (in testing)

⬜ Automatic claim/handle quest and checklog

⬜ Application with UI support

⬜ Application with language support

## Sparkling Soul

We greatly appreciate your support and consideration! Your belief in the power of a star as a donation truly resonates with us. Each click represents not just a simple action, but a meaningful contribution towards our journey.

Your stars serve as fuel for our spirits, igniting our passion and dedication to make a positive impact. With every milestone we achieve, we come closer to realizing our vision of creating a better non-profit endeavors.

Your stars inspire us to keep pushing boundaries, overcome challenges, and bring about meaningful change.

[![Star History Chart](https://api.star-history.com/svg?repos=Kyou-Izumi/discord-owo-selfbot&type=Date)](https://star-history.com/#Kyou-Izumi/discord-owo-selfbot&Date)


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

As we are looking for translators to make the tool and instruction multi-language supports, please open a discussion with translator labels if you'd like to join in!

Please make sure to update tests as appropriate.

## Contact

__Facebook:__ [Nguyễn Thành Long](https://www.facebook.com/profile.php?id=100026454971591)

__Fanpage:__ [Nong ngoo ở đảo Ngố](https://www.facebook.com/profile.php?id=100086422962104)

__Patreon:__ [Click here!](https://patreon.com/DiscordOwOSelfbot)

__PayPal:__ [Click here!](https://www.paypal.me/IzumiKyou)

__Email:__ ntt.eternity2k6@gmail.com

__Join our discord server:__ [Tool Support Server](https://discord.gg/Yr92g5Zx3e)

    Hello there, my name is Eternityy, and I wanted to take a moment to thank you for using our tool.

    Since 2021, this project has been non-profit. But we're still committed to making it the best it can be, 
    
    With APIs like captcha-solving and quoting,... to help make your experience better and more efficient.

    Unfortunately, funding has become an obstacle to our progress. Would you be willing to help us out with a small donation? 
    
    Even the price of a coffee cup can go a long way towards keeping us going. Every little bit helps, means the world to us.

    Thank you for your time and consideration, and we hope you continue to enjoy our tool!

## Acknowledgments
__SPECIAL THANKS TO:__

[Aiko-chan-ai](https://github.com/aiko-chan-ai)

iamz4ri

keepmeside

gillcoder

[awesomebadname](https://github.com/uwuv3)

## License

✨ Licensed under the MIT license.

⛱️ Copyright © EternityVN x aiko-chan-ai 2024

💖 Made by Vietnamese with love

💫 We are BKI members (Baka Island - Đảo Ngố Tàu) 
