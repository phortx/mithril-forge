import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TurnControls } from './TurnControls'

const defaultProps = {
  isStarted: false,
  round: null as number | null,
  onStart: vi.fn(),
  onNextTurn: vi.fn(),
  onEndEncounter: vi.fn(),
}

describe('TurnControls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows Start Encounter button when not started', () => {
    render(<TurnControls {...defaultProps} />)

    expect(
      screen.getByRole('button', { name: 'Start Encounter' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Next Turn' }),
    ).not.toBeInTheDocument()
  })

  it('calls onStart when Start Encounter is clicked', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()
    render(<TurnControls {...defaultProps} onStart={onStart} />)

    await user.click(screen.getByRole('button', { name: 'Start Encounter' }))

    expect(onStart).toHaveBeenCalledOnce()
  })

  it('shows in-game time next to round number', () => {
    render(<TurnControls {...defaultProps} isStarted={true} round={3} />)

    expect(screen.getByText('12s')).toBeInTheDocument()
  })

  it('shows round number and Next Turn when started', () => {
    render(<TurnControls {...defaultProps} isStarted={true} round={3} />)

    expect(screen.getByText('Round 3')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Next Turn' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'End Encounter' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Start Encounter' }),
    ).not.toBeInTheDocument()
  })

  it('calls onNextTurn when Next Turn is clicked', async () => {
    const user = userEvent.setup()
    const onNextTurn = vi.fn()
    render(
      <TurnControls
        {...defaultProps}
        isStarted={true}
        round={1}
        onNextTurn={onNextTurn}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Next Turn' }))

    expect(onNextTurn).toHaveBeenCalledOnce()
  })

  it('calls onEndEncounter when End Encounter is clicked', async () => {
    const user = userEvent.setup()
    const onEndEncounter = vi.fn()
    render(
      <TurnControls
        {...defaultProps}
        isStarted={true}
        round={1}
        onEndEncounter={onEndEncounter}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'End Encounter' }))

    expect(onEndEncounter).toHaveBeenCalledOnce()
  })
})
