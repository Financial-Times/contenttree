![contenttree][logo]
===============

A tree for Financial Times article content.

***

**contenttree** is a specification for representing Financial Times article content as an abstract tree.
It implements the **[unist][unist]** spec.


## Contents

* [Introduction](#introduction)
* [Types](#types)
* [Mixins](#mixins)
* [Nodes](#nodes)
* [TODO](#todo)
* [License](#license)


## Introduction

This document defines a format for representing Financial Times article content as a tree.
This specification is written in a [Web IDL][webidl]-like grammar.


### What is `contenttree`?

`contenttree` extends [unist][unist], a format for syntax trees, to benefit from its [ecosystem of utilities][unist-utilities].

`contenttree` relates to [JavaScript][js] in that it has an [ecosystem of utilities][unist-utilities] for working with trees in JavaScript.
However, `contenttree` is not limited to JavaScript and can be used in other programming languages.


## Types

These abstract helper types define special types a [Parent](#parent) can use as [children][term-child].

### `Node`

```idl
type Node = UnistNode
```

The abstract node.

### `Block`

```idl
type Block = TODO
```

### `Phrasing`

```idl
type Phrasing = Text | Break | Strong | Emphasis | Strikethrough | Link
```

Phrasing nodes cannot have an ancestor of their same type.

TODO: clarify that i mean Strong cannot have an ancestor of Strong etc

## Nodes

### `Parent`

```idl
interface Parent <: UnistParent {
  children: [Node]
}
```

**Parent** (**[UnistParent][term-parent]**) represents a node in contenttree containing other nodes (said to be *[children][term-child]*).

Its content is limited to only other contenttree content.


### `Literal`

```idl
interface Literal <: UnistLiteral {
  value: string
}
```

**Literal** (**[UnistLiteral][term-literal]**) represents a node in contenttree containing a value.

### `Reference`

```idl
interface Reference <: Node {
  type: "reference",
  id: string,
  alt?: string
}
```

**Reference** nodes represent a reference to a piece of external content. The `alt` field is an optional string to be used if the external resource was not available.

### `Root`

```idl
interface Root <: Parent {
  type: "root",
  children: [Body]
}
```

**Root** (**[Parent][term-parent]**) represents the root of a contenttree.

**Root** can be used as the *[root][term-root]* of a *[tree][term-tree]*.

### `Body`

```idl
interface Body <: Parent {
  type: "body",
  children: [Block]
}
```

**Body** (**[Parent][term-parent]**) represents the body of an article. 

(note: `bodyTree` is just this part)

### `Text`

```idl
interface Text <: Literal {
  type: "text"
}
```

**Text** (**[Literal][term-literal]**) represents text.


### `Break`

```idl
interface Break <: Node {
  type: "break"
}
```

**Break** Node represents a break in the text, such as in a poem.


### `ThematicBreak`

```idl
interface ThematicBreak <: Node {
  type: "thematicBreak"
}
```

**ThematicBreak** Node represents a break in the text, such as in a shift of topic within a section.

_Non-normative note: this would be represented by an `<hr>` in the html._


### `Paragraph`

```idl
interface Paragraph <: Parent {
  type: "paragraph",
  children: [Phrasing]
}
```

A **Paragraph** represents a unit of text.

### `Chapter`

```idl
interface Chapter <: Parent {
  type: "chapter",
  children: [Text]
}
```

A **Chapter** represents a chapter-level heading.

### `Heading`

```idl
interface Heading <: Parent {
  type: "heading",
  children: [Text]
}
```

A **Heading** represents a heading-level heading.

### `Subheading`

```idl
interface Subheading <: Parent {
  type: "subheading",
  children: [Text]
}
```

A **Subheading** represents a subheading-level heading.

### `Label`

```idl
interface Label <: Parent {
  type: "label",
  children: [Text]
}
```

A **Label** represents a label-level heading.

- TODO: is this name ok?

### `Strong`

```idl
interface Strong <: Parent {
  type: "strong",
  children: [Phrasing] 
}
```

A **Strong** node represents contents with strong importance, seriousness or urgency.


### `Emphasis`

```idl
interface Emphasis <: Parent {
  type: "emphasis"
  children: [Phrasing]
}
```

An **Emphasis** node represents stressed emphasis of its contents.


### `Link`

```idl
interface Link <: Parent {
  type: "link",
  url: string,
  title: string,
  children: [Phrasing]
}
```

**Link** represents a hyperlink.

### `List`

```idl
interface List <: Parent {
  type: "list",
  ordered: boolean,
  children: [ListItem]
}
```

**List** represents a list of items.

### `ListItem`

```idl
interface ListItem <: Parent {
  type: "listItem",
  children: [Phrasing]
}
```

### `Blockquote`

```idl
interface BlockQuote <: Parent {
  type: "blockquote",
  citation?: string,
  children: [Phrasing]
}
```

A **BlockQuote** represents a quotation and optional citation.


### `PullQuote`

```idl
interface PullQuote <: Node {
  type: "pullQuote",
  source?: string,
  text: string
}
```

A **PullQuote** node represents a brief quotation taken from the main text of an article.

### `Recommended`

```idl
interface Recommended <: Parent {
  type: "recommended",
  title?: "string",
}
```

- A **Recommended** node represents a list of recommended links.
- TODO: this has a list of things and the list items are 


### `ImageSet`

```idl
interface ImageSetReference <: Reference {
  kind: "imageSet",
  imageType: "Image" | "Graphic"
}
```


### `ImageSet`

```idl
interface ImageSet <: Node {
  type: "imageSet",
  alt: string,
  caption?: string,
  imageType: "Image" | "Graphic",
  images: [Image]
}
```

- TODO: should we be using the full url as the `image`/`graphic` (like 'http://www.ft.com/ontology/content/Image')? might be better

### `Image`

- TODO: we want this to look like this [https://raw.githubusercontent.com/Financial-Times/cp-content-pipeline/main/packages/schema/src/picture.ts](https://github.com/Financial-Times/cp-content-pipeline/blob/main/packages/schema/src/picture.ts#L12-L99)
- TODO: should i call this `Picture`???? maybe.

### `TweetReference`

```idl
interface TweetReference <: Reference {
  kind: "tweet"
}
```

A **TweetReference** node represents a reference to an external tweet. The `id` is a URL.

### `Tweet`

```idl
interface Tweet <: Node {
  type: "tweet",
  id: string,
  children: [Phrasing]
}
```

A **Tweet** node represents a tweet.

TODO: what are the valid children here? Should we allow a tweet to contain a hast document root as its child?

### `FlourishReference`

```idl
interface FlourishReference <: Reference {
  kind: "flourish",
  flourishType: string
}
```

A **FlourishReference** node represents a reference to an external **Flourish**.

### `Flourish`

```idl
interface Flourish <: Node {
  type: "flourish",
  id: string,
  layoutWidth: "" | "full-grid",
  flourishType: string,
  description: string,
  fallbackImage: TODO
}
```

A **Flourish** node represents a flourish chart.

### `BigNumber`

```idl
interface BigNumber <: Node {
  type: "bigNumber",
  children: [BigNumberNumber, BigNumberDescription]
}
```

A **BigNumber** node is used to provide a description for a big number. It can contain only one BigNumberNumber and one BigNumberDescription.

### `BigNumberNumber`

```idl
interface BigNumberNumber <: Node {
  type: "bigNumberNumber",
  children: [Phrasing]
}
```

### `BigNumberDescription`

```idl
interface BigNumberNumber <: Node {
  type: "bigNumberNumber",
  children: [Phrasing]
}
```


### `ScrollableBlock`

```idl
interface ScrollableBlock <: Parent {
  type: "scrollableBlock",
  theme: "sans" | "serif",
  children: [ScrollableSection]
}
```

A **ScrollableBlock** node represents a block for telling stories through scroll position.

### `ScrollableSection`

```idl
interface ScrollableSection <: Parent {
  type: "scrollableSection",
  display: "dark" | "light"
  position: "left" | "centre" | "right"
  transition?: "delay-before" | "delay-after"
  noBox?: boolean
  children: [ImageSet | ScrollableText]
}
```

A **ScrollableBlock** node represents a section of a [ScrollableBlock](#scrollableblock)

- TODO: why is noBox not a display option? like "dark" | "light" | "transparent"?
- TODO: does this need to be more specific about its children?
- TODO: should each section have 1 `imageSet` field and then children of any number of ScrollableText?
- TODO: could `transition` have a `"none"` value so it isn't optional?

### `ScrollableText`

```idl
interface ScrollableHeading <: Parent {
  type: "scrollableHeading",
  style: "chapter" | "heading" | "subheading" | "text"
  children: [Paragraph]
}
```

A **ScrollableBlock** node represents a piece of copy for a [ScrollableBlock](#scrollableblock)

- TODO: heading doesn't 
- TODO: i'm a little confused by this part of the spec, i need to look at some scrollable-text blocks
https://github.com/Financial-Times/body-validation-service/blob/fddc5609b15729a0b60e06054d1b7749cc70c62b/src/main/resources/xsd/ft-types.xsd#L224-L263
- TODO: rather than this "style" property on ScrollableText, what if we made these the same Paragraph, Chapter, Heading and Subheading nodes as above?

## TODO

- define all heading types as straight-up Nodes (like, Chapter y SubHeading y et cetera)
- do we need an `HTML` node that has a raw html string to __dangerously insert like markdown for some embed types? <-- YES
- promo-box??? podcast promo? concept? ~content??????~ do we allow inline img, b, u? (spark doesn't. maybe no. what does this mean for embeds?)

### TODO: `LayoutContainer`

TODO: what is this container for? why does the data need a container in addition to the Layout?

### TODO: `Layout`### TODO: `LayoutSlot`### TODO: `LayoutImage`

TODO: okay so we're going to not do this ! we'll be defining ImagePair, Timeline, etc 

### TODO: `Table`

```idl
interface Table <: Parent {
  type: "table",
  children: [Caption | TableHead | TableBody]
}
```

A **Table** represents 2d data.

look here https://github.com/Financial-Times/body-validation-service/blob/master/src/main/resources/xsd/ft-html-types.xsd#L214

maybe we can be more strict than this? i don't know. we might not be able to because we don't know what old articles have done. however, we could find out what old articles have done... we could validate all old articles by trying to convert their bodyxml to this format, validating them etc,... and then make changes. maybe we want to restrict old articles from being able to do anything Spark can't do? who knows. we need more eyes on this whole document.


## License

This software is published by the Financial Times under the [MIT licence](mit).

Derived from [unist][unist] © [Titus Wormer][titus]

[mit]: http://opensource.org/licenses/MIT
[titus]: https://wooorm.com
[logo]: ./logo.png
[unist]: https://github.com/syntax-tree/unist
[js]: https://www.ecma-international.org/ecma-262/9.0/index.html
[webidl]: https://heycam.github.io/webidl/
[term-tree]: https://github.com/syntax-tree/unist#tree
[term-literal]: https://github.com/syntax-tree/unist#tree
[term-parent]: https://github.com/syntax-tree/unist#parent
[term-child]: https://github.com/syntax-tree/unist#child
[term-root]: https://github.com/syntax-tree/unist#root
[term-leaf]: https://github.com/syntax-tree/unist#leaf
[unist-utilities]: https://github.com/syntax-tree/unist#utilities
