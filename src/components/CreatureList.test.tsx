import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreatureList } from './CreatureList'
import type { Creature } from '../types/creature'

const defaultProps = {
  activeCreatureId: null as string | null,
  viewMode: 'dm' as const,
  statVisibility: 'all' as const,
  onRemove: vi.fn(),
  onRollInitiative: vi.fn(),
  onUpdateInitiative: vi.fn(),
  onToggleCreatureType: vi.fn(),
  onDamage: vi.fn(),
  onHeal: vi.fn(),
  onSetTempHp: vi.fn(),
}

const mockCreatures: Creature[] = [
  { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: 15, creatureType: 'enemy', maxHp: 20, hp: 20, tempHp: 0, monsterSlug: null, ac: 10 },
  { id: '2', name: 'Dragon', initiativeModifier: -1, initiative: null, creatureType: 'enemy', maxHp: 100, hp: 100, tempHp: 0, monsterSlug: null, ac: 10 },
  { id: '3', name: 'Cleric', initiativeModifier: 0, initiative: 10, creatureType: 'party', maxHp: 30, hp: 30, tempHp: 0, monsterSlug: null, ac: 10 },
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

  it('shows modifier in DM view when expanded', async () => {
    const user = userEvent.setup()
    render(
      <CreatureList
        creatures={[
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: null, creatureType: 'enemy', maxHp: 20, hp: 20, tempHp: 0, monsterSlug: null, ac: 10 },
        ]}
        {...defaultProps}
      />,
    )

    // Click the creature card to expand it
    await user.click(screen.getByText('Goblin'))

    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('hides modifier in player view', () => {
    render(
      <CreatureList
        creatures={[
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: null, creatureType: 'enemy', maxHp: 20, hp: 20, tempHp: 0, monsterSlug: null, ac: 10 },
        ]}
        {...defaultProps}
        viewMode="player"
        readOnly
      />,
    )

    expect(screen.queryByText('+2')).not.toBeInTheDocument()
  })

  it('calls onRemove with correct id when creature is dead and expanded', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    const deadCreatures: Creature[] = [
      { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: 15, creatureType: 'enemy', maxHp: 20, hp: 0, tempHp: 0, monsterSlug: null, ac: 10 },
    ]
    render(
      <CreatureList
        creatures={deadCreatures}
        {...defaultProps}
        onRemove={onRemove}
      />,
    )

    // Click to expand the dead creature card
    await user.click(screen.getByText('Goblin'))

    const removeButton = screen.getByRole('button', { name: /Remove/ })
    await user.click(removeButton)

    expect(onRemove).toHaveBeenCalledWith('1')
  })

  it('displays initiative value when set', () => {
    render(
      <CreatureList
        creatures={[
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: 15, creatureType: 'enemy', maxHp: 20, hp: 20, tempHp: 0, monsterSlug: null, ac: 10 },
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
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: null, creatureType: 'enemy', maxHp: 20, hp: 20, tempHp: 0, monsterSlug: null, ac: 10 },
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
          { id: '1', name: 'Goblin', initiativeModifier: 2, initiative: null, creatureType: 'enemy', maxHp: 20, hp: 20, tempHp: 0, monsterSlug: null, ac: 10 },
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

  it('shows HP controls in DM view when active', () => {
    render(
      <CreatureList
        creatures={mockCreatures}
        {...defaultProps}
        activeCreatureId="1"
      />,
    )

    // Active creature should show damage controls
    expect(screen.getByLabelText('Apply damage')).toBeInTheDocument()
  })

  it('hides all HP in player view when statVisibility is none', () => {
    render(
      <CreatureList
        creatures={mockCreatures}
        {...defaultProps}
        viewMode="player"
        readOnly
        statVisibility="none"
      />,
    )

    expect(screen.queryByText(/\/20/)).not.toBeInTheDocument()
    expect(screen.queryByText(/\/100/)).not.toBeInTheDocument()
    expect(screen.queryByText(/\/30/)).not.toBeInTheDocument()
  })

  it('shows only party HP in player view when statVisibility is party-only', () => {
    render(
      <CreatureList
        creatures={mockCreatures}
        {...defaultProps}
        viewMode="player"
        readOnly
        statVisibility="party-only"
      />,
    )

    // Cleric (party) HP should be visible
    expect(screen.getByText(/30\/30/)).toBeInTheDocument()
    // Enemy HP should be hidden
    expect(screen.queryByText(/20\/20/)).not.toBeInTheDocument()
    expect(screen.queryByText(/100\/100/)).not.toBeInTheDocument()
  })
})
