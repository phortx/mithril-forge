import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TurnControls } from './TurnControls'

const defaultProps = {
  isStarted: false,
  round: null as number | null,
  onStart: jest.fn(),
  onNextTurn: jest.fn(),
  onEndEncounter: jest.fn(),
}

describe('TurnControls', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows Start Encounter button when not started', () => {
    render(<TurnControls {...defaultProps} />)

    expect(
      screen.getByRole('button', { name: 'Start Encounter' }),
    ).toBeInTheDocument()
  })

  it('calls onStart when Start Encounter is clicked', async () => {
    const user = userEvent.setup()
    const onStart = jest.fn()
    render(<TurnControls {...defaultProps} onStart={onStart} />)

    await user.click(screen.getByRole('button', { name: 'Start Encounter' }))

    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('shows round number when started', () => {
    render(<TurnControls {...defaultProps} isStarted={true} round={3} />)

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Round')).toBeInTheDocument()
  })

  it('shows in-game time next to round number', () => {
    render(<TurnControls {...defaultProps} isStarted={true} round={3} />)

    expect(screen.getByText('12s')).toBeInTheDocument()
  })

  it('does not show Start Encounter button when started', () => {
    render(<TurnControls {...defaultProps} isStarted={true} round={1} />)

    expect(
      screen.queryByRole('button', { name: 'Start Encounter' }),
    ).not.toBeInTheDocument()
  })
})
