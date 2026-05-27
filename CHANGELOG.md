# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-05-27

### Added

- Initial release of the Acquibee n8n community node
- **Client resource** with the following operations:
  - **Create** — create a new client record
  - **Get Many** — retrieve a paginated list of clients with optional filtering by IDs, date modified, and field selection
  - **Get a Client** — retrieve a single client by ID
  - **Update a Client** — update an existing client by ID
  - **Delete a Client** — delete a client by ID
- Dynamic option loaders for Team Members, Custom Fields, Project Groups, Campaigns, Leads, and Languages
- Support for custom fields via `fixedCollection` UI
- Birthday auto-formatting (accepts ISO 8601 and `DD.MM.YYYY`)
- API authentication via `x-acquibee-token` header
