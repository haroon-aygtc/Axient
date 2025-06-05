<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Workflow;
use App\Models\WorkflowTemplate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class WorkflowController extends Controller
{
    /**
     * Display a listing of workflows.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Workflow::query();

        // Filter by category if provided
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filter by active status if provided
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Filter by user if provided
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $workflows = $query->with(['template', 'user'])
            ->orderBy('updated_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($workflows);
    }

    /**
     * Store a newly created workflow.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'nodes' => 'nullable|array',
            'edges' => 'nullable|array',
            'metadata' => 'nullable|array',
            'category' => 'nullable|string|max:100',
            'complexity' => 'nullable|in:Simple,Medium,Advanced',
            'estimated_time' => 'nullable|string|max:50',
            'template_id' => 'nullable|exists:workflow_templates,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $workflow = Workflow::create($validated);

        // If created from template, increment template usage
        if ($workflow->template_id) {
            $workflow->template->incrementUsage();
        }

        return response()->json($workflow->load(['template', 'user']), 201);
    }

    /**
     * Display the specified workflow.
     */
    public function show(string $id): JsonResponse
    {
        $workflow = Workflow::with(['template', 'user'])->findOrFail($id);
        return response()->json($workflow);
    }

    /**
     * Update the specified workflow.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $workflow = Workflow::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'nodes' => 'nullable|array',
            'edges' => 'nullable|array',
            'metadata' => 'nullable|array',
            'category' => 'nullable|string|max:100',
            'complexity' => 'nullable|in:Simple,Medium,Advanced',
            'estimated_time' => 'nullable|string|max:50',
        ]);

        $workflow->update($validated);

        return response()->json($workflow->load(['template', 'user']));
    }

    /**
     * Remove the specified workflow.
     */
    public function destroy(string $id): JsonResponse
    {
        $workflow = Workflow::findOrFail($id);
        $workflow->delete();

        return response()->json(['message' => 'Workflow deleted successfully']);
    }

    /**
     * Create workflow from template.
     */
    public function createFromTemplate(Request $request, string $templateId): JsonResponse
    {
        $template = WorkflowTemplate::findOrFail($templateId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        // Convert template nodes to workflow format
        $workflowData = [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? $template->description,
            'category' => $template->category,
            'complexity' => $template->complexity,
            'estimated_time' => $template->estimated_time,
            'template_id' => $template->id,
            'user_id' => $validated['user_id'] ?? null,
            'nodes' => $this->convertTemplateNodesToWorkflowNodes($template->nodes),
            'edges' => $this->generateEdgesFromTemplateNodes($template->nodes),
            'is_active' => false,
        ];

        $workflow = Workflow::create($workflowData);
        $template->incrementUsage();

        return response()->json($workflow->load(['template', 'user']), 201);
    }

    /**
     * Test workflow execution.
     */
    public function test(string $id): JsonResponse
    {
        $workflow = Workflow::findOrFail($id);

        // Basic validation
        if (empty($workflow->nodes)) {
            return response()->json(['error' => 'Workflow has no nodes to execute'], 400);
        }

        // Update execution stats
        $workflow->update([
            'last_executed_at' => now(),
            'execution_count' => $workflow->execution_count + 1,
        ]);

        // Here you would implement actual workflow execution logic
        // For now, return a mock response
        return response()->json([
            'message' => 'Workflow test executed successfully',
            'execution_id' => uniqid('exec_'),
            'status' => 'completed',
            'executed_at' => now(),
            'nodes_executed' => count($workflow->nodes),
        ]);
    }

    /**
     * Get workflow execution history.
     */
    public function executionHistory(string $id): JsonResponse
    {
        $workflow = Workflow::findOrFail($id);

        // Mock execution history - in real implementation, this would come from a separate executions table
        $history = [
            [
                'id' => 'exec_' . uniqid(),
                'status' => 'completed',
                'executed_at' => now()->subHours(2),
                'duration' => 1.5,
                'nodes_executed' => count($workflow->nodes),
            ],
            [
                'id' => 'exec_' . uniqid(),
                'status' => 'completed',
                'executed_at' => now()->subDays(1),
                'duration' => 2.1,
                'nodes_executed' => count($workflow->nodes),
            ],
        ];

        return response()->json([
            'workflow_id' => $workflow->id,
            'total_executions' => $workflow->execution_count,
            'last_executed_at' => $workflow->last_executed_at,
            'history' => $history,
        ]);
    }

    /**
     * Convert template nodes to workflow nodes format.
     */
    private function convertTemplateNodesToWorkflowNodes(array $templateNodes): array
    {
        $workflowNodes = [];
        $yPosition = 100;

        foreach ($templateNodes as $index => $templateNode) {
            $workflowNodes[] = [
                'id' => $templateNode['id'] . '-' . uniqid(),
                'type' => 'custom',
                'position' => [
                    'x' => 200,
                    'y' => $yPosition,
                ],
                'data' => [
                    'label' => $templateNode['title'],
                    'description' => $templateNode['description'],
                    'category' => strtolower($templateNode['category']),
                    'config' => [],
                    'isConfigured' => false,
                ],
            ];
            $yPosition += 150;
        }

        return $workflowNodes;
    }

    /**
     * Generate edges from template node connections.
     */
    private function generateEdgesFromTemplateNodes(array $templateNodes): array
    {
        $edges = [];
        $nodeMap = [];

        // Create a map of template node IDs to workflow node IDs
        foreach ($templateNodes as $index => $templateNode) {
            $nodeMap[$templateNode['id']] = $templateNode['id'] . '-' . uniqid();
        }

        // Generate edges based on connections
        foreach ($templateNodes as $templateNode) {
            if (!empty($templateNode['connections'])) {
                foreach ($templateNode['connections'] as $targetId) {
                    if (isset($nodeMap[$targetId])) {
                        $edges[] = [
                            'id' => 'edge-' . uniqid(),
                            'source' => $nodeMap[$templateNode['id']],
                            'target' => $nodeMap[$targetId],
                            'type' => 'default',
                        ];
                    }
                }
            }
        }

        return $edges;
    }
}
