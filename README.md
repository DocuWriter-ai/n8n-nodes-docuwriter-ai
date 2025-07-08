# n8n-nodes-docuwriter-ai

![DocuWriter.ai Logo](https://app.docuwriter.ai/logo.png)

An n8n community node that integrates with [DocuWriter.ai](https://www.docuwriter.ai) - the AI-powered platform for automated code documentation, testing, and optimization.

[![npm version](https://badge.fury.io/js/n8n-nodes-docuwriter-ai.svg)](https://badge.fury.io/js/n8n-nodes-docuwriter-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

### 🔧 Core Capabilities

- **Code Documentation Generation**: Transform source code into comprehensive, structured documentation
- **Automated Test Creation**: Generate test suites for any programming language
- **UML Diagram Generation**: Create visual representations of code architecture
- **Code Optimization**: Get AI-powered suggestions for improving code quality
- **Multi-language Support**: Works with all major programming languages
- **Batch Processing**: Handle multiple files and repositories efficiently

### 📚 Use Cases

- **CI/CD Integration**: Automatically generate documentation on code commits
- **Quality Assurance**: Create comprehensive test suites for new features
- **Code Review Automation**: Generate optimization suggestions and architectural diagrams
- **Documentation Maintenance**: Keep project documentation up-to-date automatically
- **Developer Onboarding**: Create visual guides and comprehensive documentation for new team members

## Installation

### Prerequisites

- n8n version 0.198.0 or later
- DocuWriter.ai account and API token

### Installation Methods

#### Community Nodes (Recommended)

1. In your n8n instance, go to **Settings** > **Community Nodes**
2. Click **Install a community node**
3. Enter: `n8n-nodes-docuwriter-ai`
4. Click **Install**

#### Manual Installation

```bash
# Install via npm
npm install n8n-nodes-docuwriter-ai

# Or install via pnpm
pnpm install n8n-nodes-docuwriter-ai
```

## Configuration

### 1. Get Your API Token

1. Visit [DocuWriter.ai](https://app.docuwriter.ai)
2. Sign up or log in to your account
3. Navigate to **Settings** > **API Keys**
4. Generate a new API token
5. Copy the token for use in n8n

### 2. Configure Credentials in n8n

1. In n8n, go to **Credentials**
2. Click **Create New Credential**
3. Search for and select **DocuWriter.ai API**
4. Fill in your credentials:
   - **API Token**: Your DocuWriter.ai API token
   - **Base URL**: `https://app.docuwriter.ai` (default)
5. Click **Save**

## Usage

The DocuWriter.ai integration provides two main components:

## Action Node

The DocuWriter.ai action node provides multiple resources and operations for generating content:

### Resources

#### Code Documentation
Generate comprehensive documentation from source code.

**Parameters:**
- `sourceCode` (required): The source code to analyze
- `filename` (required): Filename for context
- `mode`: Generation mode (Faster/Accurate)
- `outputLanguage`: Language for documentation (default: English)
- `documentationType`: Type of documentation to generate

#### Code Tests
Generate automated test suites.

**Parameters:**
- `sourceCode` (required): The source code to test
- `filename` (required): Filename for context
- `testFramework`: Testing framework to use
- `testType`: Type of tests (unit, integration, etc.)
- `coverageLevel`: Coverage level (basic/comprehensive/full)

#### UML Diagram
Create visual diagrams from code structure.

**Parameters:**
- `sourceCode` (required): The source code to analyze
- `filename` (required): Filename for context
- `diagramType` (required): Type of UML diagram (class, sequence, use_case, etc.)

#### Code Optimization
Get AI-powered code improvement suggestions.

**Parameters:**
- `sourceCode` (required): The source code to optimize
- `filename` (required): Filename for context
- `optimizationFocus`: Focus area (all, performance, readability, etc.)

#### Generations
Retrieve previously generated content.

**Operations:**
- `Get All`: List all generations with optional filtering
- `Get`: Retrieve a specific generation by ID

#### User Info
Get account information and remaining credits.

## Trigger Node

The DocuWriter.ai Trigger node allows you to create workflows that respond to events in DocuWriter.ai in real-time.

### Supported Events

- **Generation Created**: Triggers when a new generation is created
- **Generation Updated**: Triggers when a generation is updated

### Configuration Options

#### Event Filtering
- **Filter by Generation Type**: Filter events by specific generation types (Documentation, Tests, Code Comments, etc.)

#### Webhook Security
Each webhook subscription includes:
- **Signature Verification**: All webhooks are signed with HMAC-SHA256
- **Event Validation**: Ensures events match your subscription filters
- **Automatic Retries**: Failed webhook deliveries are automatically retried

### Webhook Payload Structure

```json
{
  "event": "generation.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "webhook_id": 123,
  "data": {
    "id": 456,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "example.js",
    "generation_type": "Documentation",
    "generated_by_user": "user@example.com",
    "created_at": "2024-01-15T10:30:00Z",
    "tag": "project-alpha"
  }
}
```

## Examples

### Basic Code Documentation

```json
{
  "resource": "codeDocumentation",
  "operation": "generate",
  "sourceCode": "function calculateTotal(items) {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}",
  "filename": "calculator.js",
  "mode": "Accurate"
}
```

### Generate Tests with Custom Framework

```json
{
  "resource": "codeTests",
  "operation": "generate",
  "sourceCode": "class User {\n  constructor(name) {\n    this.name = name;\n  }\n}",
  "filename": "User.js",
  "testFramework": "Jest",
  "coverageLevel": "comprehensive"
}
```

### Create UML Class Diagram

```json
{
  "resource": "umlDiagram",
  "operation": "generate",
  "sourceCode": "public class Vehicle {\n  private String brand;\n  public void start() {}\n}",
  "filename": "Vehicle.java",
  "diagramType": "class"
}
```

## Workflow Templates

We provide pre-built workflow templates for common use cases:

### 1. Documentation on Git Commit

Automatically generate documentation when code is committed to your repository.

**Triggers:** GitHub/GitLab webhook
**Actions:** 
- Fetch changed files
- Generate documentation
- Commit documentation back to repository
- Notify team via Slack

[View Template](./examples/workflows/code-documentation-on-commit.json)

### 2. Automated Code Quality Check

Comprehensive code analysis including tests, optimization, and UML diagrams.

**Triggers:** File upload
**Actions:**
- Generate test suites
- Optimize code
- Create UML diagrams
- Generate quality report
- Send alerts for low-quality code

[View Template](./examples/workflows/automated-testing-workflow.json)

### 3. Real-time Generation Processing

Automatically process new generations as they're created in DocuWriter.ai.

**Triggers:** DocuWriter.ai webhook (generation.created)
**Actions:**
- Fetch generation details
- Save documentation to Google Drive
- Generate and commit tests to GitHub
- Notify team via Slack

[View Template](./examples/workflows/generation-created-webhook.json)

### 4. CI/CD Integration

Integrate with your CI/CD pipeline for automated documentation and testing.

**Triggers:** Build completion
**Actions:**
- Analyze changed files
- Generate comprehensive documentation
- Create test cases
- Update project wiki

## API Reference

### Response Format

All DocuWriter.ai API responses follow this format:

```json
{
  "success": true,
  "data": {
    "generation_id": "12345",
    "filename": "example.js",
    "documentation": "# Generated Documentation\n...",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### Error Handling

When an error occurs, the response will include:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

Common error scenarios:
- **403**: Insufficient credits
- **413**: Code too long
- **422**: Validation errors
- **500**: Server errors

## Best Practices

### 1. Code Size Optimization

- Keep individual files under 100KB for optimal processing
- Use the "Faster" mode for quick iterations
- Split large files into smaller components when possible

### 2. Credit Management

- Monitor your credit usage via the User Info resource
- Use batch processing for multiple files
- Choose appropriate generation modes based on needs

### 3. Error Handling

```javascript
// Example error handling in n8n Code node
try {
  const result = $node["DocuWriter.ai"].json;
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.data;
} catch (error) {
  return { error: error.message, retry: true };
}
```

### 4. Workflow Optimization

- Use conditional logic to skip unnecessary generations
- Cache results when processing similar files
- Implement retry mechanisms for transient failures

## Rate Limits

DocuWriter.ai implements the following rate limits:

- **Free Tier**: 10 requests per minute
- **Starter Plan**: 60 requests per minute  
- **Pro Plan**: 300 requests per minute
- **Enterprise**: Custom limits

## Troubleshooting

### Common Issues

#### Authentication Failed
```
Error: Request failed with status code 401
```
**Solution**: Verify your API token in the credentials configuration.

#### Code Too Large
```
Error: The code is too long. Please shorten it.
```
**Solution**: Split large files or use the "Faster" mode which has higher limits.

#### Rate Limit Exceeded
```
Error: Too Many Requests
```
**Solution**: Implement delays between requests or upgrade your DocuWriter.ai plan.

#### No Credits Remaining
```
Error: You have no remaining credits. Please upgrade your plan.
```
**Solution**: Check your account status and upgrade your DocuWriter.ai subscription.

### Debug Mode

Enable debug logging in n8n to troubleshoot issues:

1. Set environment variable: `N8N_LOG_LEVEL=debug`
2. Check n8n logs for detailed error information
3. Verify request/response data in the execution logs

## Support

### Documentation
- [DocuWriter.ai Documentation](https://docs.docuwriter.ai)
- [n8n Community Forum](https://community.n8n.io)

### Contact
- **Email**: support@docuwriter.ai
- **Discord**: [Join our community](https://discord.gg/docuwriter)
- **GitHub Issues**: [Report bugs](https://github.com/docuwriter/n8n-nodes-docuwriter-ai/issues)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release
- Core documentation generation
- Test suite creation
- UML diagram generation
- Code optimization features
- Complete n8n integration

---

Built with ❤️ by the [DocuWriter.ai](https://www.docuwriter.ai) team