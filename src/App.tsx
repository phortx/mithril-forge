import { useEncounter } from './hooks/useEncounter'
import { AddCreatureForm } from './components/AddCreatureForm'
import { CreatureList } from './components/CreatureList'

function App() {
  const {
    creatures,
    addCreature,
    removeCreature,
    updateCreature,
    rollCreatureInitiative,
    rollAllInitiative,
  } = useEncounter()

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <h1 className="text-4xl font-bold tracking-wide">Mithril Forge</h1>
        <AddCreatureForm onAdd={addCreature} />
        <CreatureList
          creatures={creatures}
          onRemove={removeCreature}
          onRollInitiative={rollCreatureInitiative}
          onRollAll={rollAllInitiative}
          onUpdateInitiative={(id, init) =>
            updateCreature(id, { initiative: init })
          }
        />
      </div>
    </div>
  )
}

export default App
