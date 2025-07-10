# Five Whys MCP Server

A Model Context Protocol (MCP) server that implements the 5 Whys methodology for systematic root cause analysis. This tool helps developers and problem-solvers identify the root cause of issues through structured questioning.

## What is the 5 Whys Methodology?

The 5 Whys is a problem-solving technique that involves asking "why" repeatedly (typically 5 times) to drill down to the root cause of a problem. It's particularly effective for:

- Debugging complex software issues
- Understanding system failures
- Identifying process bottlenecks
- Analyzing user experience problems
- Investigating production incidents

## Features

- **Interactive Analysis**: Guides you through the 5 Whys process step by step
- **State Management**: Maintains analysis state across multiple interactions
- **Multiple Export Formats**: Export results as Markdown, JSON, or plain text
- **Root Cause Identification**: Automatically identifies the root cause after completion
- **Reset & Restart**: Easily start fresh analyses
- **MCP Integration**: Works seamlessly with Claude and other MCP-compatible tools

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Install the Package

```bash
npm install @schwepps/five-whys-mcp-server
```

### Add to Claude Code

**Option 1: Automatic Installation (Recommended)**

Use the Claude CLI command to add the server automatically:

```bash
claude mcp add five-whys npx @schwepps/five-whys-mcp-server
```

This command will:
- Add the server to your Claude configuration
- No manual file editing required
- Works with both Claude Desktop and Claude Code

**Option 2: Manual Installation**

1. Open your Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

2. Add the server configuration:

```json
{
  "mcpServers": {
    "five-whys": {
      "command": "npx",
      "args": ["@schwepps/five-whys-mcp-server"]
    }
  }
}
```

3. Restart Claude Desktop

## Usage

Once installed and configured, you can use the following tools in Claude Code:

### 1. Start a New Analysis

Ask Claude to start a 5 whys analysis with your problem statement:

**Claude Code Examples:**
```
"Start a 5 whys analysis for: The website is loading slowly for users"

"Help me analyze why our CI/CD pipeline keeps failing"

"I need to do a root cause analysis on this bug: Users can't log in after the latest update"
```

**What happens:**
- Claude will use the `start_five_whys` tool
- You'll get the first "why" question to answer
- The analysis session begins

### 2. Answer Why Questions

Respond naturally to Claude's "why" questions during the analysis:

**Claude Code Examples:**
```
"The database queries are taking too long"

"Because there are no indexes on the user_activity table"

"The development team didn't know about indexing best practices"
```

**What happens:**
- Claude uses the `answer_why` tool with your response
- You get the next "why" question automatically
- Progress is tracked (e.g., "Question 2/5")

### 3. Check Current State

Ask Claude to show your current progress:

**Claude Code Examples:**
```
"Show me the current state of my 5 whys analysis"

"What's my progress on the root cause analysis?"

"Can you display where we are in the analysis?"
```

**What happens:**
- Claude uses the `get_current_state` tool
- You see all questions and answers so far
- Current progress and next steps are displayed

### 4. Export Results

Request your complete analysis in different formats:

**Claude Code Examples:**
```
"Export my 5 whys analysis as markdown"

"Give me the analysis results in JSON format"

"Can you export this as a text summary I can share with my team?"
```

**Available formats:**
- `markdown` - Rich formatted document (default)
- `json` - Structured data format
- `text` - Plain text summary

**What happens:**
- Claude uses the `export_analysis` tool
- You get a complete formatted report
- Perfect for documentation or sharing

### 5. Reset Analysis

Start fresh when needed:

**Claude Code Examples:**
```
"Reset the current analysis, I want to start over"

"Clear this analysis and let me begin with a new problem"

"Start fresh - I need to analyze a different issue"
```

**What happens:**
- Claude uses the `reset_analysis` tool
- All current progress is cleared
- You can immediately start a new analysis

## Complete Workflow Example

Here's how a typical session with Claude Code looks:

**You:** "Start a 5 whys analysis for: The website is loading slowly for users"

**Claude:** ✅ Analysis started successfully. Please answer the first 'why' question.

**Current Analysis:**
- Problem: The website is loading slowly for users
- Status: In Progress
- Progress: 1/5 questions

**Next Question:**
Why did this problem occur?

**You:** "The database queries are taking too long"

**Claude:** ✅ Answer recorded. Please answer the next 'why' question (2/5).

**Questions & Answers:**
1. Why did this problem occur?
   → The database queries are taking too long

**Next Question:**
Why did this happen?

**You:** "There are no indexes on frequently queried columns"

**Claude:** ✅ Answer recorded. Please answer the next 'why' question (3/5).

*[continues until completion]*

**You:** "Export this analysis as markdown"

**Claude:** *[provides complete formatted analysis]*

## Example Analysis Session

```
1. Problem: "The website is loading slowly for users"
   
2. Why is the website loading slowly?
   → The database queries are taking too long
   
3. Why are the database queries taking too long?
   → There are no indexes on frequently queried columns
   
4. Why are there no indexes on frequently queried columns?
   → The database was not properly optimized during development
   
5. Why was the database not properly optimized during development?
   → There was no database performance review in the development process
   
6. Why was there no database performance review in the development process?
   → The development team lacks database optimization expertise

Root Cause: The development team lacks database optimization expertise
```

## Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `start_five_whys` | Begin a new analysis | `problem: string` |
| `answer_why` | Answer current question | `answer: string` |
| `get_current_state` | Get analysis status | none |
| `export_analysis` | Export results | `format?: 'markdown' \| 'json' \| 'text'` |
| `reset_analysis` | Reset current analysis | none |

## Development

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Start development mode: `npm run dev`

### Testing

To test the MCP server locally:

```bash
# Start the server
npm start

# In another terminal, test with MCP inspector
npx @modelcontextprotocol/inspector http://localhost:3000
```

## Configuration

The server runs on stdio transport by default, which is suitable for MCP integration. No additional configuration is required.

## Troubleshooting

### Common Issues

1. **Server not starting**: Ensure Node.js 18+ is installed
2. **Tools not appearing in Claude**: Check the configuration file path and restart Claude
3. **Permission errors**: Make sure the package has execute permissions

### Debug Mode

To run with debug output:

```bash
DEBUG=* npx five-whys-mcp-server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review the MCP documentation

---

*Built with the Model Context Protocol (MCP) for seamless integration with AI assistants.*