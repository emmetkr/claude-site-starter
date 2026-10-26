# Reference

What Claude studies before it designs. Two kinds of thing go here.

## 1. Design systems

Clone the list of public design systems:

```
git clone https://github.com/alexpate/awesome-design-systems reference/awesome-design-systems
```

It is one README with about 140 systems (Adobe Spectrum, Shopify Polaris, GitHub Primer, Atlassian and more), each linking to its documentation and, where public, its source code.

Then, in Claude Code:

> Open reference/awesome-design-systems/README.md. Pick three systems close to what we are building and read their type scale, spacing and button rules. Summarise what they agree on, then use those proportions for our site.

## 2. Sites you like

In Chrome or Safari: File → Save Page As → "Web Page, Complete". Save into this folder, one subfolder per site:

```
reference/
  awesome-design-systems/
  stripe-com/
  linear-app/
  rogo-com/
```

Then: "Read the three saved sites in reference/. Note the type sizes, the section spacing and how they handle phones. Use those proportions for our site."

These files are for study. Do not copy text, images or logos from them into your site.
