# EVENTORA — Beyond the Ordinary

A responsive event management website for the **K Explore – Web Designing** assignment, *"Design and Develop an Event Management Website"*. Visitors can explore upcoming events, search and filter them, read event details and register through a validated form that shows an instant confirmation.

| | |
|---|---|
| **Live website** | https://quiet-parfait-bee904.netlify.app/ |
| **GitHub repository** | https://github.com/TusharKumar-DS/eventora-k-explore |
| **Author** | Tushar Kumar (Roll No. 24158098) |

## Visual identity

The current design uses a premium editorial style, Space Grotesk headings, DM Sans body text,
refined indigo/coral accents, coordinated light/dark themes, and optimized event photography.

## Features

| Area | What's included |
|---|---|
| Home | Hero section, live stats, a "Happening next" card with a countdown |
| Featured | One large lead card plus compact cards for hand-picked events |
| Browse | Live search (title, venue, city, keywords), category chips, sorting, result count, empty state, "Show past events" toggle |
| Event details | Modal with banner, date, venue, price, seats left, countdown, description and schedule |
| Registration | Name, email, phone, selected event, tickets and terms, all validated with JavaScript |
| Confirmation | Success screen with a reference ID; paid events pass through a clearly labelled simulated checkout |
| My registrations | Stored in `localStorage`; shows status (Confirmed / Event ended) and lets you cancel or remove |
| Responsive | Mobile, tablet and desktop layouts; hamburger menu on small screens |

**Bonus items:** dark/light mode (remembered, follows system preference by default) · event countdown timers ·
animations (scroll reveals, hover effects, modal transitions; disabled when the user prefers reduced motion) ·
Local Storage registration management (live seat counts, duplicate protection, cancel).

## Tech stack
HTML5, CSS3 (custom properties, Grid, Flexbox) and vanilla JavaScript (ES6). No frameworks, no build step, no backend.

## Project structure
```
eventora/
├── index.html          # Page structure and the event/registration modal
├── css/style.css       # Design tokens, layout, light/dark themes, responsive rules
├── js/events.js        # Event data: edit this file to add or change events
├── js/app.js           # Rendering, search/filter, modal, validation, storage, countdown, theme
├── assets/images/     # Optimized event and hero photographs
├── assets/events/     # Original SVG illustrations retained as fallback/reference assets
└── README.md
```

## How it works
1. `js/events.js` holds an array of event objects. Cards are generated from it by `js/app.js`.
2. A small state object (`query`, `category`, `sort`, `showPast`) drives the browse grid, which re-renders on each change.
3. Choosing an event opens a native `<dialog>` with its details and the registration form.
   Event URLs can be shared, e.g. `index.html#event=marathon`.
4. Valid free-event registrations are saved to `localStorage` immediately. Paid-event registrations first pass through a clearly labelled demo checkout; selecting “Simulate successful payment” records a demo-paid status. No real payment is processed.

### Countdowns
One shared timer updates every countdown on the page. Each countdown is tied to its element, so opening several
events in a row never leaves stale timers running.

### Ended events
Events are compared with the visitor's current time. When an event starts:
- it leaves the "upcoming" lists and the hero/featured sections move on to the next event;
- it can still be viewed via **Show past events**, marked *Ended*;
- registration is closed (the form is replaced by a "Registration closed" message) and no countdown is shown;
- an existing registration for it shows *Event ended* and can be removed.

If no events are upcoming, the page shows a friendly "No upcoming events" state. **To keep the site populated, update the
dates in `js/events.js`.**

### Featured vs browse
Events shown in **Featured** are not repeated in the default **Browse** list. Searching or choosing a category
searches *all* events, including featured ones.

## Validation rules
| Field | Rule |
|---|---|
| Name | Letters from any language (accents allowed), spaces, apostrophes, hyphens and full stops; at least 2 letters, max 60 characters |
| Email | Standard `name@domain.tld` format; no spaces, no `< > ( )`, no consecutive/leading/trailing dots in the name part; domain labels use letters, digits and hyphens |
| Phone | 10-digit Indian mobile number starting 6–9. Spaces and hyphens are ignored; a leading `+91`, `0091`, `91` or `0` is accepted and removed |
| Event | Must be selected, and must not have started |
| Tickets | 1 to 5, and no more than the seats left |
| Terms | Must be ticked |
| Duplicates | The same email cannot register twice for the same event |

Error messages are linked to their fields with `aria-describedby`, and invalid fields use `aria-invalid`.
User-entered text is displayed with `textContent`, never inserted as HTML.

## Local Storage limitations
Registrations are saved **only in this browser on this device**. They are not sent to a server, are not shared across
devices or browsers, and disappear if the visitor clears site data or uses a private window. No email or ticket is
sent and no payment is taken: this is a front-end demonstration. Phone numbers and emails are stored in plain text in the browser, so
don't enter real personal data on a shared computer. Corrupted or unexpected stored data is ignored safely.

## Photography and credits

The event cards and hero use locally stored, optimized JPEG images in `assets/images/`.
The images supplied for this project were resized to a maximum dimension of 1200px and
compressed for faster loading. Original source pages and photographer credits are also
available in the website footer under **Photography credits**.

| Local file | Photographer | Source page |
|---|---|---|
| `tech-summit.jpg` | Carlos Gil | https://unsplash.com/photos/speaker-presenting-on-stage-to-an-audience-AsxOJcsaR4g |
| `hack-night.jpg` | Compagnons | https://unsplash.com/photos/people-working-on-laptops-at-a-table-Uywp-JHgVP4 |
| `music-fest.jpg` | Tanya Prodaan | https://unsplash.com/photos/a-crowded-outdoor-music-festival-with-a-stage-KycDD2l0Uqk |
| `classical-eve.jpg` | Tanmay Abhay Mahajan | https://unsplash.com/photos/dancers-in-traditional-indian-attire-perform-on-stage-2yPbQwOfOxk |
| `marathon.jpg` | Miguel Alcântara | https://unsplash.com/photos/runners-in-a-marathon-race-on-a-city-street-nFz4XuVpPD8 |
| `cricket-cup.jpg` | Zoshua Colah | https://unsplash.com/photos/cricket-stadium-with-players-on-the-field-uQMirJC0bVI |
| `design-workshop.jpg` | Vitaly Gariev | https://unsplash.com/photos/team-brainstorming-ideas-on-a-glass-wall-with-sticky-notes-2kHqlCwj35E |
| `ai-bootcamp.jpg` | Nubelson Fernandes | https://unsplash.com/photos/person-coding-on-laptop-workspace-UcYBL5V0xWQ |
| `startup-pitch.jpg` | Julia Potter | https://unsplash.com/photos/woman-speaking-at-business-presentation-KKXkRtD3qIE |
| `career-expo.jpg` | Vitaly Gariev | https://unsplash.com/photos/people-listen-attentively-during-a-business-presentation-m76kVfIRS5U |
| `cultural-fest.jpg` | Janilson Furtado | https://unsplash.com/photos/dancers-in-colorful-festival-costumes-perform-on-stage-yJwzfoxvR14 |
| `photo-walk.jpg` | MChe Lee | https://unsplash.com/photos/people-walking-on-a-street-with-old-buildings-9xQ2kZwjBA0 |
| `hero.jpg` | Felicia Varzari | https://unsplash.com/photos/crowded-outdoor-festival-with-tents-and-people-UxYNdU0jdqQ |

## Run locally
Open `index.html` in a browser, or serve the folder:
```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deployment
- **GitHub Pages:** push the repo, then *Settings → Pages → Deploy from a branch → main / (root)*.
- **Netlify / Vercel:** import the repo; no build command; publish directory is the repo root.

## Accessibility notes
Semantic landmarks, a skip link, labelled fields, visible focus rings, a native modal dialog (Esc closes, focus moves
into the dialog, stays inside it and returns to the trigger when it closes), and `prefers-reduced-motion` support.
A `<noscript>` message explains that JavaScript is required.

## Testing
The V2 baseline was reported by its builder as checked in headless Chromium (Playwright) at 320, 390, 768, 1024, 1366 and 1920 px: no horizontal overflow, search/filter, registration, validation cases, Local Storage persistence and corrupted data, event-expiry behavior at fixed dates, countdown behavior across repeated modal opens, deep links, keyboard focus, and console errors. Not yet checked on real phones, Firefox or Safari.

The post-integration review checked JavaScript syntax, HTML ID uniqueness, local asset references, event image paths, JPEG decoding and CSS parsing. A headless Chromium interaction pass loaded the project's HTML, CSS and JavaScript into an isolated in-memory page and verified: event rendering (8 non-featured events initially), search (`hack` returns one result), Sports filtering (two results), modal opening, required-field errors, Unicode-name acceptance, successful registration confirmation, duplicate-registration blocking, cancellation/removal, theme switching, and no horizontal overflow at 320, 390, 768, 1024, 1366 and 1920px. All 13 supplied JPEG assets loaded successfully; the extra image element in the hidden modal has no source until an event is opened. No JavaScript page errors or console errors were observed during this pass.

**Testing limitation:** the execution environment blocks normal navigation to local/localhost pages. The browser pass therefore used an in-memory page with local assets embedded as data URIs and a temporary Local Storage shim. It verifies the registration and storage logic within the test session, but it does **not** verify persistence across a real page reload on a hosted origin. The earlier V2 baseline's 72 Playwright checks were reported by the builder, not independently reproduced here. Countdown rollover and expiry at a fixed clock, deep-link navigation, actual reload persistence, real phones, Firefox and Safari remain to be verified on a normal browser origin before submission.

## Current project status

The Stage 1 visual redesign and Stage 2 photography integration are implemented in the working project.
A headless Chromium DOM regression pass has been completed, but a normal local-server run, real-device checks,
GitHub publication and live deployment remain pending. Replace the repository and live-site
placeholders above only after those services have actually been configured and verified.

## AI assistance disclosure
AI tools (ChatGPT and Claude) assisted with planning, design, code implementation, testing and review. The student remains responsible for reviewing the project, understanding its implementation and ensuring the final submission follows course rules.
