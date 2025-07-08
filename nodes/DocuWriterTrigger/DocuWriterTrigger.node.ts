import type {
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { NodeConnectionType } from 'n8n-workflow';

export class DocuWriterTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DocuWriter.ai Trigger',
		name: 'docuWriterTrigger',
		icon: 'file:docuwriter.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers when events happen in DocuWriter.ai',
		defaults: {
			name: 'DocuWriter.ai Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'docuWriterApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'Generation Created',
						value: 'generation.created',
						description: 'Triggers when a new generation is created',
					},
					{
						name: 'Generation Updated',
						value: 'generation.updated',
						description: 'Triggers when a generation is updated',
					},
				],
				default: 'generation.created',
				required: true,
				description: 'The event that should trigger this webhook',
			},

			{
				displayName: 'Filter by Generation Type',
				name: 'filterByGenerationType',
				type: 'boolean',
				displayOptions: {
					show: {
						event: ['generation.created', 'generation.updated'],
					},
				},
				default: false,
				description: 'Whether to filter by specific generation types',
			},
			{
				displayName: 'Generation Types',
				name: 'generationTypes',
				type: 'multiOptions',
				displayOptions: {
					show: {
						event: ['generation.created', 'generation.updated'],
						filterByGenerationType: [true],
					},
				},
				options: [
					{
						name: '[Basic] => Documentation',
						value: '[Basic] => Documentation',
					},
					{
						name: '[Basic] => Tests',
						value: '[Basic] => Tests',
					},
					{
						name: '[Basic] => Optimizer',
						value: '[Basic] => Optimizer',
					},
					{
						name: '[Basic] => Converter',
						value: '[Basic] => Converter',
					},
					{
						name: '[Basic] => Swagger API Docs',
						value: '[Basic] => Swagger API Docs',
					},
					{
						name: '[Basic] => Comment',
						value: '[Basic] => Comment',
					},
					{
						name: '[Basic] => Diagrams',
						value: '[Basic] => Diagrams',
					},
					{
						name: '[Git] => Documentation',
						value: '[Git] => Documentation',
					},
					{
						name: '[Git] => Readme',
						value: '[Git] => Readme',
					},
					{
						name: '[Git] => Full Tree Documentation',
						value: '[Git] => Full Tree Documentation',
					},
					{
						name: '[Git] => Release Notes',
						value: '[Git] => Release Notes',
					},
					{
						name: '[Git] => Codebase',
						value: '[Git] => Codebase',
					},
				],
				default: [],
				description: 'The generation types to filter for',
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const event = this.getNodeParameter('event') as string;
		const filterByGenerationType = this.getNodeParameter('filterByGenerationType') as boolean;
		
		// Only get generationTypes if filtering is enabled
		const generationTypes = filterByGenerationType 
			? this.getNodeParameter('generationTypes') as string[]
			: [];

		// Validate the webhook payload
		if (!bodyData.event || !bodyData.data) {
			return {
				webhookResponse: {
					status: 400,
					body: { error: 'Invalid webhook payload' },
				},
			};
		}

		// Check if this event matches what we're listening for
		if (bodyData.event !== event) {
			return {
				webhookResponse: {
					status: 200,
					body: { message: 'Event ignored' },
				},
			};
		}



		// Apply generation type filtering if enabled
		if (filterByGenerationType && generationTypes.length > 0) {
			const generationData = bodyData.data as IDataObject;
			if (generationData.generation_type && !generationTypes.includes(generationData.generation_type as string)) {
				return {
					webhookResponse: {
						status: 200,
						body: { message: 'Generation type filtered out' },
					},
				};
			}
		}

		// Prepare the generation data
		const generationData = bodyData.data as IDataObject;
		
		// Map generation type numbers to names (from GenerationType enum)
		const generationTypeMap: Record<string, string> = {
			'0': '[Basic] => Documentation',
			'1': '[Basic] => Tests',
			'2': '[Basic] => Optimizer',
			'3': '[Basic] => Converter',
			'5': '[Basic] => Swagger API Docs',
			'6': '[Basic] => Comment',
			'7': '[Basic] => Diagrams',
			'8': '[Git] => Documentation',
			'9': '[Git] => Readme',
			'10': '[Git] => Full Tree Documentation',
			'11': '[Git] => Release Notes',
			'12': '[Git] => Codebase',
		};
		
		// Get the generation type name
		const generationTypeName = generationData.generation_type 
			? generationTypeMap[generationData.generation_type.toString()] || 'Unknown'
			: 'Unknown';

		// Return the webhook data to be processed by the workflow
		const returnData: INodeExecutionData[] = [
			{
				json: {
					event: bodyData.event,
					timestamp: bodyData.timestamp || new Date().toISOString(),
					data: {
						uuid: generationData.uuid,
						filename: generationData.filename,
						generation_type: generationTypeName,
						generated_by_user: generationData.generated_by_user,
						updated_at: generationData.updated_at,
						tag: generationData.tag,
					},
				},
			},
		];

		return {
			webhookResponse: {
				status: 200,
				body: { message: 'Webhook received successfully' },
			},
			workflowData: [returnData],
		};
	}
} 