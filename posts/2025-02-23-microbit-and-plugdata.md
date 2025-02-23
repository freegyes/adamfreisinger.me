---
title: Waving My Hand and Hearing Sound Respond in Real-Time
excerpt: What if I could shape sound with just a wave of my hand? That was the question I set out to explore, and plugdata has given me a glimpse into new creative possibilities. With an old micro:bit, a bit of Python, and some Pure Data magic, I watched—no, felt—sound respond to my movement in real-time. It’s a small step, but one that’s bringing me closer to crafting my own expressive instrument.
tags:
  - music-technology
  - sound-design
  - creative-coding
media:
  hero:
    src: /assets/images/posts/microbit-and-plugdata-hero.jpg
    alt: A micro:bit in my palm, plugged into a computer, with a heart displayed on its LEDs
    title: Patching sound with motion
    width: 1920
    height: 1080
    aspect: is-16by9
  thumbnail:
    src: /assets/images/posts/microbit-and-plugdata-thumbnail.jpg
    alt: A micro:bit in my palm, plugged into a computer, with a heart displayed on its LEDs
    title: A microcontroller meets modular sound
    width: 1024
    height: 768
    aspect: is-4by3
  content:
    img01:
      src: /assets/images/posts/microbit-and-plugdata-01.jpg
      alt:  A screenshot of MakeCode editor
      title: MakeCode editor for uploading to micro:bit
      width: 1024
      height: 768
      aspect: is-4by3
    img02:
      src: /assets/images/posts/microbit-and-plugdata-02.jpg
      alt:  A screenshot of Visual Studio Code
      title: The Python bridge script sending data
      width: 1024
      height: 768
      aspect: is-4by3
    img03:
      src: /assets/images/posts/microbit-and-plugdata-03.jpg
      alt:  A screenshot of plugdata
      title: The plugdata patcher receiving parameters
      width: 1024
      height: 768
      aspect: is-4by3
---

## plugdata
For the past two weeks, I’ve been diving into [plugdata](https://plugdata.org/), a modern reimagining of Pure Data, a "visual programming environment designed for sound experimentation, prototyping, and education". If you've ever been fascinated by modular synths, interactive sound design, or generative music, plugdata makes these ideas instantly accessible, so it instantly won me over.

It offers the same enjoyment for me that working with modular synthesizers (both in the physical world and via emulations like [vcvrack](https://vcvrack.com/)) or the [Empress Zoia](https://empresseffects.com/products/zoia) always had. I love modular thinking—connecting objects, seeing the flow of information—and plugdata aligns perfectly with that mindset.

## The Catalyst: A Local Workshop on Electronic Instruments

I’ve been experimenting with music, instruments, and coding for years, but two weeks ago, I stumbled upon a three-part [electronic instrument workshop](https://adapterujbuda.hu/hangszerepito-kurzus/) nearby. The first session introduced the fundamentals of sound synthesis in [Max](http://cycling74.com/)—and just like that, I was all in again.

The workshop reignited something in me—this desire to build something that exists outside of a traditional computer setup, something tangible and expressive. That led me down a rabbit hole of research into embeddable systems that could support the kind of instruments I want to build. That’s how I landed on the [Electrosmith Daisy Seed](https://electro-smith.com/products/daisy-seed), a powerful microcontroller designed for audio applications. It can host Pure Data patches (converted to C++), meaning I could eventually run my creations as standalone instruments—no laptop required. That vision became my new north star. But before I could get there, I wanted to test something simpler: how motion could shape sound in real-time.

## Bringing Motion into the Equation

After spending hours patching in plugdata, I wondered—what if I could control sound with motion? I had an early version of a [micro:bit](https://microbit.org/) lying around, which has a built-in accelerometer. The idea was simple: use the XYZ coordinates of the micro:bit's accelerometer to modify parameters in my patch.

To make this work, I:
- flashed a custom JavaScript program onto the micro:bit to continuously send accelerometer data,
- ran a Python script using [python-osc](https://pypi.org/project/python-osc/) to translate motion data into a format plugdata can read, and 
- modified my plugdata patch to receive, filter, and scale the motion data to control sound in real-time.

{% mediaGrid %}
  {% gridMedia media.content.img01, "column is-3" %} 
  {% gridMedia media.content.img02, "column is-3" %} 
  {% gridMedia media.content.img03, "column is-3" %}
{% endmediaGrid %}


## A Tiny Card, a Big Feeling

And then, it worked.

<figure class="image is-16by9 block">
  <iframe
    class="has-ratio"
    width="560"
    height="315"
    src="https://www.youtube.com/embed/JhcDPnzj3jU?si=D3seO8Nk-e73dnZJ"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen
  ></iframe>
</figure>

I lifted my hand, tilting the tiny card ever so slightly. Instantly, the sound shifted—trembling, bending, shimmering—like a living thing responding to my touch. For a moment, it felt like I was sculpting sound in mid-air. Pure magic.

It reminded me of watching [Imogen Heap’s Tiny Desk performance](https://www.youtube.com/watch?v=3QtklTXbKUQ&t=689s), where she demonstrated her MiMU gloves. That performance was one of many inspirations that planted a seed in my mind years ago—of making music in a way that feels fluid, intuitive, and physically expressive.

## Code & Patch Downloads

For anyone interested in taking a closer look at this setup, find my experimental code and patcher [here](https://gist.github.com/freegyes/db35bc8d0b530abe511fdf8a1d54cdd7).


## Takeaways & Next Steps

This was a small experiment, but it opened up so many possibilities. What if I combine this with other sensors? What if I replace the micro:bit with a more powerful and versatile device? What if the instrument I eventually build is less about pushing buttons and more about sculpting sound in space?

This was just a small wave of my hand, but it felt like a giant step toward something bigger—an instrument that blends woodworking, sound, coding, and visuals into something truly expressive. I’m hooked.

## If You’re Curious

If Max, Pure Data, or plugdata sounds like your kind of thing, [Takumi Ogata](https://www.takumiogata.com/)’s [Sound Simulator YouTube series](https://www.youtube.com/watch?v=1o5Wasmd8yU&list=PLyFkFo29zHvD4eRftIAjcLqIXCtSo7w8g&ab_channel=SoundSimulator) has been my main guide so far, and I can’t recommend it enough—and if you end up experimenting with it, I’d love to hear what you create.