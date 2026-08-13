import { ArrowDown, Database, Filter, GitBranch, Ruler, Sparkles, Wand2 } from 'lucide-react'

const PIPELINE = [
  { icon: Database, title: 'Dataset', desc: '130,663 songs with title, artist, and descriptive tags.' },
  { icon: Filter, title: 'Preprocessing', desc: 'Titles, artists, and tags are cleaned and combined per song.' },
  { icon: Wand2, title: 'Feature Extraction', desc: 'Each song is turned into a numeric representation of its text.' },
  { icon: GitBranch, title: 'TF-IDF', desc: 'Words are weighted by how distinctive they are across the catalog.' },
  { icon: Sparkles, title: 'NearestNeighbors', desc: 'A pre-built index finds songs with the closest vectors instantly.' },
  { icon: Ruler, title: 'Cosine Distance', desc: 'Distance between vectors is converted into a similarity score.' },
  { icon: Sparkles, title: 'Top Recommendations', desc: 'The closest matches are returned, ranked by similarity.' },
]

export function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-28">
      <span className="text-xs uppercase tracking-wide text-mist">About</span>
      <h1 className="font-display text-3xl sm:text-4xl text-cream mt-1 mb-6">What is MelodyMatch?</h1>
      <p className="text-mist text-base leading-relaxed mb-4">
        MelodyMatch is a content-based music recommendation system that uses machine learning to find
        songs similar to a track you already like — no listening history or social graph required, just
        the character of the song itself.
      </p>
      <p className="text-mist text-base leading-relaxed mb-12">
        Instead of asking "what do people similar to you listen to," MelodyMatch asks "what songs actually
        sound and read like this one." That makes it a great way to explore music on its own terms.
      </p>

      <h2 className="font-display text-2xl text-cream mb-6">How the recommendations work</h2>
      <div className="flex flex-col items-center gap-1 mb-12">
        {PIPELINE.map((step, i) => (
          <div key={step.title} className="w-full flex flex-col items-center">
            <div className="w-full glass rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <step.icon size={18} className="text-gold" />
              </div>
              <div>
                <p className="font-medium text-cream text-sm">{step.title}</p>
                <p className="text-xs text-mist">{step.desc}</p>
              </div>
            </div>
            {i < PIPELINE.length - 1 && <ArrowDown size={16} className="text-mist/40 my-1" />}
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-cream mb-2">Built for scale</h3>
        <p className="text-mist text-sm leading-relaxed">
          A catalog of 130,663 songs means a full pairwise similarity matrix would require comparing every
          song to every other song — tens of billions of numbers, far more than fits in memory. MelodyMatch
          avoids that entirely: a nearest-neighbor index is built once, ahead of time, and each recommendation
          request only looks up the neighbors of a single song. That keeps the system fast and lightweight,
          even as the catalog grows.
        </p>
      </div>
    </div>
  )
}
