import { Link } from 'react-router-dom';

export default function About() {
  return (
    <article className="prose">
      <h1>About WayFare</h1>
      <p className="italic muted">
        A family apprenticeship in finding your way — by sky, by land, by story.
      </p>

      <h2>What it is</h2>
      <p>
        WayFare is a project for families who want to get better at reading the world around them.
        Not the world on a screen — the actual one, outside the door. The Moon on a Tuesday.
        The way shadows move. Which direction water runs. The old names for the stars.
      </p>
      <p>
        It has three parts that work together:
      </p>
      <ul>
        <li>
          <strong>A paper Fieldbook</strong> — pages you print, hole-punch, and keep in a cheap
          ring binder. You draw in it. You write in it. You carry it outside.
        </li>
        <li>
          <strong>A Challenge Deck</strong> — cards with real-world tasks. Most of them ask you
          to leave the house. Starter cards take an afternoon. Stretch cards take a season.
        </li>
        <li>
          <strong>This app</strong> — which tells you what's in the sky tonight, holds the
          chapters, and keeps a local copy of your Fieldbook entries. No accounts. No cloud.
          Everything stays on your device.
        </li>
      </ul>
      <p>
        The paper is the point. The app is a companion.
      </p>

      <h2>Who it's for</h2>
      <p>
        Families with children old enough to be curious — which varies wildly by child.
        Anyone who has noticed that the stars still have names and nobody knows them.
        Anyone who wants a good reason to be outside after dark.
      </p>
      <p>
        You do not need to be an astronomer, a hiker, or the kind of person who owns a compass.
        You just need to be willing to look up, write things down, and be wrong sometimes.
        The Error Journal page exists for a reason.
      </p>

      <h2>How to use it</h2>
      <p>
        The app has two modes, and they switch automatically at sunrise and sunset.
      </p>
      <p>
        <strong>At night</strong>, the screen goes warm amber — deliberately red-shifted so your
        eyes stay dark-adapted and you can actually see the sky when you look up. Start on
        Tonight's Sky: check the Moon phase, find the featured constellation, note when the sun
        rises. Open the chapter for what you're looking at. Then put the phone down and go outside.
      </p>
      <p>
        <strong>By day</strong>, the screen switches to blue-sky mode and shows you what you
        found last night. That's when you log your Fieldbook entry, draw the Moon, write down
        what you got wrong. Pull a Challenge card. Read the chapter properly. Argue about it.
      </p>
      <p>
        That's the whole loop. Night: observe. Day: reflect.
      </p>

      <h2>The chapters</h2>
      <p>
        Chapters unlock by season — some are always available, others appear in winter, spring,
        summer, or autumn. A few require completing a prerequisite first.
        The sky changes through the year; the reading does too.
      </p>
      <p>
        Each chapter covers one thing in depth: the Moon, Orion, the Summer Triangle, how to
        read terrain, what moss does and doesn't tell you, how Polynesian navigators used stars
        as a compass. They're written for adults to read aloud to children, or for older children
        to read alone.
      </p>
      <p>
        Sources are listed at the top of each chapter. None of this is original research —
        it's a careful distillation of things that have been known for a long time.
      </p>

      <h2>The Fieldbook</h2>
      <p>
        The <Link to="/fieldbook">digital Fieldbook</Link> is for quick logs when you're outside
        with only a phone. The paper Fieldbook is for everything else. Print the templates from
        the <Link to="/printables">Printables</Link> section, put them in a ring binder, and
        treat it as the real artefact. Drawings, measurements, guesses, corrections — all of it.
        Ten years from now it will be worth more than any app.
      </p>

      <h2>No accounts. No tracking.</h2>
      <p>
        WayFare stores nothing outside your device. There is no server, no login, no analytics,
        no advertising. Your Fieldbook entries live in your browser's local storage and nowhere
        else. If you want a backup, use the Export button — it writes a plain-text Markdown file
        you can keep anywhere.
      </p>
      <p>
        For a live sky map, <a href="https://stellarium-web.org" target="_blank" rel="noreferrer">Stellarium</a> is
        far better than anything we could build. WayFare doesn't try to replace it.
      </p>
    </article>
  );
}
