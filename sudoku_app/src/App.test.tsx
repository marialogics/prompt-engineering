import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const enterGame = () => {
    fireEvent.click(screen.getByRole('button', { name: /Start a puzzle/i }))
    fireEvent.click(screen.getByRole('button', { name: /Medium/i }))
  }

  it('renders the Sudoku home screen', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /Start a puzzle/i }))
    expect(screen.getByRole('heading', { name: /How much of a\s*challenge/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Medium/i }))
    expect(screen.getByText(/Daily puzzle/i)).toBeInTheDocument()
    expect(screen.getByText(/Number pad/i)).toBeInTheDocument()
    expect(screen.getByText(/Games played today/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Levels/i }))
    expect(screen.getByRole('heading', { name: /How much of a\s*challenge/i })).toBeInTheDocument()
  })

  it('allows a player to log in and shows their saved account state', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /Log in/i }))
    fireEvent.change(screen.getByLabelText(/Your name/i), { target: { value: 'Maya' } })
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))

    expect(screen.getByText(/Hi, Maya/i)).toBeInTheDocument()
    expect(localStorage.getItem('gridline-session')).toBe('maya')
  })

  it('offers saved puzzle resume for a returning player', () => {
    localStorage.setItem('gridline-session', 'maya')
    localStorage.setItem('gridline-accounts', JSON.stringify({
      maya: {
        displayName: 'Maya',
        savedGame: {
          board: Array.from({ length: 9 }, () => Array(9).fill(0)),
          difficulty: 'Medium',
          elapsedSeconds: 12,
        },
      },
    }))
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /Continue saved puzzle/i }))
    expect(screen.getByText(/Daily puzzle/i)).toBeInTheDocument()
    expect(screen.getByText('00:12')).toBeInTheDocument()
  })

  it('highlights duplicate values in the board when they coincide', () => {
    render(<App />)
    enterGame()

    const existingFive = Array.from(document.querySelectorAll('.cell.given')).find(
      (cell) => cell.textContent === '5',
    ) as HTMLElement
    const row = existingFive.dataset.row
    const emptyCell = document.querySelector(`[data-row="${row}"].empty`) as HTMLElement
    fireEvent.click(emptyCell)

    fireEvent.keyDown(document, { key: '5' })

    expect(existingFive).toHaveClass('conflict')
    expect(emptyCell).toHaveClass('conflict')
  })

  it('loads a different board for each difficulty', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Start a puzzle/i }))
    fireEvent.click(screen.getByRole('button', { name: /Beginner/i }))

    const beginnerClues = document.querySelectorAll('.cell.given')
    expect(beginnerClues).toHaveLength(45)
  })

  it('shows a completion toast when the board is fully solved', () => {
    render(<App />)
    enterGame()

    const numberPad = screen.getByText(/Number pad/i).closest('.card') as HTMLElement
    const solvedBoard = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ]

    for (let row = 0; row < 9; row += 1) {
      for (let col = 0; col < 9; col += 1) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement
        if (cell && cell.textContent === '') {
          fireEvent.click(cell)
          fireEvent.click(within(numberPad).getByRole('button', { name: String(solvedBoard[row][col]) }))
        }
      }
    }

    expect(screen.getByText(/You completed the game!/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start another challenge/i })).toBeInTheDocument()
    expect(document.querySelector('.board-confetti')).toBeInTheDocument()
    expect(document.querySelector('.daily-count strong')).toHaveTextContent('1')
    expect(screen.getByText(/Games won today/i).nextElementSibling).toHaveTextContent('1')
  })

  it('unlocks hints after three incorrect entries', () => {
    render(<App />)
    enterGame()

    const emptyCell = document.querySelector('.cell.empty') as HTMLElement
    fireEvent.click(emptyCell)
    for (const key of ['1', '2', '3', '4', '5', '6', '7', '8', '9']) {
      fireEvent.keyDown(document, { key })
      if (screen.queryByRole('button', { name: /Get a hint/i })) break
    }

    expect(screen.getByRole('button', { name: /Get a hint/i })).toBeInTheDocument()
  })

  it('requires a purchase before the third hint', () => {
    render(<App />)
    enterGame()

    const emptyCell = document.querySelector('.cell.empty') as HTMLElement
    fireEvent.click(emptyCell)
    for (const key of ['1', '2', '3', '4', '5', '6', '7', '8', '9']) {
      fireEvent.keyDown(document, { key })
      if (screen.queryByRole('button', { name: /Get a hint/i })) break
    }

    fireEvent.click(screen.getByRole('button', { name: /Get a hint/i }))
    fireEvent.click(screen.getByRole('button', { name: /Get a hint/i }))
    expect(screen.getByRole('button', { name: /Purchase third hint/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Purchase third hint/i }))
    expect(screen.getByRole('button', { name: /Use purchased hint/i })).toBeInTheDocument()
  })

  it('supports undo and pausing the puzzle timer', () => {
    render(<App />)
    enterGame()

    const emptyCell = document.querySelector('.cell.empty') as HTMLElement
    fireEvent.click(emptyCell)
    fireEvent.keyDown(document, { key: '1' })
    expect(emptyCell).toHaveTextContent('1')

    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(emptyCell).toHaveTextContent('')

    fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument()
  })
})
