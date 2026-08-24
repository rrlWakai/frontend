import { useMemo } from 'react'
import {
  site,
  githubStatsPlaceholder,
  generateSkeletonActivity,
  type GitHubStats,
  type ContributionWeek,
} from '../data/site'
import type { ActivityStatus } from '../hooks/useGitHubActivity'

type MonthLabel = {
  label: string
  /** Number of week columns this label spans */
  span: number
}

type DotTiming = {
  duration: string
  delay: string
}

type GitHubActivitySectionProps = {
  status: ActivityStatus
  /** Real stats from the backend; placeholders shown until ready */
  stats?: GitHubStats
  /** Real weeks from the backend; skeleton shown until ready */
  weeks?: ContributionWeek[]
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

function getMonthLabels(weeks: ContributionWeek[]): MonthLabel[] {
  const labels: MonthLabel[] = []
  let currentMonth = -1

  for (const week of weeks) {
    const [y, m] = week.days[0].date.split('-').map(Number)
    const key = y * 12 + m
    if (key !== currentMonth) {
      labels.push({ label: MONTH_NAMES[m - 1], span: 1 })
      currentMonth = key
    } else {
      labels[labels.length - 1].span += 1
    }
  }

  // Drop a leading partial-month label by folding it into the next one
  // so column alignment is preserved.
  if (labels.length > 1 && labels[0].span < 2) {
    labels[1].span += labels[0].span
    labels.shift()
  }

  return labels
}

function GitHubActivitySection({ status, stats, weeks }: GitHubActivitySectionProps) {
  // Skeleton holds the exact grid layout (and month/day labels) while loading
  const skeletonWeeks = useMemo(() => generateSkeletonActivity(), [])
  const displayWeeks = status === 'ready' && weeks ? weeks : skeletonWeeks

  const monthLabels = useMemo(() => getMonthLabels(displayWeeks), [displayWeeks])

  // Stable per-dot breathing timings (duration ~2.6s–5s, delay 0–3s),
  // regenerated only when the dataset itself changes.
  const dotTimings = useMemo<DotTiming[][]>(
    () =>
      displayWeeks.map((week) =>
        week.days.map(() => ({
          duration: `${(2.6 + Math.random() * 2.4).toFixed(2)}s`,
          delay: `${(Math.random() * 3).toFixed(2)}s`,
        })),
      ),
    [displayWeeks],
  )

  const shownStats = status === 'ready' && stats ? stats : githubStatsPlaceholder

  const statBlocks = [
    { value: shownStats.totalContributions, label: 'Total contributions' },
    { value: shownStats.currentStreak, label: 'Current streak' },
    { value: shownStats.longestStreak, label: 'Longest streak' },
  ]

  return (
    <section id="github-activity" className="main-section">
      <div className="section-head">
        <span className="section-num">06</span>
        <span className="section-title-serif">GitHub Activity</span>
        <div className="section-rule" />
      </div>

      {/* Stats row */}
      <div className="gh-stats-row">
        {statBlocks.map((stat) => (
          <div className="gh-stat" key={stat.label}>
            <span className="gh-stat-value">{stat.value}</span>
            <span className="gh-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Contribution grid */}
      <div className="gh-card">
        {status === 'error' ? (
          <p className="gh-error">Couldn't load GitHub activity right now.</p>
        ) : (
          <div
            className={`gh-graph${status === 'loading' ? ' gh-graph--skeleton' : ''}`}
            role="img"
            aria-label={
              status === 'loading'
                ? 'Loading contribution activity'
                : 'Contribution activity over the last year'
            }
          >
            <div className="gh-months" aria-hidden="true">
              {monthLabels.map((m, i) => (
                <span
                  key={`${m.label}-${i}`}
                  className="gh-month-label"
                  style={{
                    width: `calc(${m.span} * (var(--gh-cell) + var(--gh-gap)) - var(--gh-gap))`,
                  }}
                >
                  {m.label}
                </span>
              ))}
            </div>
            <div className="gh-grid-body">
              <div className="gh-day-labels" aria-hidden="true">
                {DAY_LABELS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="gh-grid" aria-hidden="true">
                {displayWeeks.map((week, wi) =>
                  week.days.map((day, di) => (
                    <div
                      key={day.date}
                      className={`gh-cell gh-level-${day.level}`}
                      title={`${day.date}: ${day.count} contribution${day.count === 1 ? '' : 's'}`}
                    >
                      <span
                        className="gh-dot"
                        style={{
                          animationDuration: dotTimings[wi][di].duration,
                          animationDelay: dotTimings[wi][di].delay,
                        }}
                      />
                    </div>
                  )),
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <a
        href={site.github}
        target="_blank"
        rel="noreferrer"
        className="proj-link gh-profile-link"
      >
        View full profile on GitHub <span className="proj-arrow">↗</span>
      </a>
    </section>
  )
}

export default GitHubActivitySection