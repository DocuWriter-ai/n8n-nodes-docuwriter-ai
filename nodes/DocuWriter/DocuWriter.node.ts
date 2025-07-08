import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

import { NodeOperationError } from 'n8n-workflow';

export class DocuWriter implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DocuWriter.ai',
		name: 'docuWriter',
		icon: 'file:docuwriter.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Generate AI-powered documentation and code analysis',
		defaults: {
			name: 'DocuWriter.ai',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'docuWriterApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}/api',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Code Documentation',
						value: 'codeDocumentation',
					},
					{
						name: 'Code Tests',
						value: 'codeTests',
					},
					{
						name: 'UML Diagram',
						value: 'umlDiagram',
					},
					{
						name: 'Code Optimization',
						value: 'codeOptimization',
					},
					{
						name: 'Generations',
						value: 'generations',
					},
					{
						name: 'User Info',
						value: 'userInfo',
					},
				],
				default: 'codeDocumentation',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['codeDocumentation'],
					},
				},
				options: [
					{
						name: 'Generate',
						value: 'generate',
						description: 'Generate documentation from source code',
						action: 'Generate code documentation',
					},
				],
				default: 'generate',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['codeTests'],
					},
				},
				options: [
					{
						name: 'Generate',
						value: 'generate',
						description: 'Generate test cases from source code',
						action: 'Generate code tests',
					},
				],
				default: 'generate',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['umlDiagram'],
					},
				},
				options: [
					{
						name: 'Generate',
						value: 'generate',
						description: 'Generate UML diagram from source code',
						action: 'Generate UML diagram',
					},
				],
				default: 'generate',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['codeOptimization'],
					},
				},
				options: [
					{
						name: 'Optimize',
						value: 'optimize',
						description: 'Optimize and refactor source code',
						action: 'Optimize code',
					},
				],
				default: 'optimize',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['generations'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all generations',
						action: 'Get all generations',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific generation',
						action: 'Get generation',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['userInfo'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get user account information',
						action: 'Get user info',
					},
				],
				default: 'get',
			},

			// Code Documentation Fields
			{
				displayName: 'Source Code',
				name: 'sourceCode',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				displayOptions: {
					show: {
						resource: ['codeDocumentation', 'codeTests', 'umlDiagram', 'codeOptimization'],
						operation: ['generate', 'optimize'],
					},
				},
				default: '',
				required: true,
				description: 'The source code to analyze',
			},
			{
				displayName: 'Filename',
				name: 'filename',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['codeDocumentation', 'codeTests', 'umlDiagram', 'codeOptimization'],
						operation: ['generate', 'optimize'],
					},
				},
				default: 'code.js',
				required: true,
				description: 'The filename for the source code',
			},
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['codeDocumentation'],
						operation: ['generate'],
					},
				},
				options: [
					{
						name: 'Faster',
						value: 'Faster',
					},
					{
						name: 'Accurate',
						value: 'Accurate',
					},
				],
				default: 'Faster',
				description: 'Generation mode - Faster for quick results, Accurate for detailed analysis',
			},
			{
				displayName: 'Output Language',
				name: 'outputLanguage',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['codeDocumentation'],
						operation: ['generate'],
					},
				},
				default: 'English',
				description: 'Language for the generated documentation',
			},
			{
				displayName: 'Documentation Type',
				name: 'documentationType',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['codeDocumentation'],
						operation: ['generate'],
					},
				},
				default: 'Technical Documentation',
				description: 'Type of documentation to generate',
			},

			// UML Diagram Fields
			{
				displayName: 'Diagram Type',
				name: 'diagramType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['umlDiagram'],
						operation: ['generate'],
					},
				},
				options: [
					{
						name: 'Class Diagram',
						value: 'class',
					},
					{
						name: 'Sequence Diagram',
						value: 'sequence',
					},
					{
						name: 'Use Case Diagram',
						value: 'use_case',
					},
					{
						name: 'Activity Diagram',
						value: 'activity',
					},
					{
						name: 'Component Diagram',
						value: 'component',
					},
					{
						name: 'State Diagram',
						value: 'state',
					},
					{
						name: 'Object Diagram',
						value: 'object',
					},
				],
				default: 'class',
				required: true,
				description: 'Type of UML diagram to generate',
			},

			// Code Tests Fields
			{
				displayName: 'Test Framework',
				name: 'testFramework',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['codeTests'],
						operation: ['generate'],
					},
				},
				default: 'auto-detect',
				description: 'Testing framework to use (e.g., Jest, PHPUnit, JUnit)',
			},
			{
				displayName: 'Test Type',
				name: 'testType',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['codeTests'],
						operation: ['generate'],
					},
				},
				default: 'unit tests',
				description: 'Type of tests to generate',
			},
			{
				displayName: 'Coverage Level',
				name: 'coverageLevel',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['codeTests'],
						operation: ['generate'],
					},
				},
				options: [
					{
						name: 'Basic',
						value: 'basic',
					},
					{
						name: 'Comprehensive',
						value: 'comprehensive',
					},
					{
						name: 'Full',
						value: 'full',
					},
				],
				default: 'comprehensive',
				description: 'Level of test coverage to generate',
			},

			// Code Optimization Fields
			{
				displayName: 'Optimization Focus',
				name: 'optimizationFocus',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['codeOptimization'],
						operation: ['optimize'],
					},
				},
				options: [
					{
						name: 'All',
						value: 'all',
					},
					{
						name: 'Performance',
						value: 'performance',
					},
					{
						name: 'Readability',
						value: 'readability',
					},
					{
						name: 'Maintainability',
						value: 'maintainability',
					},
					{
						name: 'Security',
						value: 'security',
					},
				],
				default: 'all',
				description: 'Focus area for code optimization',
			},

			// Generations Fields
			{
				displayName: 'Generation ID',
				name: 'generationId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['generations'],
						operation: ['get'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the generation to retrieve',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['generations'],
						operation: ['getAll'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 20,
				description: 'Number of generations to return',
			},
			{
				displayName: 'Type Filter',
				name: 'typeFilter',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['generations'],
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'Filter generations by type (optional)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				if (resource === 'codeDocumentation') {
					if (operation === 'generate') {
						const sourceCode = this.getNodeParameter('sourceCode', i) as string;
						const filename = this.getNodeParameter('filename', i) as string;
						const mode = this.getNodeParameter('mode', i) as string;
						const outputLanguage = this.getNodeParameter('outputLanguage', i) as string;
						const documentationType = this.getNodeParameter('documentationType', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'docuWriterApi',
							{
								method: 'POST',
								url: '/n8n/code-documentation',
								body: {
									source_code: sourceCode,
									filename,
									mode,
									output_language: outputLanguage,
									documentation_type: documentationType,
								},
								json: true,
							},
						);
					}
				} else if (resource === 'codeTests') {
					if (operation === 'generate') {
						const sourceCode = this.getNodeParameter('sourceCode', i) as string;
						const filename = this.getNodeParameter('filename', i) as string;
						const testFramework = this.getNodeParameter('testFramework', i) as string;
						const testType = this.getNodeParameter('testType', i) as string;
						const coverageLevel = this.getNodeParameter('coverageLevel', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'docuWriterApi',
							{
								method: 'POST',
								url: '/n8n/code-tests',
								body: {
									source_code: sourceCode,
									filename,
									test_framework: testFramework,
									test_type: testType,
									coverage_level: coverageLevel,
								},
								json: true,
							},
						);
					}
				} else if (resource === 'umlDiagram') {
					if (operation === 'generate') {
						const sourceCode = this.getNodeParameter('sourceCode', i) as string;
						const filename = this.getNodeParameter('filename', i) as string;
						const diagramType = this.getNodeParameter('diagramType', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'docuWriterApi',
							{
								method: 'POST',
								url: '/n8n/uml-diagram',
								body: {
									source_code: sourceCode,
									filename,
									diagram_type: diagramType,
								},
								json: true,
							},
						);
					}
				} else if (resource === 'codeOptimization') {
					if (operation === 'optimize') {
						const sourceCode = this.getNodeParameter('sourceCode', i) as string;
						const filename = this.getNodeParameter('filename', i) as string;
						const optimizationFocus = this.getNodeParameter('optimizationFocus', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'docuWriterApi',
							{
								method: 'POST',
								url: '/n8n/optimize-code',
								body: {
									source_code: sourceCode,
									filename,
									optimization_focus: optimizationFocus,
								},
								json: true,
							},
						);
					}
				} else if (resource === 'generations') {
					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i) as number;
						const typeFilter = this.getNodeParameter('typeFilter', i) as string;

						const qs: IDataObject = { limit };
						if (typeFilter) {
							qs.type = typeFilter;
						}

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'docuWriterApi',
							{
								method: 'GET',
								url: '/n8n/generations',
								qs,
								json: true,
							},
						);
					} else if (operation === 'get') {
						const generationId = this.getNodeParameter('generationId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'docuWriterApi',
							{
								method: 'GET',
								url: `/n8n/generation/${generationId}`,
								json: true,
							},
						);
					}
				} else if (resource === 'userInfo') {
					if (operation === 'get') {
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'docuWriterApi',
							{
								method: 'GET',
								url: '/n8n/user-info',
								json: true,
							},
						);
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}