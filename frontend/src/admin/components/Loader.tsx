export function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-forge-darkest text-forge-parchment">
      <div
        className="font-heading tracking-widest text-forge-tan uppercase text-sm"
        data-testid="admin-loader"
      >
        Loading…
      </div>
    </div>
  )
}
