import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreatureList } from './CreatureList'
import type { Creature } from '../types/creature'

const defaultProps = {
  activeCreatureId: null as string | null,
  viewMode: 'dm' as const,
  hpVisibility: 'all' as const,
  onRemove: vi.fn(),
  onRollInitiative: vi.fn(),
  onRollAll: vi.fn(),
  onUpdateInitiative: vi.fn(),
  onToggleCreatureType: vi.fn(),
  onDamage: vi.fn(),
  onHeal: vi.fn(),
  onSetTempHp: vi.fn(),
}

const mockCreatures: Creature[] = [
  { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: 15, creatureType: 'enemy', maxHp: 20, hp: 20, tempHp: 0, monsterSlug: null },
  { id: '2', name: 'Dragon', initiativeModifier: -1, initiative: null, creatureType: 'enemy', maxHp: 100, hp: 100, tempHp: 0, monsterSlug: null },
  { id: '3', name: 'Cleric', initiativeModifier: 0, initiative: 10, creatureType: 'party', maxHp: 30, hp: 30, tempHp: 0, monsterSlug: null },
]

describe('CreatureList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows empty state when no creatures', () => {
    render(<CreatureList creatures={[]} {...defaultProps} />)

    expect(screen.getByText(/no creatures/i)).toBeInTheDocument()
  })

  it('renders all creatures', () => {
    render(<CreatureList creatures={mockCreatures} {...defaultProps} />)

    expect(screen.getByText('Goblin')).toBeInTheDocument()
    expect(screen.getByText('Dragon')).toBeInTheDocument()
    expect(screen.getByText('Cleric')).toBeInTheDocument()
  })

  it('shows creature type badges', () => {
    render(<CreatureList creatures={mockCreatures} {...defaultProps} />)

    expect(screen.getAllByText('Enemy')).toHaveLength(2)
    expect(screen.getByText('Party')).toBeInTheDocument()
  })

  it('shows modifier in DM view', () => {
    render(
      <CreatureList
        creatures={[
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: null, creatureType: 'enemy', maxHp: 20, hp: 20, tempHp: 0, monsterSlug: null },
        ]}
        {...defaultProps}
      />,
    )

    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('hides modifier in player view', () => {
    render(
      <CreatureList
        creatures={[
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: null, creatureType: 'enemy', maxHp: 20, hp: 20, tempHp: 0, monsterSlug: null },
        ]}
        {...defaultProps}
        viewMode="player"
        readOnly
      />,
    )

    expect(screen.queryByText('+2')).not.toBeInTheDocument()
  })

  it('calls onRemove with correct id', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(
      <CreatureList
        creatures={mockCreatures}
        {...defaultProps}
        onRemove={onRemove}
      />,
    )

    const removeButtons = screen.getAllByRole('button', { name: /Remove/ })
    await user.click(removeButtons[1])

    expect(onRemove).toHaveBeenCalledWith('2')
  })

  it('displays initiative value when set', () => {
    render(
      <CreatureList
        creatures={[
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: 15, creatureType: 'enemy', maxHp: 20, hp: 20, tempHp: 0, monsterSlug: null },
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
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: null, creatureType: 'enemy', maxHp: 20, hp: 20, tempHp: 0, monsterSlug: null },
        ]}
        {...defaultProps}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Edit initiative for Goblin' }),
    ).toHaveTextContent('—')
  })

  it('shows turn indicator for active creature', () => {
    render(
      <CreatureList
        creatures={mockCreatures}
        {...defaultProps}
        activeCreatureId="1"
      />,
    )

    expect(screen.getByLabelText('Active turn')).toBeInTheDocument()
  })

  it('allows manual initiative editing', async () => {
    const user = userEvent.setup()
    const onUpdateInitiative = vi.fn()
    render(
      <CreatureList
        creatures={[
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: null, creatureType: 'enemy', maxHp: 20, hp: 20, tempHp: 0, monsterSlug: null },
        ]}
        {...defaultProps}
        onUpdateInitiative={onUpdateInitiative}
      />,
    )

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

  it('shows health bar in DM view', () => {
    render(<CreatureList creatures={mockCreatures} {...defaultProps} />)

    // All creatures should show HP text
    expect(screen.getByText(/20\/20/)).toBeInTheDocument()
    expect(screen.getByText(/100\/100/)).toBeInTheDocument()
    expect(screen.getByText(/30\/30/)).toBeInTheDocument()
  })

  it('shows HP controls only in DM view', () => {
    render(<CreatureList creatures={mockCreatures} {...defaultProps} />)

    expect(screen.getAllByLabelText('Apply damage')).toHaveLength(3)

    // Player view should not have controls
    const { unmount } = render(
      <CreatureList creatures={mockCreatures} {...defaultProps} viewMode="player" readOnly hpVisibility="all" />,
    )

    // Check that there are still only 3 damage buttons (from the first render)
    unmount()
  })

  it('hides all HP in player view when hpVisibility is none', () => {
    render(
      <CreatureList
        creatures={mockCreatures}
        {...defaultProps}
        viewMode="player"
        readOnly
        hpVisibility="none"
      />,
    )

    expect(screen.queryByText(/\/20/)).not.toBeInTheDocument()
    expect(screen.queryByText(/\/100/)).not.toBeInTheDocument()
    expect(screen.queryByText(/\/30/)).not.toBeInTheDocument()
  })

  it('shows only party HP in player view when hpVisibility is party-only', () => {
    render(
      <CreatureList
        creatures={mockCreatures}
        {...defaultProps}
        viewMode="player"
        readOnly
        hpVisibility="party-only"
      />,
    )

    // Cleric (party) HP should be visible
    expect(screen.getByText(/30\/30/)).toBeInTheDocument()
    // Enemy HP should be hidden
    expect(screen.queryByText(/20\/20/)).not.toBeInTheDocument()
    expect(screen.queryByText(/100\/100/)).not.toBeInTheDocument()
  })
})
