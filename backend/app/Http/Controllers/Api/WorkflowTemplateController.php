<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkflowTemplate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WorkflowTemplateController extends Controller
{
    /**
     * Display a listing of workflow templates.
     */
    public function index(Request $request): JsonResponse
    {
        $query = WorkflowTemplate::query();

        // Filter by category if provided
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filter by complexity if provided
        if ($request->has('complexity')) {
            $query->byComplexity($request->complexity);
        }

        // Filter by public status if provided
        if ($request->has('is_public')) {
            $query->where('is_public', $request->boolean('is_public'));
        }

        // Only show public templates by default
        if (!$request->has('include_private')) {
            $query->public();
        }

        $templates = $query->with(['creator'])
            ->orderBy('usage_count', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($templates);
    }

    /**
     * Store a newly created workflow template.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:100',
            'estimated_time' => 'required|string|max:50',
            'complexity' => 'required|in:Simple,Medium,Advanced',
            'nodes' => 'required|array',
            'metadata' => 'nullable|array',
            'is_public' => 'boolean',
            'created_by' => 'nullable|exists:users,id',
        ]);

        $template = WorkflowTemplate::create($validated);

        return response()->json($template->load('creator'), 201);
    }

    /**
     * Display the specified workflow template.
     */
    public function show(string $id): JsonResponse
    {
        $template = WorkflowTemplate::with(['creator', 'workflows'])->findOrFail($id);
        return response()->json($template);
    }

    /**
     * Update the specified workflow template.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $template = WorkflowTemplate::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'sometimes|required|string|max:100',
            'estimated_time' => 'sometimes|required|string|max:50',
            'complexity' => 'sometimes|required|in:Simple,Medium,Advanced',
            'nodes' => 'sometimes|required|array',
            'metadata' => 'nullable|array',
            'is_public' => 'boolean',
        ]);

        $template->update($validated);

        return response()->json($template->load('creator'));
    }

    /**
     * Remove the specified workflow template.
     */
    public function destroy(string $id): JsonResponse
    {
        $template = WorkflowTemplate::findOrFail($id);

        // Check if template is being used by workflows
        if ($template->workflows()->count() > 0) {
            return response()->json([
                'error' => 'Cannot delete template that is being used by workflows'
            ], 400);
        }

        $template->delete();

        return response()->json(['message' => 'Template deleted successfully']);
    }

    /**
     * Get templates by category.
     */
    public function byCategory(string $category): JsonResponse
    {
        $templates = WorkflowTemplate::byCategory($category)
            ->public()
            ->with('creator')
            ->orderBy('usage_count', 'desc')
            ->get();

        return response()->json($templates);
    }

    /**
     * Get popular templates.
     */
    public function popular(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 10);

        $templates = WorkflowTemplate::public()
            ->with('creator')
            ->orderBy('usage_count', 'desc')
            ->limit($limit)
            ->get();

        return response()->json($templates);
    }

    /**
     * Get template categories with counts.
     */
    public function categories(): JsonResponse
    {
        $categories = WorkflowTemplate::public()
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->get();

        return response()->json($categories);
    }

    /**
     * Duplicate a template.
     */
    public function duplicate(Request $request, string $id): JsonResponse
    {
        $originalTemplate = WorkflowTemplate::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'created_by' => 'nullable|exists:users,id',
        ]);

        $newTemplate = WorkflowTemplate::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? $originalTemplate->description,
            'category' => $originalTemplate->category,
            'estimated_time' => $originalTemplate->estimated_time,
            'complexity' => $originalTemplate->complexity,
            'nodes' => $originalTemplate->nodes,
            'metadata' => $originalTemplate->metadata,
            'is_public' => $validated['is_public'] ?? false,
            'created_by' => $validated['created_by'] ?? null,
            'usage_count' => 0,
        ]);

        return response()->json($newTemplate->load('creator'), 201);
    }
}
