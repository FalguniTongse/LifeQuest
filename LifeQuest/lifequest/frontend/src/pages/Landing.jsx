import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="container">
      <nav className="landing-nav">
        <div className="mark">Life<span>Quest</span></div>
        <div className="actions">
          <Link to="/login" className="btn btn-outline btn-sm">Log in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Start your quest log</Link>
        </div>
      </nav>

      <section className="hero">
        <div>
          <div className="hero-eyebrow-free">Every real task, written as a quest</div>
          <h1>Level up your real life</h1>
          <p className="lede">
            LifeQuest turns the studying, training and habit-building you already need to do into a
            persistent character you're building. Complete a quest, and the reward is calculated,
            recorded and yours to keep.
          </p>
          <div className="actions">
            <Link to="/register" className="btn btn-primary">Create your character</Link>
            <Link to="/login" className="btn btn-outline">I already have an account</Link>
          </div>
        </div>

        <div className="sheet-mock" aria-hidden="true">
          <div className="sheet-row-top">
            <div>
              <div className="sheet-name">Aria Thorne</div>
              <div className="sheet-title">The Diligent</div>
            </div>
            <div className="sheet-level-badge">8</div>
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: '64%' }} />
          </div>
          <div className="xp-bar-meta" style={{ marginBottom: 22 }}>
            <span>1,040 XP</span>
            <span>580 XP to next level</span>
          </div>
          <div className="sheet-attrs">
            <AttrPreview name="Intellect" value={72} color="var(--cat-coding)" />
            <AttrPreview name="Strength" value={41} color="var(--cat-fitness)" />
            <AttrPreview name="Wellness" value={58} color="var(--cat-meditation)" />
            <AttrPreview name="Creativity" value={35} color="var(--cat-art)" />
          </div>
          <div className="sheet-quest-list">
            <div className="sheet-quest-item done">
              <span>Read 20 pages of research notes</span>
              <span className="reward">+50 XP</span>
            </div>
            <div className="sheet-quest-item">
              <span>Morning run, 5km</span>
              <span className="reward">+100 XP</span>
            </div>
            <div className="sheet-quest-item">
              <span>Ship the LifeQuest API</span>
              <span className="reward">+300 XP</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>The loop that keeps you coming back</h2>
        <p className="section-lede">
          Conventional to-do lists give you a checkbox. LifeQuest gives you a reason to open the app
          again tomorrow.
        </p>
        <div className="loop-row">
          <LoopStep glyph="I" title="Log a quest" body="Turn a real goal into a quest with a category and difficulty." />
          <span className="loop-arrow">→</span>
          <LoopStep glyph="II" title="Do the work" body="Study, train, build, create — out in the real world." />
          <span className="loop-arrow">→</span>
          <LoopStep glyph="III" title="Mark it complete" body="The backend calculates XP, Gold and attribute growth." />
          <span className="loop-arrow">→</span>
          <LoopStep glyph="IV" title="Watch yourself grow" body="Levels, streaks and achievements persist across every session." />
        </div>
      </section>

      <section className="section">
        <h2>Built for anyone with a habit worth keeping</h2>
        <div className="persona-grid">
          <PersonaCard title="Students" body="Study, coding and reading quests that make revision feel like progress, not a chore." />
          <PersonaCard title="Fitness & wellness" body="Workouts, walks and meditation sessions that build streaks instead of guilt." />
          <PersonaCard title="Developers" body="Track learning and career-development quests across a long-running project." />
          <PersonaCard title="Habit builders" body="Small daily quests that compound into consistency, without a complicated system." />
        </div>
      </section>

      <section className="cta-band">
        <h2>Your first quest is one click away</h2>
        <p>Registration takes under a minute. Your progress is safe, persistent, and yours.</p>
        <Link to="/register" className="btn btn-primary">Create your character</Link>
      </section>

      <footer className="landing-footer">
        <span>LifeQuest</span>
        <span>Built as a full-stack gamified productivity platform</span>
      </footer>
    </div>
  );
}

function AttrPreview({ name, value, color }) {
  return (
    <div>
      <div className="attribute-row-head">
        <span className="name">{name}</span>
        <span className="value">{value}</span>
      </div>
      <div className="attribute-track">
        <div className="attribute-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function LoopStep({ glyph, title, body }) {
  return (
    <div className="loop-step">
      <div className="glyph">{glyph}</div>
      <h4>{title}</h4>
      <p>{body}</p>
    </div>
  );
}

function PersonaCard({ title, body }) {
  return (
    <div className="persona-card">
      <h4>{title}</h4>
      <p>{body}</p>
    </div>
  );
}
