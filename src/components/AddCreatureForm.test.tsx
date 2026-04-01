import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddCreatureForm } from './AddCreatureForm'

describe('AddCreatureForm', () => {
  it('renders name, type, modifier and max hp inputs with add button', () => {
    render(<AddCreatureForm onAdd={vi.fn()} />)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Init Mod')).toBeInTheDocument()
    expect(screen.getByLabelText('Max HP')).toBeInTheDocument()
    expect(screen.getByLabelText('AC')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add/ })).toBeInTheDocument()
    expect(screen.getByText('Party')).toBeInTheDocument()
    expect(screen.getByText('Enemy')).toBeInTheDocument()
  })

  it('calls onAdd with name, modifier, creature type, maxHp, and ac on submit', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddCreatureForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Name'), 'Goblin')
    await user.clear(screen.getByLabelText('Init Mod'))
    await user.type(screen.getByLabelText('Init Mod'), '3')
    await user.clear(screen.getByLabelText('Max HP'))
    await user.type(screen.getByLabelText('Max HP'), '25')
    await user.click(screen.getByRole('button', { name: /Add/ }))

    expect(onAdd).toHaveBeenCalledWith('Goblin', 3, 'enemy', 25, 10, null)
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

    expect(onAdd).toHaveBeenCalledWith('Goblin', 0, 'enemy', 10, 10, null)
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

    expect(onAdd).toHaveBeenCalledWith('Zombie', -2, 'enemy', 10, 10, null)
  })

  it('allows switching creature type to party', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddCreatureForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Name'), 'Cleric')
    await user.click(screen.getByText('Party'))
    await user.click(screen.getByRole('button', { name: /Add/ }))

    expect(onAdd).toHaveBeenCalledWith('Cleric', 0, 'party', 10, 10, null)
  })

  describe('quantity stepper', () => {
    it('shows quantity control for enemy type', () => {
      render(<AddCreatureForm onAdd={vi.fn()} />)

      expect(screen.getByText('Qty')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('hides quantity control for party type', async () => {
      const user = userEvent.setup()
      render(<AddCreatureForm onAdd={vi.fn()} />)

      await user.click(screen.getByText('Party'))

      expect(screen.queryByText('Qty')).not.toBeInTheDocument()
    })

    it('increments and decrements quantity', async () => {
      const user = userEvent.setup()
      render(<AddCreatureForm onAdd={vi.fn()} />)

      const [minusBtn, plusBtn] = screen.getAllByRole('button').filter(
        (btn) => btn.querySelector('svg') && btn.closest('[class*="border-forge-leather"]'),
      )

      await user.click(plusBtn)
      await user.click(plusBtn)
      expect(screen.getByText('3')).toBeInTheDocument()

      await user.click(minusBtn)
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('does not go below 1', () => {
      render(<AddCreatureForm onAdd={vi.fn()} />)

      const minusBtn = screen.getAllByRole('button').find(
        (btn) => btn.querySelector('svg') && btn.closest('[class*="border-forge-leather"]') && (btn as HTMLButtonElement).disabled,
      )

      expect(minusBtn).toBeDisabled()
    })

    it('calls onAdd multiple times with numbered names when qty > 1', async () => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      render(<AddCreatureForm onAdd={onAdd} />)

      await user.type(screen.getByLabelText('Name'), 'Goblin')

      const plusBtn = screen.getAllByRole('button').filter(
        (btn) => btn.querySelector('svg') && btn.closest('[class*="border-forge-leather"]'),
      )[1]
      await user.click(plusBtn)
      await user.click(plusBtn)

      await user.click(screen.getByRole('button', { name: /Add/ }))

      expect(onAdd).toHaveBeenCalledTimes(3)
      expect(onAdd).toHaveBeenNthCalledWith(1, 'Goblin 1', 0, 'enemy', 10, 10, null)
      expect(onAdd).toHaveBeenNthCalledWith(2, 'Goblin 2', 0, 'enemy', 10, 10, null)
      expect(onAdd).toHaveBeenNthCalledWith(3, 'Goblin 3', 0, 'enemy', 10, 10, null)
    })

    it('does not number name when qty is 1', async () => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      render(<AddCreatureForm onAdd={onAdd} />)

      await user.type(screen.getByLabelText('Name'), 'Goblin')
      await user.click(screen.getByRole('button', { name: /Add/ }))

      expect(onAdd).toHaveBeenCalledTimes(1)
      expect(onAdd).toHaveBeenCalledWith('Goblin', 0, 'enemy', 10, 10, null)
    })

    it('resets quantity after submit', async () => {
      const user = userEvent.setup()
      render(<AddCreatureForm onAdd={vi.fn()} />)

      const plusBtn = screen.getAllByRole('button').filter(
        (btn) => btn.querySelector('svg') && btn.closest('[class*="border-forge-leather"]'),
      )[1]
      await user.click(plusBtn)
      await user.click(plusBtn)

      await user.type(screen.getByLabelText('Name'), 'Goblin')
      await user.click(screen.getByRole('button', { name: /Add/ }))

      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('shows count on Add button when qty > 1', async () => {
      const user = userEvent.setup()
      render(<AddCreatureForm onAdd={vi.fn()} />)

      const plusBtn = screen.getAllByRole('button').filter(
        (btn) => btn.querySelector('svg') && btn.closest('[class*="border-forge-leather"]'),
      )[1]
      await user.click(plusBtn)
      await user.click(plusBtn)

      expect(screen.getByRole('button', { name: /Add x3/ })).toBeInTheDocument()
    })

    it('resets quantity when switching to party', async () => {
      const user = userEvent.setup()
      render(<AddCreatureForm onAdd={vi.fn()} />)

      const plusBtn = screen.getAllByRole('button').filter(
        (btn) => btn.querySelector('svg') && btn.closest('[class*="border-forge-leather"]'),
      )[1]
      await user.click(plusBtn)
      await user.click(plusBtn)

      await user.click(screen.getByText('Party'))
      await user.click(screen.getByText('Enemy'))

      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })
})
