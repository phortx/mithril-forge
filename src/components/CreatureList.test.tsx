import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreatureList } from './CreatureList'
import type { Creature } from '../types/creature'

const defaultProps = {
  onRemove: vi.fn(),
  onRollInitiative: vi.fn(),
  onRollAll: vi.fn(),
  onUpdateInitiative: vi.fn(),
}

const mockCreatures: Creature[] = [
  { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: 15 },
  { id: '2', name: 'Dragon', initiativeModifier: -1, initiative: null },
  { id: '3', name: 'Zombie', initiativeModifier: 0, initiative: 10 },
]

describe('CreatureList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows empty state when no creatures', () => {
    render(<CreatureList creatures={[]} {...defaultProps} />)

    expect(screen.getByText('No creatures added yet.')).toBeInTheDocument()
  })

  it('renders all creatures', () => {
    render(<CreatureList creatures={mockCreatures} {...defaultProps} />)

    expect(screen.getByText('Goblin')).toBeInTheDocument()
    expect(screen.getByText('Dragon')).toBeInTheDocument()
    expect(screen.getByText('Zombie')).toBeInTheDocument()
  })

  it('formats positive modifier with plus sign', () => {
    render(
      <CreatureList
        creatures={[
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: null },
        ]}
        {...defaultProps}
      />,
    )

    expect(screen.getByText('Init +2')).toBeInTheDocument()
  })

  it('formats negative modifier with minus sign', () => {
    render(
      <CreatureList
        creatures={[
          {
            id: '1',
            name: 'Dragon',
            initiativeModifier: -1,
            initiative: null,
          },
        ]}
        {...defaultProps}
      />,
    )

    expect(screen.getByText('Init -1')).toBeInTheDocument()
  })

  it('formats zero modifier as +0', () => {
    render(
      <CreatureList
        creatures={[
          { id: '1', name: 'Zombie', initiativeModifier: 0, initiative: null },
        ]}
        {...defaultProps}
      />,
    )

    expect(screen.getByText('Init +0')).toBeInTheDocument()
  })

  it('calls onRemove with correct id when remove button is clicked', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(
      <CreatureList
        creatures={mockCreatures}
        {...defaultProps}
        onRemove={onRemove}
      />,
    )

    const removeButtons = screen.getAllByRole('button', { name: 'Remove' })
    await user.click(removeButtons[1])

    expect(onRemove).toHaveBeenCalledWith('2')
  })

  it('renders a remove button for each creature', () => {
    render(<CreatureList creatures={mockCreatures} {...defaultProps} />)

    const removeButtons = screen.getAllByRole('button', { name: 'Remove' })
    expect(removeButtons).toHaveLength(3)
  })

  it('displays initiative value when set', () => {
    render(
      <CreatureList
        creatures={[
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: 15 },
        ]}
        {...defaultProps}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Edit initiative for Goblin' }),
    ).toHaveTextContent('15')
  })

  it('displays dash when initiative is null', () => {
    render(
      <CreatureList
        creatures={[
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: null },
        ]}
        {...defaultProps}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Edit initiative for Goblin' }),
    ).toHaveTextContent('—')
  })

  it('calls onRollInitiative with correct id when Roll button is clicked', async () => {
    const user = userEvent.setup()
    const onRollInitiative = vi.fn()
    render(
      <CreatureList
        creatures={[
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: null },
        ]}
        {...defaultProps}
        onRollInitiative={onRollInitiative}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Roll' }))

    expect(onRollInitiative).toHaveBeenCalledWith('1')
  })

  it('calls onRollAll when Roll All Initiative button is clicked', async () => {
    const user = userEvent.setup()
    const onRollAll = vi.fn()
    render(
      <CreatureList
        creatures={mockCreatures}
        {...defaultProps}
        onRollAll={onRollAll}
      />,
    )

    await user.click(
      screen.getByRole('button', { name: 'Roll All Initiative' }),
    )

    expect(onRollAll).toHaveBeenCalledOnce()
  })

  it('does not show Roll All button when list is empty', () => {
    render(<CreatureList creatures={[]} {...defaultProps} />)

    expect(
      screen.queryByRole('button', { name: 'Roll All Initiative' }),
    ).not.toBeInTheDocument()
  })

  it('allows manual initiative editing', async () => {
    const user = userEvent.setup()
    const onUpdateInitiative = vi.fn()
    render(
      <CreatureList
        creatures={[
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: null },
        ]}
        {...defaultProps}
        onUpdateInitiative={onUpdateInitiative}
      />,
    )

    // Click the initiative display to start editing
    await user.click(
      screen.getByRole('button', { name: 'Edit initiative for Goblin' }),
    )

    const input = screen.getByRole('spinbutton', {
      name: 'Initiative for Goblin',
    })
    await user.type(input, '18')
    await user.keyboard('{Enter}')

    expect(onUpdateInitiative).toHaveBeenCalledWith('1', 18)
  })
})
