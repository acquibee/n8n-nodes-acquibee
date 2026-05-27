import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';


export class AcquibeeApi implements ICredentialType {
	name = 'acquibeeApi';
	displayName = 'Acquibee API';
	documentationUrl = 'https://app.acquibee.de/api_documentation/index.html';
	icon: Icon = 'file:acquibee-logo.svg';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://app.acquibee.de/api/v4',
			placeholder: 'https://app.acquibee.de/api/v4',
			description: 'Base URL of the Acquibee API (without trailing slash)',
		},
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your Acquibee API token',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-acquibee-token': '={{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/me',
			method: 'GET',
		},
	};
}