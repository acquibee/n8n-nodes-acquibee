import type { INodeProperties } from 'n8n-workflow';

export const clientsFields: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['client'],
			},
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items -- create first, destructive delete last
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a client',
				action: 'Create a client',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many clients',
				action: 'Get many clients',
			},
			{
				name: 'Get',
				value: 'getClientById',
				description: 'Get a client by ID',
				action: 'Get a client by ID',
			},
			{
				name: 'Update',
				value: 'updateClientById',
				description: 'Update a client by ID',
				action: 'Update a client by ID',
			},
			{
				name: 'Delete',
				value: 'deleteClientById',
				description: 'Delete a client by ID',
				action: 'Delete a client by ID',
			},
		],
		default: 'create',
		noDataExpression: true,
	},
	{
		displayName: 'Client ID',
		name: 'id',
		type: 'string',
		typeOptions: {
			minValue: 1,
		},
		required: true,
		default: '',
		description: 'ID of the client',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['getClientById', 'deleteClientById', 'updateClientById'],
			},
		},
		hint: 'Enter the numeric ID of your client. Client must belong to you or someone from your team',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Optional Fields',
		default: {},
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Client IDs',
				name: 'ids',
				type: 'string',
				default: '',
				description:
					'Comma-separated list of client IDs to fetch. Leave empty to fetch all clients.',
			},
			{
				displayName: 'Fields to Return',
				name: 'fields',
				type: 'multiOptions',
				description:
					'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getMyFieldsToReturn',
				},
				default: [],
			},
			{
				displayName: 'Get Modified Since',
				name: 'getModifiedSince',
				type: 'dateTime',
				default: '',
				description:
					'Only return clients modified since this date. Must be in the past. Format: ISO8601 (e.g., 2025-12-04T00:00:00Z) or Unix timestamp. Leave empty to ignore.',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'string',
				default: '',
				description:
					'Page number to fetch when using a limit. Defaults to the first page if not set.',
			},
			{
				displayName: 'Result Limit',
				name: 'limit',
				type: 'string',
				default: '',
				description: 'Maximum number of results to return. Leave empty to return all results.',
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['create', 'updateClientById'],
			},
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-collection-type-unsorted-items
		options: [
			{
				displayName: 'User Name or ID',
				name: 'user_id',
				type: 'options',
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getTeamMembers',
				},
			},
			{
				displayName: 'Addressed Formally',
				name: 'addressed_formally',
				type: 'boolean',
				default: false,
				description: 'Whether the client should be addressed formally',
			},
			{
				displayName: 'Birthday',
				name: 'birthday',
				type: 'dateTime',
				default: '',
				description: "Client's date of birth",
			},
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				description: 'Category or tag to classify the client',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				description: "Name of the client's company or organization",
			},
			{
				displayName: 'Division',
				name: 'division',
				type: 'string',
				default: '',
				description: 'Department or division within the company',
			},
			{
				displayName: 'Gender',
				name: 'sex',
				type: 'options',
				options: [
					{ name: 'Male', value: 'm' },
					{ name: 'Female', value: 'w' },
				],
				default: 'm',
			},
			{
				displayName: 'Language Name or ID',
				name: 'language',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getMyLanguages',
				},
				default: '',
				description:
					'Select a language dynamically loaded from the backend. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: "Client's first name",
			},
			{
				displayName: 'Surname',
				name: 'surname',
				type: 'string',
				default: '',
				description: "Client's last name",
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Honorific or professional title (e.g. Dr., Prof.)',
			},

			//
			// --- CONTACT DETAILS ---
			//
			{
				displayName: 'Address — City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City',
			},
			{
				displayName: 'Address — Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Country',
			},
			{
				displayName: 'Address — District',
				name: 'district',
				type: 'string',
				default: '',
				description: 'Borough or neighbourhood within the city',
			},
			{
				displayName: 'Address — Postcode',
				name: 'postcode',
				type: 'string',
				default: '',
				description: 'Postal or ZIP code',
			},
			{
				displayName: 'Address — Region',
				name: 'region',
				type: 'string',
				default: '',
				description: 'State, province, federal state, or region',
			},
			{
				displayName: 'Address — Street',
				name: 'street',
				type: 'string',
				default: '',
				description: 'Street name and house number',
			},

			{
				displayName: 'Email (Primary)',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: "Client's primary email address",
			},
			{
				displayName: 'Email (Newsletter)',
				name: 'newsletter',
				type: 'string',
				default: '',
				description: 'Email address used for newsletter communication',
			},
			{
				displayName: 'Fax',
				name: 'fax',
				type: 'string',
				default: '',
				description: "Client's fax number",
			},
			{
				displayName: 'Phone (Landline)',
				name: 'phone',
				type: 'string',
				default: '',
				description: "Client's landline phone number",
			},
			{
				displayName: 'Phone (Mobile)',
				name: 'mobile_phone',
				type: 'string',
				default: '',
				description: "Client's mobile phone number",
			},
			{
				displayName: 'Phone (Switchboard)',
				name: 'telephone_switchboard',
				type: 'string',
				default: '',
				description: "Company's main switchboard number",
			},
			{
				displayName: 'Phone (Telemarketing)',
				name: 'telemarketing_generic_number',
				type: 'string',
				default: '',
				description: 'Generic phone number used for telemarketing purposes',
			},

			{
				displayName: 'Skype',
				name: 'skype',
				type: 'string',
				default: '',
				description: "Client's Skype username or ID",
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: "URL of the client's website",
			},

			//
			// --- BUSINESS / COMPANY INFORMATION ---
			//
			{
				displayName: 'Business Branch',
				name: 'business_branch',
				type: 'string',
				default: '',
				description: 'Industry or business sector the client operates in',
			},
			{
				displayName: 'Employees (Company Size)',
				name: 'employees',
				type: 'options',
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items -- numeric order, not alphabetical
				options: [
					{ name: '', value: '' },
					{ name: '0', value: '0' },
					{ name: '1-9', value: '1-9' },
					{ name: '10-49', value: '10-49' },
					{ name: '50-249', value: '50-249' },
					{ name: '250-499', value: '250-499' },
					{ name: '500-999', value: '500-999' },
					{ name: '1000-4999', value: '1000-4999' },
					{ name: '5000-9999', value: '5000-9999' },
					{ name: '10000+', value: '10000+' },
				],
				default: '',
				description: 'Number of employees at the company',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'string',
				default: '',
				description: "Client's job title or position within the company",
			},

			//
			// --- LEAD / SALES INFORMATION ---
			//
			{
				displayName: 'Acquisition ID',
				name: 'acquisition_id',
				type: 'options',
				options: [
					{ name: 'New or Unprocessed', value: 1 },
					{ name: 'Decision-Maker Contacted', value: 2 },
					{ name: 'Offer / Initiation Phase', value: 3 },
					{ name: 'Customer / Deal Won', value: 4 },
					{ name: 'Cancellation, Try Again', value: 5 },
					{ name: 'Give up Acquisition', value: 6 },
					{ name: 'Expand / Reactivate Customer', value: 7 },
				],
				default: 1,
				description: 'Current stage of the acquisition process for this client',
			},
			{
				displayName: 'Estimated Sell',
				name: 'estimated_sell',
				type: 'number',
				default: 0,
				description: 'Estimated deal value for this client',
			},
			{
				displayName: 'Is Favorite',
				name: 'is_favorite',
				type: 'boolean',
				default: false,
				description: 'Whether the client is marked as a favorite',
			},
			{
				displayName: 'Probability',
				name: 'probability',
				type: 'options',
				options: [
					{ name: '0%', value: 0 },
					{ name: '20%', value: 20 },
					{ name: '40%', value: 40 },
					{ name: '60%', value: 60 },
					{ name: '80%', value: 80 },
				],
				default: 0,
				description: 'Estimated probability of closing a deal with this client',
			},
			{
				displayName: 'Qualification Status',
				name: 'qualification_status',
				type: 'options',
				options: [
					{ name: 'Yes', value: 'y' },
					{ name: 'Maybe', value: 'b' },
					{ name: 'No', value: 'n' },
				],
				default: 'y',
				description: 'Whether the client has been qualified as a potential customer',
			},

			//
			// --- BEHAVIOR / CLASSIFICATION ---
			//
			{
				displayName: 'Business Behavior',
				name: 'business_behavior',
				type: 'options',
				options: [
					{ name: '', value: '' },
					{ name: 'Conscientious', value: 'conscientious' },
					{ name: 'Dominant', value: 'dominant' },
					{ name: 'Initiative', value: 'initiative' },
					{ name: 'Steady', value: 'steady' },
				],
				default: '',
				description: 'Behavioral profile of the client in a business context',
			},

			//
			// --- MULTI-LINKED ENTITIES ---
			//
			{
				displayName: 'Campaign Names or IDs',
				name: 'campaigns',
				type: 'multiOptions',
				description:
					'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getMyCampaigns',
				},
				default: [],
			},

			{
				displayName: 'Lead Names or IDs',
				name: 'leads',
				type: 'multiOptions',
				description:
					'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getMyLeads',
				},
				default: [],
			},
			{
				displayName: 'Project Group Names or IDs',
				name: 'project_groups',
				type: 'multiOptions',
				description:
					'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getMyProjects',
				},
				default: [],
			},

			//
			// --- CUSTOM FIELDS ---
			//
			{
				displayName: 'Custom Fields',
				name: 'custom',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'field',
						displayName: 'Field',
						values: [
							{
								displayName: 'Field Name or ID',
								name: 'id',
								type: 'options',
								description:
									'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
								typeOptions: {
									loadOptionsMethod: 'getMyCustomFields',
								},
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
		],
	},
];

export const clientsOperations: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		options: [
			{
				name: 'Client',
				value: 'client',
			},
		],
		noDataExpression: true,
		required: true,
		default: 'client',
	},
];

export type CreateOrUpdateClientAdditionalFields = {
	user_id?: string | number;
	addressed_formally?: boolean;
	birthday?: string;
	category?: string;
	company?: string;
	division?: string;
	sex?: 'm' | 'w';
	language?: string;
	name?: string;
	surname?: string;
	title?: string;
	city?: string;
	country?: string;
	district?: string;
	postcode?: string;
	region?: string;
	street?: string;
	email?: string;
	fax?: string;
	phone?: string;
	mobile_phone?: string;
	telephone_switchboard?: string;
	telemarketing_generic_number?: string;
	skype?: string;
	website?: string;
	business_branch?: string;
	employees?: string;
	position?: string;
	acquisition_id?: number;
	estimated_sell?: number;
	is_favorite?: boolean;
	newsletter?: string;
	probability?: 0 | 20 | 40 | 60 | 80;
	qualification_status?: 'y' | 'b' | 'n';
	business_behavior?: '' | 'conscientious' | 'dominant' | 'initiative' | 'steady';
	campaigns?: Array<string | number>;
	leads?: Array<string | number>;
	project_groups?: Array<string | number>;
	custom?: CustomCollection | CustomPayload;
};

export type GetManyClientAdditionalFields = {
	ids?: string;
	fields?: string[];
	getModifiedSince?: string | Date;
	page?: string | number;
	limit?: string | number;
};

export type TeamMember = {
	id: string | number;
	name: string;
	surname: string;
};

export type CustomFieldPreloadData = {
	id: string | number;
	name: string;
};

export type ProjectGroup = {
	id: string | number;
	name: string;
};

export type Campaign = {
	id: string | number;
	name: string;
};

export type Lead = {
	id: string | number;
	name: string;
};

export type CustomField = {
	id: string | number;
	value: string;
};

export type CustomCollection = {
	field: CustomField[];
};

export type FieldToGet = {
	parameter_name: string;
	parameter_type: string;
	is_in_post_body: boolean;
	is_in_patch_body: boolean;
};

export type CustomPayload = Array<{ id: string | number; value: string }>;
