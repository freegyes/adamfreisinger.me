---
title: 'Internet Radios and a Standalone Concept'
excerpt: From rediscovering internet radio as a form of thoughtful music curation to building a small, single-purpose device that turns on, plays music, and asks nothing more.
tags:
  - music
  - music-technology
  - creation
media:
  hero:
    src: /assets/images/posts/internet-radio-concept/hero-and-thumbnail.jpeg
    alt: A prototype internet radio on a breadboard displaying Radio Paradise
    title: The working prototype
    width: 4032
    height: 3024
    aspect: is-4by3
  thumbnail:
    src: /assets/images/posts/internet-radio-concept/hero-and-thumbnail.jpeg
    alt: A prototype internet radio on a breadboard
    title: The working prototype
    width: 4032
    height: 3024
    aspect: is-4by3
  content:
    themeTime:
      src: /assets/images/posts/internet-radio-concept/theme-time.png
      alt: Screenshot of the Theme Time Radio Hour website showing the Coffee episode
      title: Theme Time Radio Hour - Coffee episode
      width: 1960
      height: 1768
      aspect: is-1by1
    radioParadise:
      src: /assets/images/posts/internet-radio-concept/radio-paradise-main-mix.png
      alt: Screenshot of the Radio Paradise Main Mix interface
      title: Radio Paradise Main Mix
      width: 1920
      height: 1080
      aspect: is-16by9
    eter:
      src: /assets/images/posts/internet-radio-concept/eter-in-toolbar.png
      alt: Screenshot of Eter app in the macOS toolbar showing Radio Paradise
      title: Eter living quietly in my toolbar
      width: 2048
      height: 1448
      aspect: is-16by9
    esp:
      src: /assets/images/posts/internet-radio-concept/esp-unsoldered.jpeg
      alt: An ESP32 development board with unsoldered header pins and a roll of solder
      title: ESP32 dev board ready for soldering
      width: 4032
      height: 3024
      aspect: is-4by3
    wiring:
      src: /assets/images/posts/internet-radio-concept/breadboard-wiring.jpeg
      alt: ESP32 connected to OLED display, amplifier, and speaker on a breadboard
      title: The prototype wired up
      width: 4032
      height: 3024
      aspect: is-4by3
    bowie:
      src: /assets/images/posts/internet-radio-concept/bowie-is-playing.mp4
      poster: /assets/images/posts/internet-radio-concept/bowie-is-playing-poster.jpeg
      alt: Video of the breadboard prototype playing Heroes by David Bowie
      title: Bowie is playing (open for sound)
      type: video
      width: 512
      height: 512
      aspect: is-1by1
    commits:
      src: /assets/images/posts/internet-radio-concept/git-commits.png
      alt: Screenshot of GitHub showing 10 commits on the ESP32 internet radio project
      title: A handful of commits got it working
      width: 2500
      height: 1464
      aspect: is-16by9
---

## Exploring New Music

As the next step in discovering — and re-discovering — my relationship with music, I noticed that from time to time, I want to listen to a fairly wide range of genres with open curiosity. Music with potential.

Where Spotify, YouTube Music, and most recommendation engines fail me is focus. Or rather: too much of it. If I start a [Rival Consoles](https://rivalconsoles.bandcamp.com/) radio, I will mostly get instrumental, low-tempo electronica that gets fairly boring soon. If I try to trick the system by combining my various tastes into a single playlist, the result is usually more annoying than joyful.

User-curated playlists can be better, but they are hit-and-miss. They also require a lot of crate-digging energy before you strike gold. Sometimes that is fun. Often, it is not.

## Theme Time Radio Hour

A few weeks ago, I rediscovered something that reminded me what I love about music discovery: **Theme Time Radio Hour**. In this show, Bob Dylan picks a theme and builds an episode around it using songs, short stories, poetry, and jokes. There are about 100 episodes. It is joyful and heartfelt, especially when contrasted with the joyless, heartless Top10 pop rotations of current FM radios I know. It's not just the music. It is curation with care.

I highly recommend it. Even more so because there used to be a wonderful website listing all the played music, with generous references and links. Thankfully, it has been rescued from the enshittification of the internet by the [Web Archive](https://web.archive.org/web/20140424105231/http://www.themetimeradio.com/).

{% renderMedia media.content.themeTime %}

## Radio Paradise
That ethos stuck with me. And it nudged me back toward internet radio. A thing I used to cherish (even had my own station alongside my DC++ server :D), but have long forgotten.

One of my current favourites is [Radio Paradise – Main Mix](https://radioparadise.com/listen/channels/main-mix), where Porcupine Tree, GoGo Penguin, Khruangbin, and The Doors can coexist peacefully. That alone makes my day. I wholeheartedly recommend this channel if you enjoy discovering music without genre fences.

{% renderMedia media.content.radioParadise %}

## Eter

While Radio Paradise's interface is far better than most stations' I tried, I still felt a bit of friction. I did not want it living as a pinned browser tab. Since, unlike their many ad-ridden counterparts, they openly [publish their stream URLs](https://radioparadise.com/listen/stream-links), it was, on one hand, surprisingly easy to start listening: just toss it in VLC, and it works. On the other hand, it was confusingly non-trivial to get just what I wanted.

My requirements turned out to be:

- almost frictionless access to the stream,
- a way to see what is playing right now (album art is a bonus),
- a way to note music that catches my attention with as little effort as possible

I will spare you the list of apps and half-solutions I tried. The best solution I found so far that works equally well on my Mac, iPad, and iPhone is hands down [Eter](https://eter.apparentsoft.com/). Thank you, dear developer, [Krystian Kozerawski](https://eter.apparentsoft.com/about/), especially for having a one-time-purchase option and not forcing another subscription on me.

{% renderMedia media.content.eter %}

At the moment, Eter lives quietly in my toolbar. Whenever I am in a "let's explore some music" mood, I turn it on. The variety is great. And it is surprisingly fun to try guessing the band before checking the info.

## A Standalone Device

This whole internet-radio rabbit hole made me wonder: What if this experience had a physical form?

A standalone device. In its purest version, it would do exactly one thing. You turn it on, it plays music. It shows what is currently playing. You adjust the volume. Maybe you can keep a small text list of songs that caught your attention. Only physical, single-purpose buttons. No touchscreen. No notifications. No other apps.

It could also solve a very practical problem: how difficult it is for my ageing mother to navigate the ever-changing internet, while still wanting to listen to better shows than what current FM stations offer.

I tried finding existing products, but everything I saw was either convoluted (defeating the idea of dedicatedness), or breathtakingly overpriced.

So I decided to try the DIY route.

{% renderMedia media.content.esp %}

After some research, I picked an ESP32 development board. Built-in Wi-Fi, no extra OS layer, and a good chance of achieving that "instant-on" radio feeling.

To test the concept, I used a small OLED display, a mono amplifier, and a tiny speaker. I wired everything up on a breadboard and hacked together a prototype in a few hours.

{% renderMedia media.content.wiring %}

```
list of components I used in this build:
- ESP32-S3-WROOM-1-N16R8-M development board
- D096-12864-I2C-GV-WH OLED display (0.96", 128×64, SSD1306, I2C)
- MAX98357-M I2S Class-D amplifier module
- 3525-SPKR-4R-3W speaker (4Ω, 3W)
```

## And then it played Radio Paradise!

{% renderMedia media.content.bowie %}

Does it play flawlessly? No. The first three seconds after startup are a garbled mess until some buffers stabilise (I assume). Is the music enjoyable from that tiny speaker? Not really. It distorts and clips, and it gets worse over time, probably because I am feeding a mono signal into something that expects stereo, without proper attenuation. Does it at least have volume control? Not yet. I already connected a rotary knob, but I accidentally used its GPIO pins for the amplifier. That will need fixing. But! About three seconds after getting power, without any further interaction, it connects to my Wi-Fi, starts streaming Radio Paradise, and displays the artist name and song title.

**I had an idea. And now that idea is playing a Bowie song on my breadboard**. I am happy. And I am proud.

## Coding with an Agent

For this experiment, I also wanted to test current paradigm shifts in coding, so I used [Amp](https://ampcode.com/) to create the code. I guided it with text, channelling its vast powers toward something useful for me.

I have mixed feelings about coding with an agent. On one hand, it is incredibly powerful to "just build" something complex using descriptive language. It gives me what I always loved about coding: going from idea to working system quickly. And it hides many of the parts I never enjoyed, like coaxing libraries to behave or guessing undocumented parameters.

On the other hand, it definitely weakens the "I made this!" feeling that usually deepens my emotional connection to the things I build. I still recommend trying it yourself. Especially if you allow yourself to let go of control for a while. If you are curious, the code as it stood at the first "wow, the concept works" moment is [available on GitHub](https://github.com/freegyes/esp32-s3-wroom/tree/d549aef6e5d6a54bfce027571fe17bb199482ebd).

{% renderMedia media.content.commits %}

## Enough for Today
Today, the radio sits on my desk exactly like this: unfinished, slightly flawed, and quietly doing its one job. I turned it on when I wanted music in the morning, and I turned it off when I’d had enough. Maybe I’ll do so again tomorrow.

Maybe that’s the real test. Not whether it becomes a product with a roadmap, but whether it finds a place in my daily life in a way that feels good.

Today, it definitely did — and that feels like enough.