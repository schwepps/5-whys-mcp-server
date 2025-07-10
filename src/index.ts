#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { FiveWhysAnalyzer } from './five-whys-analyzer.js';

class FiveWhysMCPServer {
  private server: Server;
  private analyzer: FiveWhysAnalyzer;

  constructor() {
    this.analyzer = new FiveWhysAnalyzer();
    this.server = new Server(
      {
        name: 'five-whys-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        {
          name: 'start_five_whys',
          description: 'Start a new 5 whys analysis with an initial problem statement',
          inputSchema: {
            type: 'object',
            properties: {
              problem: {
                type: 'string',
                description: 'The initial problem statement to analyze',
              },
            },
            required: ['problem'],
          },
        },
        {
          name: 'answer_why',
          description: 'Answer the current "why" question in the analysis',
          inputSchema: {
            type: 'object',
            properties: {
              answer: {
                type: 'string',
                description: 'The answer to the current why question',
              },
            },
            required: ['answer'],
          },
        },
        {
          name: 'get_current_state',
          description: 'Get the current state of the analysis',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'export_analysis',
          description: 'Export the current analysis in the specified format',
          inputSchema: {
            type: 'object',
            properties: {
              format: {
                type: 'string',
                enum: ['markdown', 'json', 'text'],
                description: 'The format to export the analysis in',
                default: 'markdown',
              },
            },
          },
        },
        {
          name: 'reset_analysis',
          description: 'Reset the current analysis and start fresh',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ];

      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'start_five_whys': {
            const { problem } = args as { problem: string };
            const result = this.analyzer.startAnalysis(problem);
            
            return {
              content: [
                {
                  type: 'text',
                  text: this.formatResult(result),
                },
              ],
            };
          }

          case 'answer_why': {
            const { answer } = args as { answer: string };
            const result = this.analyzer.answerWhy(answer);
            
            return {
              content: [
                {
                  type: 'text',
                  text: this.formatResult(result),
                },
              ],
            };
          }

          case 'get_current_state': {
            const result = this.analyzer.getCurrentState();
            
            return {
              content: [
                {
                  type: 'text',
                  text: this.formatResult(result),
                },
              ],
            };
          }

          case 'export_analysis': {
            const { format = 'markdown' } = args as { format?: 'markdown' | 'json' | 'text' };
            const result = this.analyzer.exportAnalysis(format);
            
            if (result.success && result.analysis) {
              return {
                content: [
                  {
                    type: 'text',
                    text: (result.analysis as any).exportData || this.formatResult(result),
                  },
                ],
              };
            }

            return {
              content: [
                {
                  type: 'text',
                  text: this.formatResult(result),
                },
              ],
            };
          }

          case 'reset_analysis': {
            const result = this.analyzer.resetAnalysis();
            
            return {
              content: [
                {
                  type: 'text',
                  text: this.formatResult(result),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private formatResult(result: any): string {
    if (!result.success) {
      return `❌ ${result.message}`;
    }

    let output = `✅ ${result.message}`;

    if (result.analysis) {
      output += `\n\n**Current Analysis:**`;
      output += `\n- Problem: ${result.analysis.problem}`;
      output += `\n- Status: ${result.analysis.isComplete ? 'Complete' : 'In Progress'}`;
      output += `\n- Progress: ${result.analysis.questions.length}/5 questions`;
      
      if (result.analysis.questions.length > 0) {
        output += `\n\n**Questions & Answers:**`;
        result.analysis.questions.forEach((q: any, index: number) => {
          output += `\n${index + 1}. ${q.question}`;
          if (q.answer) {
            output += `\n   → ${q.answer}`;
          } else {
            output += `\n   → *Awaiting answer...*`;
          }
        });
      }

      if (result.analysis.rootCause) {
        output += `\n\n**🎯 Root Cause Identified:**\n${result.analysis.rootCause}`;
      }
    }

    if (result.nextQuestion) {
      output += `\n\n**Next Question:**\n${result.nextQuestion}`;
    }

    return output;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Five Whys MCP Server running on stdio');
  }
}

const server = new FiveWhysMCPServer();
server.run().catch(console.error);