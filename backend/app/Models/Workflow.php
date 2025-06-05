<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Workflow extends Model
{
    protected $fillable = [
        'name',
        'description',
        'is_active',
        'nodes',
        'edges',
        'metadata',
        'category',
        'complexity',
        'estimated_time',
        'template_id',
        'user_id',
        'last_executed_at',
        'execution_count',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'nodes' => 'array',
        'edges' => 'array',
        'metadata' => 'array',
        'last_executed_at' => 'datetime',
        'execution_count' => 'integer',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(WorkflowTemplate::class, 'template_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scope for active workflows
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope for workflows by category
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
