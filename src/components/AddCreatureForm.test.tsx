import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddCreatureForm } from './AddCreatureForm'

describe('AddCreatureForm', () => {
  it('renders name and modifier inputs with add button', () => {
    render(<AddCreatureForm onAdd={vi.fn()} />)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Initiative Modifier')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })

  it('calls onAdd with name and modifier on submit', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddCreatureForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Name'), 'Goblin')
    await user.clear(screen.getByLabelText('Initiative Modifier'))
    await user.type(screen.getByLabelText('Initiative Modifier'), '3')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).toHaveBeenCalledWith('Goblin', 3)
  })

  it('resets fields after submit', async () => {
    const user = userEvent.setup()
    render(<AddCreatureForm onAdd={vi.fn()} />)

    await user.type(screen.getByLabelText('Name'), 'Goblin')
    await user.clear(screen.getByLabelText('Initiative Modifier'))
    await user.type(screen.getByLabelText('Initiative Modifier'), '2')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByLabelText('Name')).toHaveValue('')
    expect(screen.getByLabelText('Initiative Modifier')).toHaveValue(0)
  })

  it('does not call onAdd when name is empty', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddCreatureForm onAdd={onAdd} />)

    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('does not call onAdd when name is only whitespace', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddCreatureForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Name'), '   ')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('trims whitespace from name', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddCreatureForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Name'), '  Goblin  ')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).toHaveBeenCalledWith('Goblin', 0)
  })

  it('defaults modifier to 0', () => {
    render(<AddCreatureForm onAdd={vi.fn()} />)

    expect(screen.getByLabelText('Initiative Modifier')).toHaveValue(0)
  })

  it('supports negative modifiers', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddCreatureForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Name'), 'Zombie')
    // userEvent.type doesn't handle minus sign reliably on number inputs,
    // so we use fireEvent.change for this case
    fireEvent.change(screen.getByLabelText('Initiative Modifier'), {
      target: { value: '-2' },
    })
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).toHaveBeenCalledWith('Zombie', -2)
  })
})
