import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INode,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import {
	clientsOperations,
	clientsFields,
	CreateOrUpdateClientAdditionalFields,
	GetManyClientAdditionalFields, TeamMember, CustomFieldPreloadData, ProjectGroup, Campaign, Lead,
	CustomField, FieldToGet,
} from './clientDescription';
import { acquibeeApiRequest, formatBirthday } from './GenericFunctions';

type ClientCreateOrUpdateBody = CreateOrUpdateClientAdditionalFields & {
	campaigns: Array<string | number>;
	project_groups: Array<string | number>;
	leads: Array<string | number>;
};

function buildClientCreateOrUpdateBody(
	node: INode,
	additionalFields: CreateOrUpdateClientAdditionalFields,
): ClientCreateOrUpdateBody {
	const body: ClientCreateOrUpdateBody = {
		campaigns: [],
		project_groups: [],
		leads: [],
		...additionalFields,
	};

	if (additionalFields.birthday) {
		body.birthday = formatBirthday(node, additionalFields.birthday);
	}

	if (
		additionalFields.custom &&
		'field' in additionalFields.custom &&
		Array.isArray(additionalFields.custom.field)
	) {
		const customArray: Array<{ id: string | number; value: string }> =
			additionalFields.custom.field.map((f: CustomField) => ({
				id: f.id,
				value: f.value,
			}));

		body.custom = customArray;
	}

	const multiValueKeys: Array<'campaigns' | 'project_groups' | 'leads'> = [
		'campaigns',
		'project_groups',
		'leads',
	];

	multiValueKeys.forEach((key) => {
		const value = additionalFields[key];
		if (Array.isArray(value)) {
			body[key] = value;
		}
	});

	return body;
}

export class Acquibee implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Acquibee',
		name: 'acquibee',
		icon: 'file:acquibee-logo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Acquibee Client API',
		defaults: { name: 'Acquibee' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],

		credentials: [
			{
				name: 'acquibeeApi',
				required: true,
			},
		],

		properties: [...clientsOperations, ...clientsFields],
		usableAsTool: true,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const formattedResponse: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource: string = this.getNodeParameter('resource', i);
			const operation: string = this.getNodeParameter('operation', i);

			let response: unknown;

			try {

			// create client
			if (resource === 'client' && operation === 'create') {
				const additionalFields = this.getNodeParameter(
					'additionalFields',
					i,
				) as CreateOrUpdateClientAdditionalFields;
				const body = buildClientCreateOrUpdateBody(this.getNode(), additionalFields);

				response = await acquibeeApiRequest.call(this, {
					url: '/clients',
					method: 'POST',
					body,
				});

				if (response !== undefined && response !== null) {
					if (typeof response === 'number') {
						formattedResponse.push({ json: { id: response } as IDataObject, pairedItem: { item: i } });
					} else if (typeof response === 'object') {
						formattedResponse.push({ json: response as IDataObject, pairedItem: { item: i } });
					} else {
						formattedResponse.push({ json: { result: response } as IDataObject, pairedItem: { item: i } });
					}
				}
			}

			// update client by ID
			if (resource === 'client' && operation === 'updateClientById') {
				const additionalFields = this.getNodeParameter(
					'additionalFields',
					i,
				) as CreateOrUpdateClientAdditionalFields;
				const id = this.getNodeParameter('id', i) as number;

				if (!id || id <= 0) {
					throw new NodeOperationError(this.getNode(), 'Client ID must be a positive number.', { itemIndex: i });
				}
				const body = buildClientCreateOrUpdateBody(this.getNode(), additionalFields);

				response = await acquibeeApiRequest.call(this, {
					url: `/clients/${id}`,
					method: 'PATCH',
					body,
				});

				formattedResponse.push({ json: (response ?? {}) as IDataObject, pairedItem: { item: i } });
			}

			// get many
			if (resource === 'client' && operation === 'getMany') {
				const qs: Record<string, string> = {};
				const additionalFields = this.getNodeParameter(
					'additionalFields',
					i,
				) as GetManyClientAdditionalFields;

				if (additionalFields.ids) qs.id = additionalFields.ids;
				if (additionalFields.page !== undefined) qs.page = additionalFields.page.toString();
				if (additionalFields.limit !== undefined) qs.limit = additionalFields.limit.toString();

				if (additionalFields.getModifiedSince) {
					const selectedDate = new Date(additionalFields.getModifiedSince);
					const now = new Date();

					if (selectedDate > now) {
						throw new NodeOperationError(
							this.getNode(),
							'The "Get Modified Since" date must be in the past.',
							{ itemIndex: i },
						);
					}

					qs.getModifiedSince = selectedDate.toISOString();
				}

				if (additionalFields.fields && Array.isArray(additionalFields.fields)) {
					qs.fields = additionalFields.fields.join(',');
				}

				response = await acquibeeApiRequest.call(this, {
					url: '/clients',
					method: 'GET',
					qs,
				});

				if (Array.isArray(response)) {
					for (const client of response) {
						formattedResponse.push({ json: client as IDataObject, pairedItem: { item: i } });
					}
				} else {
					formattedResponse.push({ json: (response ?? {}) as IDataObject, pairedItem: { item: i } });
				}
			}

			// get by id
			if (resource === 'client' && operation === 'getClientById') {
				const id = this.getNodeParameter('id', i) as number;

				if (!id || id <= 0) {
					throw new NodeOperationError(this.getNode(), 'Client ID must be a positive number.', { itemIndex: i });
				}

				response = await acquibeeApiRequest.call(this, {
					url: `/clients/${id}`,
					method: 'GET',
				});

				formattedResponse.push({ json: (response ?? {}) as IDataObject, pairedItem: { item: i } });
			}

			// delete client by ID
			if (resource === 'client' && operation === 'deleteClientById') {
				const id = this.getNodeParameter('id', i) as number;

				if (!id || id <= 0) {
					throw new NodeOperationError(this.getNode(), 'Client ID must be a positive number.', { itemIndex: i });
				}

				await acquibeeApiRequest.call(this, {
					url: `/clients/${id}`,
					method: 'DELETE',
				});

				formattedResponse.push({ json: { success: true, message: 'Deleted', id }, pairedItem: { item: i } });
			}

			} catch (error) {
				if (this.continueOnFail()) {
					formattedResponse.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
				} else {
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
				}
			}
		}

		return [formattedResponse];
	}

	methods = {
		loadOptions: {
			async getTeamMembers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await acquibeeApiRequest.call(this, {
					url: '/getMyTeamMembers',
					method: 'GET',
				}) as TeamMember[];

				return response
					.map((member) => ({
						name: `${member.name} ${member.surname}`.trim(),
						value: Number(member.id),
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getMyCustomFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await acquibeeApiRequest.call(this, {
					url: '/getMyCustomFields',
					method: 'GET',
				}) as CustomFieldPreloadData[];

				return response
					.map((field) => ({
						name: field.name,
						value: field.id,
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getMyProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await acquibeeApiRequest.call(this, {
					url: '/project_groups',
					method: 'GET',
				}) as ProjectGroup[];

				return response
					.map((project) => ({
						name: project.name,
						value: project.id,
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getMyCampaigns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await acquibeeApiRequest.call(this, {
					url: '/campaigns',
					method: 'GET',
				}) as Campaign[];

				return response
					.map((campaign) => ({
						name: campaign.name,
						value: campaign.id,
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getMyLeads(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await acquibeeApiRequest.call(this, {
					url: '/leads',
					method: 'GET',
				}) as Lead[];

				return response
					.map((lead) => ({
						name: lead.name,
						value: lead.id,
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			},
			async getMyFieldsToReturn(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await acquibeeApiRequest.call(this, {
					url: '/clients/meta',
					method: 'GET',
				}) as FieldToGet[];

				return response
					.map((field) => ({
						name: field.parameter_name,
						value: field.parameter_name,
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			},
			async getMyLanguages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await acquibeeApiRequest.call(this, {
					url: '/user/languages',
					method: 'GET',
				}) as Array<{ name: string; value: string }>;

				return response
					.map((field) => ({
						name: field.name,
						value: field.value,
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			}
		},
	};
}
