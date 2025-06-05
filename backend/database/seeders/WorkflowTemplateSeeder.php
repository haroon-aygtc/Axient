<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\WorkflowTemplate;

class WorkflowTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Customer Support Automation',
                'description' => 'Automatically handle customer inquiries with AI-powered responses and smart routing',
                'category' => 'Customer Service',
                'estimated_time' => '5 minutes',
                'complexity' => 'Simple',
                'nodes' => [
                    [
                        'id' => 'start',
                        'type' => 'start',
                        'title' => 'Customer Message Received',
                        'description' => 'New message from customer',
                        'category' => 'Trigger',
                        'connections' => ['process-1'],
                    ],
                    [
                        'id' => 'process-1',
                        'type' => 'process',
                        'title' => 'Analyze Intent',
                        'description' => 'AI analyzes customer intent',
                        'category' => 'AI Processing',
                        'connections' => ['decision-1'],
                    ],
                    [
                        'id' => 'decision-1',
                        'type' => 'decision',
                        'title' => 'Can Auto-Respond?',
                        'description' => 'Check if we can automatically respond',
                        'category' => 'Logic',
                        'connections' => ['process-2', 'end'],
                    ],
                    [
                        'id' => 'process-2',
                        'type' => 'process',
                        'title' => 'Generate Response',
                        'description' => 'AI generates appropriate response',
                        'category' => 'AI Processing',
                        'connections' => ['end'],
                    ],
                    [
                        'id' => 'end',
                        'type' => 'end',
                        'title' => 'Send Response',
                        'description' => 'Response sent to customer',
                        'category' => 'Action',
                        'connections' => [],
                    ],
                ],
                'is_public' => true,
                'usage_count' => 0,
            ],
            [
                'name' => 'Lead Qualification Pipeline',
                'description' => 'Automatically qualify and route sales leads based on predefined criteria',
                'category' => 'Sales',
                'estimated_time' => '8 minutes',
                'complexity' => 'Medium',
                'nodes' => [
                    [
                        'id' => 'start',
                        'type' => 'start',
                        'title' => 'New Lead Captured',
                        'description' => 'Lead form submitted',
                        'category' => 'Trigger',
                        'connections' => ['process-1'],
                    ],
                    [
                        'id' => 'process-1',
                        'type' => 'process',
                        'title' => 'Enrich Lead Data',
                        'description' => 'Gather additional lead information',
                        'category' => 'Data Processing',
                        'connections' => ['decision-1'],
                    ],
                    [
                        'id' => 'decision-1',
                        'type' => 'decision',
                        'title' => 'Qualified Lead?',
                        'description' => 'Check lead qualification criteria',
                        'category' => 'Logic',
                        'connections' => ['process-2', 'process-3'],
                    ],
                    [
                        'id' => 'process-2',
                        'type' => 'process',
                        'title' => 'Route to Sales',
                        'description' => 'Assign to sales representative',
                        'category' => 'Action',
                        'connections' => ['end'],
                    ],
                    [
                        'id' => 'process-3',
                        'type' => 'process',
                        'title' => 'Add to Nurture Campaign',
                        'description' => 'Add to email nurture sequence',
                        'category' => 'Marketing',
                        'connections' => ['end'],
                    ],
                    [
                        'id' => 'end',
                        'type' => 'end',
                        'title' => 'Process Complete',
                        'description' => 'Lead processed successfully',
                        'category' => 'Completion',
                        'connections' => [],
                    ],
                ],
                'is_public' => true,
                'usage_count' => 0,
            ],
            [
                'name' => 'Content Moderation System',
                'description' => 'Automatically moderate user-generated content using AI and human review',
                'category' => 'Security',
                'estimated_time' => '3 minutes',
                'complexity' => 'Advanced',
                'nodes' => [
                    [
                        'id' => 'start',
                        'type' => 'start',
                        'title' => 'Content Submitted',
                        'description' => 'User submits content',
                        'category' => 'Trigger',
                        'connections' => ['process-1'],
                    ],
                    [
                        'id' => 'process-1',
                        'type' => 'process',
                        'title' => 'AI Content Analysis',
                        'description' => 'Analyze content for violations',
                        'category' => 'AI Processing',
                        'connections' => ['decision-1'],
                    ],
                    [
                        'id' => 'decision-1',
                        'type' => 'decision',
                        'title' => 'Content Safe?',
                        'description' => 'Check if content meets guidelines',
                        'category' => 'Security',
                        'connections' => ['process-2', 'process-3'],
                    ],
                    [
                        'id' => 'process-2',
                        'type' => 'process',
                        'title' => 'Approve Content',
                        'description' => 'Content approved for publication',
                        'category' => 'Action',
                        'connections' => ['end'],
                    ],
                    [
                        'id' => 'process-3',
                        'type' => 'process',
                        'title' => 'Flag for Review',
                        'description' => 'Send to human moderator',
                        'category' => 'Review',
                        'connections' => ['end'],
                    ],
                    [
                        'id' => 'end',
                        'type' => 'end',
                        'title' => 'Moderation Complete',
                        'description' => 'Content moderation finished',
                        'category' => 'Completion',
                        'connections' => [],
                    ],
                ],
                'is_public' => true,
                'usage_count' => 0,
            ],
        ];

        foreach ($templates as $templateData) {
            WorkflowTemplate::create($templateData);
        }
    }
}
