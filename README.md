# Role-Play Practice

Phone-friendly ESL role-play scripts (A1–A2) for groups of 4: **At 7-Eleven** (each customer pays with their own NT$100 gift card) and **At the Movie Theater**. Each scene is about 50 seconds, and every student speaks.

## How students use it

1. Project the **class QR code** (home page → *Show class QR code*). Students scan it with their phone cameras.
2. In each group, one student picks the scene and chooses the group's words, then taps **Share**. In the 7-Eleven scene each customer picks a drink and a food with real prices; the app works out each total and what is left on each card.
3. The other three scan that phone's QR code, so the whole group gets the same words.
4. Everyone picks a role. **My lines** shows each line with the cue to listen for. **Whole scene** has *Play scene* and a 50-second timer for rehearsing.

## Put it on GitHub Pages

1. On GitHub, create a new **public** repository named `esl-role-play`.
2. Click **Add file → Upload files** and drag in everything in this folder (`index.html`, `css`, `js`, `README.md`). Commit.
3. Go to **Settings → Pages**, set *Source* to **Deploy from a branch**, choose `main` and `/ (root)`, and save.
4. After about a minute, the site is live at `https://zatygold.github.io/esl-role-play/`.

## Edit the scripts

All scene text lives in `js/scenes.js`: roles, the blanks (with idea chips and Chinese hints) and the lines in order. Write `{A}` in a line wherever blank A goes, `{D.ask}` for a detail of the chosen idea, and `{TOTAL1}` / `{LEFT1}` for a customer's total and card balance. Add a new scene by adding another entry, and it appears on the home page.

## Prices (checked Nov 2026)

7-Eleven Taiwan prices found online; stores and promotions vary. Water (600 ml) $18 · tea (600 ml) $24 · tea egg $10 · banana $18 · ice cream cup $25 · rice ball about $30 · chips $35 · hot dog $45 · grapes $69 · plastic bag $1.
Regular movie tickets are $320–370 in Taipei. Popcorn-and-drinks prices are classroom estimates.

## Files

```
index.html            page shell
css/styles.css        styles (same palette as the Thanksgiving QR Trail)
js/scenes.js          scene data
js/app.js             routing, views, speech, timer, QR sharing
js/vendor/qrcode.js   QR encoder (Kazuhiko Arase, MIT)
```
