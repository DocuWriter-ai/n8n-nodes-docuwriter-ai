import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DocuWriterApi implements ICredentialType {
	name = 'docuWriterApi';

	displayName = 'DocuWriter.ai API';

	documentationUrl = 'https://docs.docuwriter.ai';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your DocuWriter.ai API token. Get it from your account settings.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			//default: 'https://app.docuwriter.ai',
			default: 'https://docs-ai.test',
			description: 'Base URL for DocuWriter.ai API',
		},
	];

	// Use generic authentication
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		},
	};

	// Test the credentials
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}/api',
			url: '/n8n/user-info',
			method: 'GET',
		},
	};
}