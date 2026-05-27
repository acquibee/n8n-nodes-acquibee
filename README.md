# n8n-nodes-acquibee

This is an n8n community node. It lets you use [Acquibee](https://acquibee.de) in your n8n workflows.

Acquibee is a CRM and sales automation platform that helps teams manage clients, leads, campaigns, and project groups.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)
[Version history](#version-history)

---

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

```
npm install n8n-nodes-acquibee
```

---

## Operations

### Client

| Operation | Description |
|-----------|-------------|
| **Create** | Create a new client record |
| **Get Many** | Retrieve a paginated list of clients (filter by IDs, date modified, selected fields) |
| **Get a Client** | Retrieve a single client by ID |
| **Update a Client** | Update an existing client by ID |
| **Delete a Client** | Delete a client by ID |

**Supported fields for Create / Update:**

- Personal: Name, Surname, Title, Gender, Birthday, Language
- Company: Company, Division, Category, Position, Business Branch, Employees
- Address: Street, City, Postcode, District, Region, Country
- Contact: Email, Phone (Landline / Mobile / Switchboard / Telemarketing), Fax, Skype, Website, Newsletter
- Sales: Acquisition ID, Qualification Status, Probability, Estimated Sell, Is Favorite, Business Behavior
- Relations: Campaigns, Leads, Project Groups, Custom Fields
- Assignment: User (team member)

---

## Credentials

To connect your Acquibee account:

1. Log in to [Acquibee](https://app.acquibee.de)
2. Navigate to your profile settings and generate an API token
3. In n8n, create a new **Acquibee API** credential
4. Enter your **API Token**
5. Optionally override the **Base URL** (default: `https://app.acquibee.de/api/v4`)

For full API reference see the [Acquibee API documentation](https://app.acquibee.de/api_documentation/index.html).

---

## Compatibility

- Tested against **n8n v1.x**
- Requires `n8n-workflow` peer dependency (installed automatically with n8n)
- Node API version: `1`

---

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Acquibee API documentation](https://app.acquibee.de/api_documentation/index.html)
- [Source code](https://github.com/acquibee/n8n-nodes-acquibee)

---

## Version history

### 0.1.0

Initial release. Supports full CRUD operations on the **Client** resource.
