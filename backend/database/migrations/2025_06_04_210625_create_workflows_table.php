<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('workflows', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(false);
            $table->json('nodes')->nullable(); // Store React Flow nodes
            $table->json('edges')->nullable(); // Store React Flow edges
            $table->json('metadata')->nullable(); // Additional workflow metadata
            $table->string('category')->nullable();
            $table->string('complexity')->nullable(); // Simple, Medium, Advanced
            $table->string('estimated_time')->nullable();
            $table->unsignedBigInteger('template_id')->nullable(); // Reference to template if created from one
            $table->unsignedBigInteger('user_id')->nullable(); // Owner of the workflow
            $table->timestamp('last_executed_at')->nullable();
            $table->integer('execution_count')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'is_active']);
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workflows');
    }
};
