<div align="center">

<img src="assets/logo.svg" alt="Mithril Forge Logo" width="250" />

# Mithril Forge

**D&D Encounter Tracker: Right in Your Browser**

Track initiative, HP, and more across two screens.
One for the DM, one for the players. No account. No cost.

[Mithril Forge SaaS](https://www.mithril-forge.site) · [Report a Bug](https://github.com/phortx/mithril-forge/issues) · [Support on Ko-fi](https://ko-fi.com/phortx)

</div>

---

Mithril Forge replaces paper initiative cards with a browser-based tracker designed for the tabletop. It syncs the encounter state automatically between a DM view (with full stat blocks and controls) and a Player view (showing the initiative order and public information) via local storage.

## Documentation

Comprehensive documentation for both users and developers is available:

- **[User Manual](https://mithril-forge.up.railway.app/documentation/user-manual)**: Learn how to manage encounters, track combat, and use the interface.
- **[Technical Documentation](https://mithril-forge.up.railway.app/documentation/technical-docs)**: Find setup guides, CLI commands, tech stack details, and deployment instructions.

To view the documentation locally:
```bash
just dev-docs
```

## Quick Start

If you want to run or develop Mithril Forge locally, ensure you have Bun, Java, Docker, and `just` installed.

```bash
just install    # Install dependencies
just dev        # Start backend and frontend
```

For full details, please refer to the [Development Setup guide](https://mithril-forge.up.railway.app/documentation/technical-docs/how-to/development-setup).

## License

Licensed under the [GNU General Public License v3.0](LICENSE).
