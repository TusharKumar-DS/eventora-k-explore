# EVENTORA — Pre-deployment QA report

**Build reviewed:** Stage 2 photography-integrated project  
**Review date:** 6 November 2026  
**Purpose:** Internal verification before GitHub publication and live deployment.

## Verified in this review

| Check | Result | Method |
|---|---|---|
| Project structure | PASS | ZIP/source inspection |
| HTML IDs | PASS — no duplicates | HTML parser |
| JavaScript syntax | PASS | Node.js syntax check |
| CSS parsing / balanced structure | PASS | Source parser/check |
| 12 event records | PASS | `js/events.js` inspection |
| 13 JPEG assets | PASS | File inspection and decode |
| Event image references | PASS | Compared event data to asset files |
| Search | PASS | Headless Chromium interaction; `hack` returned one result |
| Category filtering | PASS | Headless Chromium interaction; Sports returned two results |
| Event modal | PASS | Headless Chromium interaction |
| Required-field validation | PASS | Empty submission showed validation error |
| Unicode name | PASS | `José Álvarez` accepted in valid registration flow |
| Successful registration | PASS | Confirmation state shown |
| Duplicate registration prevention | PASS | Same email/event rejected |
| Cancellation/removal | PASS | Registration removed after confirmation |
| Theme toggle | PASS | Theme attribute changed to dark |
| Responsive horizontal overflow | PASS | No overflow at 320, 390, 768, 1024, 1366 and 1920 CSS px |
| Browser runtime errors | PASS | No page errors or console errors during tested flow |

## Not yet verified on a normal hosted origin

- Local Storage persistence after a real page reload.
- Countdown rollover and expiry using a controlled system clock.
- Deep-link behavior during real address-bar/hash navigation.
- Firefox and Safari.
- Physical Android/iOS devices and touch behavior.
- Actual GitHub repository and live deployment.
- Any additional instructions that may exist in the linked Google Doc but are not present in the supplied DOCX.

## Environment limitation

This review environment blocked browser navigation to local and localhost URLs. The Chromium interaction pass used an in-memory page, embedded local assets, and a temporary Local Storage shim. The interaction tests are useful evidence, but they are not a substitute for a final test on the deployed website.

## Submission gate

Do not submit until the project is pushed to GitHub, deployed, and the live site is checked in a normal browser. Replace the README's GitHub/live-site placeholders with the actual verified URLs and capture final screenshots from the deployed site.
