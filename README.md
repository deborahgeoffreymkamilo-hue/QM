# The Birthday Magazine

The supplied birthday magazine is the main page. The landing page opens `birthday_queen_magazine.html`, which includes the magazine, personalization form, confetti, and a built-in instrumental.

## Open it

Open `index.html` in a browser, or open `birthday_queen_magazine.html` directly. This is a static site; there is no build step or dependency installation.

## Personalize it

- Enter her name, your name, and a personal message in the customization section, then select **Update Her Edition**.
- Play the built-in instrumental or choose an audio file from your device.
- The supplied birthday magazine and its embedded portrait are included in this repository.

Personalized text and selected audio are handled in your browser; no server or upload service is required.

## Publish with GitHub Pages

In the repository's **Settings → Pages**, choose **GitHub Actions** as the build and deployment source once. After that, the workflow in `.github/workflows/pages.yml` publishes each push to `main`. The expected site address is `https://deborahgeoffreymkamilo-hue.github.io/QM/`.
