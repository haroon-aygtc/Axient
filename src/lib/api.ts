const API_BASE_URL = 'http://localhost:8000/api';

export interface WorkflowTemplate {
    id: number;
    name: string;
    description: string;
    category: string;
    estimated_time: string;
    complexity: 'Simple' | 'Medium' | 'Advanced';
    nodes: any[];
    metadata?: any;
    is_public: boolean;
    created_by?: number;
    usage_count: number;
    created_at: string;
    updated_at: string;
}

export interface Workflow {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    nodes: any[];
    edges: any[];
    metadata?: any;
    category?: string;
    complexity?: 'Simple' | 'Medium' | 'Advanced';
    estimated_time?: string;
    template_id?: number;
    user_id?: number;
    last_executed_at?: string;
    execution_count: number;
    created_at: string;
    updated_at: string;
    template?: WorkflowTemplate;
}

export interface CreateWorkflowFromTemplateRequest {
    name: string;
    description?: string;
    user_id?: number;
}

export interface CreateWorkflowRequest {
    name: string;
    description?: string;
    is_active?: boolean;
    nodes?: any[];
    edges?: any[];
    metadata?: any;
    category?: string;
    complexity?: 'Simple' | 'Medium' | 'Advanced';
    estimated_time?: string;
    template_id?: number;
    user_id?: number;
}

export interface UpdateWorkflowRequest {
    name?: string;
    description?: string;
    is_active?: boolean;
    nodes?: any[];
    edges?: any[];
    metadata?: any;
    category?: string;
    complexity?: 'Simple' | 'Medium' | 'Advanced';
    estimated_time?: string;
}

class ApiService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // Workflow Templates API
    async getWorkflowTemplates(params?: {
        category?: string;
        complexity?: string;
        is_public?: boolean;
        per_page?: number;
    }): Promise<{ data: WorkflowTemplate[] }> {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    searchParams.append(key, value.toString());
                }
            });
        }

        const endpoint = `/workflow-templates${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        return this.request<{ data: WorkflowTemplate[] }>(endpoint);
    }

    async getWorkflowTemplate(id: number): Promise<WorkflowTemplate> {
        return this.request<WorkflowTemplate>(`/workflow-templates/${id}`);
    }

    async getPopularTemplates(limit?: number): Promise<WorkflowTemplate[]> {
        const endpoint = `/workflow-templates/popular${limit ? `?limit=${limit}` : ''}`;
        return this.request<WorkflowTemplate[]>(endpoint);
    }

    async getTemplateCategories(): Promise<{ category: string; count: number }[]> {
        return this.request<{ category: string; count: number }[]>('/workflow-templates/categories');
    }

    async getTemplatesByCategory(category: string): Promise<WorkflowTemplate[]> {
        return this.request<WorkflowTemplate[]>(`/workflow-templates/category/${category}`);
    }

    // Workflows API
    async getWorkflows(params?: {
        category?: string;
        is_active?: boolean;
        user_id?: number;
        per_page?: number;
    }): Promise<{ data: Workflow[] }> {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    searchParams.append(key, value.toString());
                }
            });
        }

        const endpoint = `/workflows${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        return this.request<{ data: Workflow[] }>(endpoint);
    }

    async getWorkflow(id: number): Promise<Workflow> {
        return this.request<Workflow>(`/workflows/${id}`);
    }

    async createWorkflow(data: CreateWorkflowRequest): Promise<Workflow> {
        return this.request<Workflow>('/workflows', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateWorkflow(id: number, data: UpdateWorkflowRequest): Promise<Workflow> {
        return this.request<Workflow>(`/workflows/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteWorkflow(id: number): Promise<{ message: string }> {
        return this.request<{ message: string }>(`/workflows/${id}`, {
            method: 'DELETE',
        });
    }

    async createWorkflowFromTemplate(
        templateId: number,
        data: CreateWorkflowFromTemplateRequest
    ): Promise<Workflow> {
        return this.request<Workflow>(`/workflows/from-template/${templateId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async testWorkflow(id: number): Promise<{
        message: string;
        execution_id: string;
        status: string;
        executed_at: string;
        nodes_executed: number;
    }> {
        return this.request(`/workflows/${id}/test`, {
            method: 'POST',
        });
    }

    async getWorkflowExecutionHistory(id: number): Promise<{
        workflow_id: number;
        total_executions: number;
        last_executed_at?: string;
        history: Array<{
            id: string;
            status: string;
            executed_at: string;
            duration: number;
            nodes_executed: number;
        }>;
    }> {
        return this.request(`/workflows/${id}/execution-history`);
    }
}

export const apiService = new ApiService(); 