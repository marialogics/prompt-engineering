import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import './App.css'
import heroAsset from './assets/hero.png'

type Difficulty = 'Beginner' | 'Medium' | 'Hard'
type SavedGame = {
  board: number[][]
  difficulty: Difficulty
  elapsedSeconds: number
}

type AccountRecord = {
  displayName: string
  dailyCount?: { date: string; count: number }
  savedGame?: SavedGame
}

const solvedBoard = [
  5, 3, 4, 6, 7, 8, 9, 1, 2,
  6, 7, 2, 1, 9, 5, 3, 4, 8,
  1, 9, 8, 3, 4, 2, 5, 6, 7,
  8, 5, 9, 7, 6, 1, 4, 2, 3,
  4, 2, 6, 8, 5, 3, 7, 9, 1,
  7, 1, 3, 9, 2, 4, 8, 5, 6,
  9, 6, 1, 5, 3, 7, 2, 8, 4,
  2, 8, 7, 4, 1, 9, 6, 3, 5,
  3, 4, 5, 2, 8, 6, 1, 7, 9,
]

const boardSize = 9
const boxSize = 3

const difficultyOptions: Array<{
  name: Difficulty
}> = [
  { name: 'Beginner' },
  { name: 'Medium' },
  { name: 'Hard' },
]

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

const puzzleHistoryStorageKey = 'gridline-puzzle-history'
const clueCountByDifficulty: Record<Difficulty, number> = {
  Beginner: 45,
  Medium: 35,
  Hard: 26,
}

const getPuzzleHistory = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(puzzleHistoryStorageKey) ?? '{}') as Record<string, string[]>
    return saved
  } catch {
    return {}
  }
}

const getBoardForDifficulty = (level: Difficulty) => {
  const history = getPuzzleHistory()
  const usedPuzzles = new Set(history[level] ?? [])
  const clueCount = clueCountByDifficulty[level]

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const clueIndexes = Array.from({ length: 81 }, (_, index) => index)
    clueIndexes.sort(() => Math.random() - 0.5)
    const clueSet = new Set(clueIndexes.slice(0, clueCount))
    const puzzle = solvedBoard.map((value, index) => (clueSet.has(index) ? value : 0))
    const signature = puzzle.join('')

    if (!usedPuzzles.has(signature)) {
      const updatedHistory = {
        ...history,
        [level]: [...(history[level] ?? []), signature],
      }
      localStorage.setItem(puzzleHistoryStorageKey, JSON.stringify(updatedHistory))
      return Array.from({ length: 9 }, (_, row) => puzzle.slice(row * 9, row * 9 + 9))
    }
  }

  return Array.from({ length: 9 }, (_, row) =>
    solvedBoard.slice(row * 9, row * 9 + 9).map((value, index) => (index < clueCount ? value : 0)),
  )
}

const dailyCountStorageKey = 'gridline-daily-games'
const accountsStorageKey = 'gridline-accounts'
const sessionStorageKey = 'gridline-session'

const getTodayKey = () => {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${today.getFullYear()}-${month}-${day}`
}

const readDailyCount = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(dailyCountStorageKey) ?? 'null') as {
      date?: string
      count?: number
    } | null

    if (saved?.date === getTodayKey() && typeof saved.count === 'number') {
      return saved.count
    }
  } catch {
    return 0
  }

  return 0
}

const readAccounts = (): Record<string, AccountRecord> => {
  try {
    return JSON.parse(localStorage.getItem(accountsStorageKey) ?? '{}') as Record<string, AccountRecord>
  } catch {
    return {}
  }
}

const normalizeAccountName = (name: string) => name.trim().toLowerCase()

const readSession = () => localStorage.getItem(sessionStorageKey)

function App() {
  const [startingBoard, setStartingBoard] = useState<number[][]>(() => getBoardForDifficulty('Medium'))
  const [board, setBoard] = useState<number[][]>(() => startingBoard.map((row) => [...row]))
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null)
  const [dailyCount, setDailyCount] = useState(readDailyCount)
  const [mistakes, setMistakes] = useState(0)
  const [screen, setScreen] = useState<'landing' | 'levels' | 'game'>('landing')
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [history, setHistory] = useState<number[][][]>([])
  const [hintsUsed, setHintsUsed] = useState(0)
  const [thirdHintPurchased, setThirdHintPurchased] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => readSession())
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginName, setLoginName] = useState('')
  const [loginError, setLoginError] = useState('')
  const accountLoaded = useRef(false)
  const completionRecorded = useRef(false)

  const conflictCells = useMemo(() => {
    const conflicts = new Set<string>()

    const markDuplicate = (positions: Array<{ row: number; col: number }>) => {
      if (positions.length < 2) return

      positions.forEach(({ row, col }) => {
        conflicts.add(`${row}-${col}`)
      })
    }

    for (let row = 0; row < boardSize; row += 1) {
      const seenInRow = new Map<number, Array<{ row: number; col: number }>>()

      for (let col = 0; col < boardSize; col += 1) {
        const value = board[row][col]
        if (value === 0) continue

        const existing = seenInRow.get(value) ?? []
        existing.push({ row, col })
        seenInRow.set(value, existing)
      }

      seenInRow.forEach((positions) => markDuplicate(positions))
    }

    for (let col = 0; col < boardSize; col += 1) {
      const seenInCol = new Map<number, Array<{ row: number; col: number }>>()

      for (let row = 0; row < boardSize; row += 1) {
        const value = board[row][col]
        if (value === 0) continue

        const existing = seenInCol.get(value) ?? []
        existing.push({ row, col })
        seenInCol.set(value, existing)
      }

      seenInCol.forEach((positions) => markDuplicate(positions))
    }

    for (let boxRow = 0; boxRow < boardSize; boxRow += boxSize) {
      for (let boxCol = 0; boxCol < boardSize; boxCol += boxSize) {
        const seenInBox = new Map<number, Array<{ row: number; col: number }>>()

        for (let row = boxRow; row < boxRow + boxSize; row += 1) {
          for (let col = boxCol; col < boxCol + boxSize; col += 1) {
            const value = board[row][col]
            if (value === 0) continue

            const existing = seenInBox.get(value) ?? []
            existing.push({ row, col })
            seenInBox.set(value, existing)
          }
        }

        seenInBox.forEach((positions) => markDuplicate(positions))
      }
    }

    return conflicts
  }, [board])

  const isSolved = useMemo(
    () =>
      board.every((row) => row.every((value) => value !== 0)) && conflictCells.size === 0,
    [board, conflictCells],
  )

  useEffect(() => {
    if (!timerActive || isSolved) return

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [timerActive, isSolved])

  useEffect(() => {
    if (!isSolved || completionRecorded.current) return

    completionRecorded.current = true
    setDailyCount((current) => {
      const nextCount = current + 1
      localStorage.setItem(
        dailyCountStorageKey,
        JSON.stringify({ date: getTodayKey(), count: nextCount }),
      )
      return nextCount
    })
  }, [isSolved])

  useEffect(() => {
    if (!currentUser || accountLoaded.current) return

    const account = readAccounts()[currentUser]
    if (account?.savedGame) {
      setStartingBoard(account.savedGame.board.map((row) => [...row]))
      setBoard(account.savedGame.board.map((row) => [...row]))
      setDifficulty(account.savedGame.difficulty)
      setElapsedSeconds(account.savedGame.elapsedSeconds)
      setTimerActive(false)
    }
    if (account?.dailyCount?.date === getTodayKey()) {
      setDailyCount(account.dailyCount.count)
    } else {
      setDailyCount(0)
    }
    accountLoaded.current = true
  }, [currentUser])

  useEffect(() => {
    if (!currentUser || !accountLoaded.current || screen !== 'game') return

    const accounts = readAccounts()
    const account = accounts[currentUser] ?? { displayName: currentUser }
    accounts[currentUser] = {
      ...account,
      savedGame: { board, difficulty, elapsedSeconds },
      dailyCount: { date: getTodayKey(), count: dailyCount },
    }
    localStorage.setItem(accountsStorageKey, JSON.stringify(accounts))
  }, [board, currentUser, dailyCount, difficulty, elapsedSeconds, screen])

  const handleCellClick = (row: number, col: number) => {
    setSelected({ row, col })
  }

  const handleNumberInput = (value: number) => {
    if (!selected || isPaused || isSolved) return

    const selectedIndex = selected.row * boardSize + selected.col
    if (value !== solvedBoard[selectedIndex]) {
      setMistakes((current) => Math.min(3, current + 1))
    }

    setTimerActive(true)
    setBoard((current) => {
      setHistory((previous) => [...previous, current.map((row) => [...row])])
      const next = current.map((row) => [...row])
      next[selected.row][selected.col] = value
      return next
    })
  }

  const handleClear = () => {
    if (!selected || isPaused || isSolved) return

    setBoard((current) => {
      setHistory((previous) => [...previous, current.map((row) => [...row])])
      const next = current.map((row) => [...row])
      next[selected.row][selected.col] = 0
      return next
    })
  }

  const handleRefresh = () => {
    setBoard(startingBoard.map((row) => [...row]))
    setSelected(null)
    setHistory([])
    setMistakes(0)
    setElapsedSeconds(0)
    setTimerActive(false)
    setIsPaused(false)
    setHintsUsed(0)
    setThirdHintPurchased(false)
    completionRecorded.current = false
  }

  const handleHint = () => {
    if (mistakes < 3 || isPaused || hintsUsed >= 2 + (thirdHintPurchased ? 1 : 0)) return

    const emptyCell = board
      .flatMap((row, rowIndex) => row.map((value, colIndex) => ({ value, rowIndex, colIndex })))
      .find((cell) => cell.value === 0)

    if (!emptyCell) return

    setSelected({ row: emptyCell.rowIndex, col: emptyCell.colIndex })
    setBoard((current) => {
      setHistory((previous) => [...previous, current.map((row) => [...row])])
      const next = current.map((row) => [...row])
      next[emptyCell.rowIndex][emptyCell.colIndex] = solvedBoard[emptyCell.rowIndex * boardSize + emptyCell.colIndex]
      return next
    })
    setHintsUsed((current) => current + 1)
  }

  const handlePurchaseThirdHint = () => {
    setThirdHintPurchased(true)
  }

  const handleDifficultySelect = (level: Difficulty) => {
    const nextBoard = getBoardForDifficulty(level)
    setDifficulty(level)
    setStartingBoard(nextBoard)
    setBoard(nextBoard.map((row) => [...row]))
    setSelected(null)
    setHistory([])
    setMistakes(0)
    setElapsedSeconds(0)
    setTimerActive(false)
    setIsPaused(false)
    setHintsUsed(0)
    setThirdHintPurchased(false)
    completionRecorded.current = false
    setScreen('game')
  }

  const handleUndo = () => {
    if (isPaused || history.length === 0) return

    const previousBoard = history[history.length - 1]
    setBoard(previousBoard.map((row) => [...row]))
    setHistory((current) => current.slice(0, -1))
    setSelected(null)
  }

  const handlePauseToggle = () => {
    if (isSolved) return

    setIsPaused((current) => !current)
    setTimerActive((current) => !current)
  }

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const displayName = loginName.trim()
    const accountKey = normalizeAccountName(displayName)

    if (!accountKey) {
      setLoginError('Enter a name to continue.')
      return
    }

    const accounts = readAccounts()
    const account = accounts[accountKey] ?? { displayName }
    accounts[accountKey] = account
    localStorage.setItem(accountsStorageKey, JSON.stringify(accounts))
    localStorage.setItem(sessionStorageKey, accountKey)
    setCurrentUser(accountKey)
    setLoginName('')
    setLoginError('')
    setLoginOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem(sessionStorageKey)
    setCurrentUser(null)
    setScreen('landing')
    setLoginOpen(false)
    accountLoaded.current = false
  }

  const savedGame = currentUser ? readAccounts()[currentUser]?.savedGame : undefined

  useEffect(() => {
    const handleKeyboardInput = (event: KeyboardEvent) => {
      if (screen !== 'game' || isPaused) return

      if (/^[1-9]$/.test(event.key)) {
        handleNumberInput(Number(event.key))
        return
      }

      if (event.key === '0' || event.key === 'Backspace' || event.key === 'Delete') {
        handleClear()
      }
    }

    document.addEventListener('keydown', handleKeyboardInput)
    return () => document.removeEventListener('keydown', handleKeyboardInput)
  }, [isPaused, screen, selected])

  if (screen === 'landing') {
    return (
      <main className="landing-page">
        <nav className="landing-nav" aria-label="Main navigation">
          <a className="brand-mark" href="#top" aria-label="Logic Sudoku home">
            <span>Logic Sudoku</span>
          </a>
          {currentUser ? (
            <div className="account-controls">
              <span className="account-greeting">Hi, {readAccounts()[currentUser]?.displayName ?? currentUser}</span>
              <button type="button" className="account-button" onClick={handleLogout}>Log out</button>
            </div>
          ) : (
            <button type="button" className="account-button" onClick={() => setLoginOpen(true)}>Log in</button>
          )}
        </nav>

        {loginOpen && (
          <div className="login-overlay" role="dialog" aria-modal="true" aria-labelledby="login-title">
            <form className="login-card" onSubmit={handleLogin}>
              <button type="button" className="login-close" aria-label="Close login" onClick={() => setLoginOpen(false)}>×</button>
              <p className="levels-kicker">Save your progress</p>
              <h2 id="login-title">Welcome back.</h2>
              <p className="login-copy">Sign in with a name to keep your puzzles and daily wins on this device.</p>
              <label htmlFor="login-name">Your name</label>
              <input
                id="login-name"
                value={loginName}
                onChange={(event) => setLoginName(event.target.value)}
                placeholder="Enter your name"
                autoFocus
              />
              {loginError && <p className="login-error">{loginError}</p>}
              <button type="submit" className="landing-cta login-submit">Continue <span aria-hidden="true">↗</span></button>
            </form>
          </div>
        )}

        <section className="landing-hero" id="top">
          <div className="landing-copy">
            <h1>Ready to<br /><em>play?</em></h1>
            <div className="landing-actions">
              <button type="button" className="landing-cta" onClick={() => setScreen('levels')}>
                Start a puzzle <span aria-hidden="true">↗</span>
              </button>
              {savedGame && (
                <button type="button" className="resume-button" onClick={() => setScreen('game')}>
                  Continue saved puzzle
                </button>
              )}
            </div>
          </div>

          <div className="landing-visual" aria-label="Preview of a Sudoku puzzle">
            <div className="visual-orbit visual-orbit--one" />
            <div className="visual-orbit visual-orbit--two" />
            <div className="preview-board">
              {[
                5, 3, '', '', 7, '', '', '', '',
                6, '', '', 1, 9, 5, '', '', '',
                '', 9, 8, '', '', '', '', 6, '',
                8, '', '', '', 6, '', '', '', 3,
                4, '', '', 8, '', 3, '', '', 1,
                7, '', '', '', 2, '', '', '', 6,
                '', 6, '', '', '', '', 2, 8, '',
                '', '', '', 4, 1, 9, '', '', 5,
                '', '', '', '', 8, '', '', 7, 9,
              ].map((value, index) => (
                <span className={value === '' ? 'preview-cell preview-cell--empty' : 'preview-cell'} key={index}>
                  {value}
                </span>
              ))}
            </div>
            <div className="visual-label visual-label--top">01 / 09 <span>Daily edition</span></div>
            <div className="visual-label visual-label--bottom">Take your time <span>◌</span></div>
            <img className="landing-glow" src={heroAsset} alt="" aria-hidden="true" />
          </div>
        </section>

        <section className="landing-details" aria-label="Game features">
          <div className="detail-item">
            <span className="detail-number">01</span>
            <div><strong>One puzzle a day</strong><p>A small, satisfying reset whenever you need it.</p></div>
          </div>
          <div className="detail-item">
            <span className="detail-number">02</span>
            <div><strong>Play your way</strong><p>Gentle guidance, clean feedback, zero clutter.</p></div>
          </div>
          <div className="detail-item">
            <span className="detail-number">03</span>
            <div><strong>Keep your streak</strong><p>Return tomorrow and build a habit that lasts.</p></div>
          </div>
        </section>

      </main>
    )
  }

  if (screen === 'levels') {
    return (
      <main className="levels-page">
        <div className="levels-shell">
          <button type="button" className="back-link" onClick={() => setScreen('landing')}>
            <span aria-hidden="true">←</span> Back
          </button>
          <h1>How much of a<br /><em>challenge?</em></h1>

          <div className="level-options" role="list" aria-label="Puzzle levels">
            {difficultyOptions.map((option, index) => (
              <button
                className="level-option"
                key={option.name}
                type="button"
                onClick={() => handleDifficultySelect(option.name)}
              >
                <span className="level-number">0{index + 1}</span>
                <span className="level-content">
                  <strong>{option.name}</strong>
                </span>
                <span className="level-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="sudoku-app">
      <div className="game-shell">
        <header className="game-header">
          <button
            type="button"
            className="back-link game-back-link"
            onClick={() => {
              setTimerActive(false)
              setScreen('levels')
            }}
          >
            <span aria-hidden="true">←</span> Levels
          </button>
          <div>
            <span className="eyebrow">Sudoku</span>
            <h1>Daily puzzle</h1>
          </div>

          <div className="daily-count">
            <span>Games played today</span>
            <strong>{dailyCount}</strong>
          </div>
        </header>

        <div className="game-main">
          <section className="board-panel">
            <div className="board-topbar">
              <div className="topbar-item">
                <span>Difficulty</span>
                <strong>{difficulty}</strong>
              </div>
              <div className="topbar-item">
                <span>Mistakes</span>
                <strong>{mistakes}/3</strong>
              </div>
              <div className="topbar-item">
                <span>Time</span>
                <strong>{formatTime(elapsedSeconds)}</strong>
              </div>
            </div>

            <div className="board-stage">
              <div className="board-grid" role="grid" aria-label="Sudoku board">
                {board.map((row, rowIndex) =>
                  row.map((value, colIndex) => {
                    const isSelected = selected?.row === rowIndex && selected?.col === colIndex
                    const isSameRow = selected?.row === rowIndex
                    const isSameCol = selected?.col === colIndex
                    const isSameBox =
                      selected &&
                      Math.floor(selected.row / boxSize) === Math.floor(rowIndex / boxSize) &&
                      Math.floor(selected.col / boxSize) === Math.floor(colIndex / boxSize)
                    const borderRight = (colIndex + 1) % boxSize === 0 && colIndex !== boardSize - 1
                    const borderBottom = (rowIndex + 1) % boxSize === 0 && rowIndex !== boardSize - 1
                    const isConflict = conflictCells.has(`${rowIndex}-${colIndex}`)

                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        type="button"
                        data-row={rowIndex}
                        data-col={colIndex}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={[
                          'cell',
                          value !== 0 ? 'given' : 'empty',
                          isSelected ? 'selected' : '',
                          isSameRow || isSameCol || isSameBox ? 'related' : '',
                          isConflict ? 'conflict' : '',
                          borderRight ? 'thick-right' : '',
                          borderBottom ? 'thick-bottom' : '',
                        ].join(' ')}
                      >
                        {value === 0 ? '' : value}
                      </button>
                    )
                  }),
                )}
              </div>
              {isSolved && (
                <div className="board-confetti" aria-hidden="true">
                  {Array.from({ length: 28 }, (_, index) => (
                    <span className="board-confetti__piece" key={index} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="sidebar">
            <div className="card">
              <h2>Number pad</h2>
              <div className="game-controls" aria-label="Puzzle controls">
                <button type="button" onClick={handleRefresh}>Reset</button>
                <button type="button" onClick={handleUndo} disabled={history.length === 0 || isPaused}>Undo</button>
                <button type="button" onClick={handlePauseToggle} disabled={isSolved}>
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
              </div>
              <div className="numpad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <button key={n} type="button" onClick={() => handleNumberInput(n)}>
                    {n}
                  </button>
                ))}
              </div>

              <div className="action-row">
                <button type="button" className="secondary" onClick={handleClear}>
                  Clear
                </button>
                <button type="button" className="primary">
                  Submit
                </button>
              </div>
              {mistakes >= 3 && hintsUsed < 2 && (
                <button type="button" className="hint-button" onClick={handleHint}>
                  Get a hint ({2 - hintsUsed} free left)
                </button>
              )}
              {mistakes >= 3 && hintsUsed >= 2 && !thirdHintPurchased && (
                <button type="button" className="hint-button hint-button--purchase" onClick={handlePurchaseThirdHint}>
                  Purchase third hint
                </button>
              )}
              {mistakes >= 3 && thirdHintPurchased && hintsUsed === 2 && (
                <button type="button" className="hint-button" onClick={handleHint}>
                  Use purchased hint
                </button>
              )}
            </div>

            <div className="card">
              <h2>Progress</h2>
              <div className="progress-row">
                <span>Games won today</span>
                <strong>{dailyCount}</strong>
              </div>
              <div className="progress-bar">
                <span data-progress={Math.min(dailyCount, 10)} />
              </div>
            </div>

          </aside>
        </div>
      </div>

      <div className={`completion-toast ${isSolved ? 'visible' : ''}`} aria-live="polite">
        <div className="toast-icon">✓</div>
        <div>
          <p className="toast-title">You completed the game!</p>
          <p className="toast-subtitle">Amazing work. Ready for another challenge?</p>
        </div>
        <button type="button" className="toast-button" onClick={handleRefresh}>
          Start another challenge
        </button>
      </div>
    </main>
  )
}

export default App
