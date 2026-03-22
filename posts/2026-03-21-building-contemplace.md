---
title: 'Building a Home for My Stray Ideas'
excerpt: I built a system that captures idea fragments and gardens them into a searchable knowledge graph. A few days in, a captured word sent me on a walk I wasn't planning.
tags:
  - creation
  - tools
media:
  hero:
    src: /assets/images/posts/building-contemplace/cluster-discovery-hero.png
    alt: Dashboard showing thematic clusters of idea fragments as force-directed graphs
    title: Clusters of connected fragments
    width: 3064
    height: 1934
    aspect: is-16by9
  thumbnail:
    src: /assets/images/posts/building-contemplace/bohonc-tree-walk-thumbnail.jpg
    alt: A person looking up at a massive ancient tree
    title: The böhönc tree walk
    width: 3024
    height: 2268
    aspect: is-4by3
  content:
    telegramCapture:
      src: /assets/images/posts/building-contemplace/telegram-capture.png
      alt: Telegram conversation showing a photo of an ancient tree with a note about the Hungarian word böhönc, and the bot's structured reply with title, tags, and a link to a related note
      title: Capture in action
      width: 554
      height: 985
      aspect: is-9by16
    clusterDiscovery:
      src: /assets/images/posts/building-contemplace/cluster-discovery-hero.png
      alt: Dashboard cluster view showing the böhönc capture clustered with a note about unusual words in a force-directed graph
      title: The gardener clustered them overnight
      width: 3064
      height: 1934
      aspect: is-16by9
    semanticExploration:
      src: /assets/images/posts/building-contemplace/semantic-exploration.png
      alt: Claude.ai searching for tree-related notes and returning direct tree connections and unexpected wood and material connections
      title: One prompt, and the agent traverses the knowledge base
      width: 1950
      height: 1974
      aspect: is-1by1
    bohoncTreeWalk:
      src: /assets/images/posts/building-contemplace/bohonc-tree-walk.jpg
      alt: A massive ancient tree with a split trunk, covered in ivy, with a person standing next to it for scale
      title: My own böhönc by the river
      width: 3024
      height: 4032
      aspect: is-3by4
    githubRepo:
      src: /assets/images/posts/building-contemplace/github-repo.png
      alt: The ContemPlace GitHub repository showing the project structure, recent commits, and description
      title: The repository, public from day zero
      width: 3064
      height: 1934
      aspect: is-16by9
---

I notice things. A weird-sounding word in a book I'm reading. An urge to understand how drone flutes work. An odd graffiti that keeps popping up in my neighbourhood. These aren't plans or tasks. They're fragments. And the part of my thinking that I really enjoy happens between them, in the sometimes accidental, organic connections that I make as I ponder about them.

I have been taking notes for as long as I can remember. Yearly bullet journals, Evernote, Obsidian, Bear, Apple Notes, and I even have a [Johnny Decimal](https://johnnydecimal.com/) index. For the structured parts of life, these work. But for creative fragments, reflections, stray observations, nothing held. Every system either asked me to organise a lot (my brain ran faster than my organisational patience, so the spark would be gone) or let me dump things in and never surface them again.

About six weeks ago, three tools I was already using fit together in a way I didn't plan. [Wispr Flow](https://wisprflow.ai/r?ADAM22995) for voice dictation. [Claude Code](https://docs.anthropic.com/en/docs/claude-code) for building things through conversation. And an [Obsidian](https://obsidian.md/) vault with [Smart Connections](https://smartconnections.app/), a plugin that vector-embeds notes and exposes them to AI tools through [MCP](https://modelcontextprotocol.io/). I could dictate a thought, and Claude would find how it connected to things I'd written weeks ago. Capture and connection happened in the same place for the first time. That felt like something.

## From my desk to my pocket

I started using the combination and building on it at the same time. Voice in, structured fragment out, a link to an older note I'd forgotten about. That loop was exciting. But it only worked at my desk. Obsidian had to be running, Claude Code had to be open, and I had to be physically there, while I kept having ideas away from it.

So I started building a solution I could reach from anywhere. This was not a weekend hack. It took about two weeks of focused work, dozens of architectural decisions, a lot of iteration and rethinking. But I could use it from day one, even while it was rough, and that kept the momentum going. I call it [ContemPlace](https://github.com/freegyes/project-ContemPlace).

ContemPlace captures idea fragments in my own voice through a Telegram bot. I send a message, sometimes a photo, and the system structures it: title, body, tags, links to related notes. Everything gets vector-embedded for semantic search. My raw words are always preserved alongside the structured version.

Overnight, an automated gardener runs. It compares every fragment against every other by embedding similarity, creates connections I didn't explicitly make, and groups notes into thematic clusters using Louvain community detection. The next time I or any AI tool explores the knowledge base, the graph is richer than what I put in. The system speaks MCP, so my notes travel with me across tools. They aren't trapped in any vendor's memory.

## Böhönc

Here is what it actually feels like when it works.

I'm browsing the internet and I spot the word "böhönc." Hungarian for ancient trees that have overgrown their neighbours. I love that. I take a screenshot, open Telegram, and send the photo with a one-line note to my capture bot:

> very old trees that have overgrown their neighbours have a name in Hungarian: "böhönc", think like ents of Middle Earth

A few seconds later, the bot replies.

{% renderMedia media.content.telegramCapture %}

The title is a claim extracted from my words: Böhönc: Hungarian word for ancient trees that have overgrown their neighbours. Four tags. And a link. The system embedded my raw text, searched for semantically similar notes, and the capture agent decided a connection existed to a note about a book that uses unusual, evocative words. I didn't ask for that. My photo is stored. My exact words are preserved. I close Telegram and I don't think about organisation or administration at all.

That night at 2am, the automated gardener wakes up. The capture agent had already found one connection at the moment I sent the message, but it only saw the top few candidates and only compared against what existed at that point. The gardener is different. It looks at everything at once, compares every note to every other note, and works in bulk. It creates similarity links between fragments that are close in meaning. Then it does something the capture agent can't: it runs Louvain community detection on the full similarity graph, grouping notes into thematic neighbourhoods based on how closely they relate across the entire corpus.

My böhönc fragment ends up clustered with the note about unusual words. I didn't organise this. I didn't tag them the same way on purpose. The semantic proximity was enough. And the cluster reveals something I hadn't consciously noticed: I didn't just like the tree. I liked the *word*. The thread running through these fragments is my attraction to rare, evocative vocabulary. I can see this on my dashboard, a web interface I built for browsing clusters visually.

{% renderMedia media.content.clusterDiscovery %}

Days later, I'm in a Claude session. Claude has no memory of me, but it has an MCP connection to my ContemPlace, so it can query my entire knowledge base as if it had already built an extensive memory of me. I've just seen a forest I liked. On impulse, I type: "I saw a great looking forest, and that made me think about trees in general. Search my notes for trees, check for anything related, see what comes up!"

{% renderMedia media.content.semanticExploration %}

The böhönc capture comes back. But so do notes I'd nearly forgotten: someone making prints from cross-sections of felled trees, an idea about making a drone flute by routing, wooden board games. The agent organises them into "direct tree connections" and "wood/material connections" without being told to. I hadn't thought of these things together. The instrument idea was from weeks ago, the board games from a different context entirely. But the embedding space puts them in the same neighbourhood, and the agent traverses it in one call.

I finish my coffee. My morning walk, which was going to be a routine stroll, now has a destination. Yesterday I noticed a huge tree by the river that had split in two. And something clicks. Could I make a print from its cross-section? Could a piece of it become material for an instrument or a board game I will be making soon, maybe even with a hidden nod to a böhönc, as another layer of connections?

The system didn't send me there. It didn't recommend a walk. It reminded me why I'd want to go, by connecting a word I liked to a material I work with to a craft I practice. A fragment I captured days ago, without thinking about it, became a thread that pulled me into the physical world.

{% renderMedia media.content.bohoncTreeWalk %}

## Why I built it

The short answer is that I enjoy building. Building is how I think through problems and how I understand things. I could probably have assembled something close enough from existing products. Maybe Obsidian on a VPS would have worked. A few days ago, Anthropic announced ways to connect a Telegram bot to a remote Claude Code session. If that had existed three weeks earlier, I might not have started.

But building it gave me things that a ready-made product wouldn't. I know exactly what happens to my data. I know why the capture agent is forbidden from adding conclusions I didn't express. I know how reassuring it is that my raw input is always preserved, so I can recompute everything from first principles if I find a better way later.

A delightful detail from development: the development process could directly use ContemPlace for mining product ideas about itself, a kind of recursive dogfooding I enjoyed on a very meta level. 

The [repo](https://github.com/freegyes/project-ContemPlace) has been public from day zero, and every [design decision](https://github.com/freegyes/project-ContemPlace/blob/main/docs/decisions.md) and the [core philosophy](https://github.com/freegyes/project-ContemPlace/blob/main/docs/philosophy.md) are documented extensively.

## A door left open

I'm proud that I built this, and I enjoy using it daily. I don't know what it will become. 

I'm at the point in this project where my excitement is levelling off and my mind starts noticing new things outside its domain. Fewer new features from here. More real use, more observing how it shapes my thinking over a longer stretch.

If this made you curious, or if you recognise the itch from the opening paragraphs, the [repository](https://github.com/freegyes/project-ContemPlace) is public. You can have your own instance running in about half an hour, for virtually nothing. If it inspires you to build your own version, or to think differently about how you capture your ideas, or if it just sends you down an interesting train of thought, I would enjoy hearing about it.

{% renderMedia media.content.githubRepo %}

Böhönc. An ancient tree that outgrew everything around it. I found the word on a screen, sent it to a bot, and a week later it sent me on a walk. That's the whole thing.

---

## ContemPlace — Under the Hood

Cloudflare Workers (TypeScript) for compute. Supabase (Postgres with pgvector) for storage. OpenRouter for LLM calls. Cloudflare Pages for the dashboard. Four Workers handle the Telegram webhook, the MCP server, the nightly gardener, and the dashboard API. Everything except the LLM calls runs on free tiers. Running cost with daily use: about two to three dollars a month.

The MCP server exposes tools for: semantic search, single-note retrieval, related-note traversal, recent captures, cluster listing, capture, remove, and on-demand gardening. Any MCP-compatible tool can connect and query the full knowledge base. The [repository](https://github.com/freegyes/project-ContemPlace) has detailed documentation on every layer, from the [capture pipeline](https://github.com/freegyes/project-ContemPlace/blob/main/docs/capture-agent.md) to the [gardening algorithms](https://github.com/freegyes/project-ContemPlace/blob/main/docs/architecture.md) to the [setup guide](https://github.com/freegyes/project-ContemPlace/blob/main/docs/setup.md) for deploying your own instance.
