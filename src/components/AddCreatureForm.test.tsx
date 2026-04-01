import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddCreatureForm } from './AddCreatureForm'

describe('AddCreatureForm', () => {
  it('renders name, type, modifier and max hp inputs with add button', () => {
    render(<AddCreatureForm onAdd={vi.fn()} />)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Init Mod')).toBeInTheDocument()
    expect(screen.getByLabelText('Max HP')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add/ })).toBeInTheDocument()
    expect(screen.getByText('Party')).toBeInTheDocument()
    expect(screen.getByText('Enemy')).toBeInTheDocument()
  })

  it('calls onAdd with name, modifier, creature type, and maxHp on submit', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddCreatureForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Name'), 'Goblin')
    await user.clear(screen.getByLabelText('Init Mod'))
    await user.type(screen.getByLabelText('Init Mod'), '3')
    await user.clear(screen.getByLabelText('Max HP'))
    await user.type(screen.getByLabelText('Max HP'), '25')
    await user.click(screen.getByRole('button', { name: /Add/ }))

    expect(onAdd).toHaveBeenCalledWith('Goblin', 3, 'enemy', 25, null)
  })

  it('resets fields after submit', async () => {
    const user = userEvent.setup()
    render(<AddCreatureForm onAdd={vi.fn()} />)

    await user.type(screen.getByLabelText('Name'), 'Goblin')
    await user.clear(screen.getByLabelText('Init Mod'))
    await user.type(screen.getByLabelText('Init Mod'), '2')
    await user.click(screen.getByRole('button', { name: /Add/ }))

    expect(screen.getByLabelText('Name')).toHaveValue('')
    expect(screen.getByLabelText('Init Mod')).toHaveValue(0)
    expect(screen.getByLabelText('Max HP')).toHaveValue(10)
  })

  it('does not call onAdd when name is empty', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddCreatureForm onAdd={onAdd} />)

    await user.click(screen.getByRole('button', { name: /Add/ }))

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('does not call onAdd when name is only whitespace', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddCreatureForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Name'), '   ')
    await user.click(screen.getByRole('button', { name: /Add/ }))

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('trims whitespace from name', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddCreatureForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Name'), '  Goblin  ')
    await user.click(screen.getByRole('button', { name: /Add/ }))

    expect(onAdd).toHaveBeenCalledWith('Goblin', 0, 'enemy', 10, null)
  })

  it('defaults modifier to 0 and maxHp to 10', () => {
    render(<AddCreatureForm onAdd={vi.fn()} />)

    expect(screen.getByLabelText('Init Mod')).toHaveValue(0)
    expect(screen.getByLabelText('Max HP')).toHaveValue(10)
  })

  it('supports negative modifiers', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddCreatureForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Name'), 'Zombie')
    fireEvent.change(screen.getByLabelText('Init Mod'), {
      target: { value: '-2' },
    })
    await user.click(screen.getByRole('button', { name: /Add/ }))

    expect(onAdd).toHaveBeenCalledWith('Zombie', -2, 'enemy', 10, null)
  })

  it('allows switching creature type to party', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddCreatureForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Name'), 'Cleric')
    await user.click(screen.getByText('Party'))
    await user.click(screen.getByRole('button', { name: /Add/ }))

    expect(onAdd).toHaveBeenCalledWith('Cleric', 0, 'party', 10, null)
  })
})
