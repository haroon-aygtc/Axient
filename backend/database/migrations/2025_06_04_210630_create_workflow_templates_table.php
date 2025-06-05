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
        Schema::create('workflow_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('category');
            $table->string('estimated_time');
            $table->enum('complexity', ['Simple', 'Medium', 'Advanced']);
            $table->json('nodes'); // Template nodes structure
            $table->json('metadata')->nullable(); // Additional template metadata
            $table->boolean('is_public')->default(true);
            $table->unsignedBigInteger('created_by')->nullable(); // User who created the template
            $table->integer('usage_count')->default(0);
            $table->timestamps();

            $table->index('category');
            $table->index('complexity');
            $table->index('is_public');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workflow_templates');
    }
};
