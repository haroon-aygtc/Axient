<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkflowTemplate extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'estimated_time',
        'complexity',
        'nodes',
        'metadata',
        'is_public',
        'created_by',
        'usage_count',
    ];

    protected $casts = [
        'nodes' => 'array',
        'metadata' => 'array',
        'is_public' => 'boolean',
        'usage_count' => 'integer',
    ];

    public function workflows(): HasMany
    {
        return $this->hasMany(Workflow::class, 'template_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scope for public templates
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    // Scope for templates by category
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Scope for templates by complexity
    public function scopeByComplexity($query, $complexity)
    {
        return $query->where('complexity', $complexity);
    }

    // Increment usage count when template is used
    public function incrementUsage()
    {
        $this->increment('usage_count');
    }
}
