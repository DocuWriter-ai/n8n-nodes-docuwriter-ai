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
						name: 'Documentation',
						value: 'Documentation',
					},
					{
						name: 'Tests',
						value: 'Tests',
					},
					{
						name: 'Code Comments',
						value: 'Code Comments',
					},
					{
						name: 'Code Optimization',
						value: 'Code Optimization',
					},
					{
						name: 'UML Diagram',
						value: 'UML Diagram',
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
		const generationTypes = this.getNodeParameter('generationTypes') as string[];

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

		// Return the webhook data to be processed by the workflow
		const returnData: INodeExecutionData[] = [
			{
				json: {
					event: bodyData.event,
					timestamp: bodyData.timestamp || new Date().toISOString(),
					data: bodyData.data,
					webhook_id: bodyData.webhook_id,
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