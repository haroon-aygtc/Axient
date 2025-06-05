<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WorkflowController;
use App\Http\Controllers\Api\WorkflowTemplateController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Workflow Templates Routes
Route::prefix('workflow-templates')->group(function () {
    Route::get('/', [WorkflowTemplateController::class, 'index']);
    Route::post('/', [WorkflowTemplateController::class, 'store']);
    Route::get('/popular', [WorkflowTemplateController::class, 'popular']);
    Route::get('/categories', [WorkflowTemplateController::class, 'categories']);
    Route::get('/category/{category}', [WorkflowTemplateController::class, 'byCategory']);
    Route::get('/{id}', [WorkflowTemplateController::class, 'show']);
    Route::put('/{id}', [WorkflowTemplateController::class, 'update']);
    Route::delete('/{id}', [WorkflowTemplateController::class, 'destroy']);
    Route::post('/{id}/duplicate', [WorkflowTemplateController::class, 'duplicate']);
});

// Workflows Routes
Route::prefix('workflows')->group(function () {
    Route::get('/', [WorkflowController::class, 'index']);
    Route::post('/', [WorkflowController::class, 'store']);
    Route::get('/{id}', [WorkflowController::class, 'show']);
    Route::put('/{id}', [WorkflowController::class, 'update']);
    Route::delete('/{id}', [WorkflowController::class, 'destroy']);

    // Workflow specific actions
    Route::post('/from-template/{templateId}', [WorkflowController::class, 'createFromTemplate']);
    Route::post('/{id}/test', [WorkflowController::class, 'test']);
    Route::get('/{id}/execution-history', [WorkflowController::class, 'executionHistory']);
});
