import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreatureList } from './CreatureList'
import type { Creature } from '../types/creature'

const mockCreatures: Creature[] = [
  { id: '1', name: 'Goblin', initiativeModifier: 2 },
  { id: '2', name: 'Dragon', initiativeModifier: -1 },
  { id: '3', name: 'Zombie', initiativeModifier: 0 },
]

describe('CreatureList', () => {
  it('shows empty state when no creatures', () => {
    render(<CreatureList creatures={[]} onRemove={vi.fn()} />)

    expect(screen.getByText('No creatures added yet.')).toBeInTheDocument()
  })

  it('renders all creatures', () => {
    render(<CreatureList creatures={mockCreatures} onRemove={vi.fn()} />)

    expect(screen.getByText('Goblin')).toBeInTheDocument()
    expect(screen.getByText('Dragon')).toBeInTheDocument()
    expect(screen.getByText('Zombie')).toBeInTheDocument()
  })

  it('formats positive modifier with plus sign', () => {
    render(
      <CreatureList
        creatures={[{ id: '1', name: 'Goblin', initiativeModifier: 2 }]}
        onRemove={vi.fn()}
      />,
    )

    expect(screen.getByText('Init +2')).toBeInTheDocument()
  })

  it('formats negative modifier with minus sign', () => {
    render(
      <CreatureList
        creatures={[{ id: '1', name: 'Dragon', initiativeModifier: -1 }]}
        onRemove={vi.fn()}
      />,
    )

    expect(screen.getByText('Init -1')).toBeInTheDocument()
  })

  it('formats zero modifier as +0', () => {
    render(
      <CreatureList
        creatures={[{ id: '1', name: 'Zombie', initiativeModifier: 0 }]}
        onRemove={vi.fn()}
      />,
    )

    expect(screen.getByText('Init +0')).toBeInTheDocument()
  })

  it('calls onRemove with correct id when remove button is clicked', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<CreatureList creatures={mockCreatures} onRemove={onRemove} />)

    const removeButtons = screen.getAllByRole('button', { name: 'Remove' })
    await user.click(removeButtons[1])

    expect(onRemove).toHaveBeenCalledWith('2')
  })

  it('renders a remove button for each creature', () => {
    render(<CreatureList creatures={mockCreatures} onRemove={vi.fn()} />)

    const removeButtons = screen.getAllByRole('button', { name: 'Remove' })
    expect(removeButtons).toHaveLength(3)
  })
})
