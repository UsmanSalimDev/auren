import PageIntro from '../components/PageIntro.jsx'
import { pageContent } from '../data/pageContent.js'

export default function Story() {
  return (
    <main className="inner-page story-page">
      <PageIntro label={pageContent.story.introLabel} title={<>{pageContent.story.titleLead}<br /><em>{pageContent.story.titleAccent}</em></>} copy={pageContent.story.introDescription} />
      <section className="story-content section-shell">
        <div className="story-image"><img src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1400&q=85" alt="A considered fragrance ritual" /></div>
        <div className="story-essay">
          <p className="eyebrow">{pageContent.story.sectionEyebrow}</p>
          <h2>{pageContent.story.sectionTitle}</h2>
          {pageContent.story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="story-signoff">With intention, <em>Auren</em></div>
        </div>
      </section>
      <div className="story-quote"><span>“</span><p>Luxury is not what you leave behind.<br />It is what remains.</p><small>THE AUREN WAY</small></div>
    </main>
  )
}
