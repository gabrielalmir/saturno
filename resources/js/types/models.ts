// User types
export interface User {
    id: number;
    name: string;
    email: string;
    current_organization_id?: number;
    current_project_id?: number;
    analyst_role?: string | null;
    created_at: string;
    updated_at: string;
}

// Organization types
export interface Organization {
    id: number;
    name: string;
    slug: string;
    description?: string;
    logo_path?: string | null;
    planning_unit?: 'hours' | 'story_points' | null;
    created_at: string;
    updated_at: string;
    users?: User[];
}

export interface Project {
    id: number;
    organization_id: number;
    name: string;
    slug: string;
    description?: string | null;
    settings?: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}

export interface BoardColumn {
    id: number;
    name: string;
    kind: 'status' | 'category' | 'priority' | 'grouping';
    status_mapping?: string | null;
    color?: string | null;
    position: number;
    items: WorkItem[];
}

export interface Board {
    id: number;
    name: string;
    description?: string | null;
    context_type?: string | null;
    context_filter?: Record<string, unknown> | null;
    columns: BoardColumn[];
}

// Sprint and WorkItem types
export interface Sprint {
    id: number;
    organization_id: number;
    project_id?: number | null;
    team_id?: number | null;
    name: string;
    goal?: string | null;
    status?: 'planning' | 'active' | 'completed';
    start_date: string;
    end_date: string;
    capacity_total: number;
    capacity_reserved_n1: number;
    use_member_n1_reserve?: boolean;
    wip_limit: number;
    started_at?: string | null;
    completed_at?: string | null;
    capacity_snapshot_total?: number | null;
    capacity_snapshot_reserved_n1?: number | null;
    commitment_snapshot?: number | null;
    created_at: string;
    updated_at: string;
    work_items?: WorkItem[];
    organization?: Organization;
}

export interface WorkItem {
    id: number;
    organization_id: number;
    project_id?: number | null;
    title: string;
    description?: string;
    tier: 'N1' | 'N2';
    type: string;
    size: string;
    priority: string;
    status: string;
    estimate?: number;
    due_date?: string;
    planned_for?: string;
    planned_rank?: number | null;
    started_at?: string | null;
    blocked_at?: string | null;
    blocked_reason?: string | null;
    completed_at?: string | null;
    assignee_id?: number;
    reporter_id?: number;
    epic_id?: number;
    ticket_id?: number;
    sprint_id?: number;
    parent_id?: number;
    created_at: string;
    updated_at: string;
    sprint?: Sprint;
    parent?: WorkItem;
    children?: WorkItem[];
    assignee?: User;
    reporter?: User;
    epic?: Epic;
    ticket?: Ticket;
    events?: WorkItemEvent[];
}

export interface WorkItemEvent {
    id: number;
    organization_id: number;
    work_item_id: number;
    user_id?: number | null;
    type: string;
    payload?: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface Epic {
    id: number;
    organization_id: number;
    project_id?: number | null;
    title: string;
    description?: string;
    status: string;
    owner_id?: number;
    created_at: string;
    updated_at: string;
    owner?: User;
    work_items?: WorkItem[];
}

export interface Ticket {
    id: number;
    organization_id: number;
    project_id?: number | null;
    title: string;
    description?: string;
    status: string;
    priority: string;
    reporter_id?: number;
    assignee_id?: number;
    due_date?: string;
    created_at: string;
    updated_at: string;
    reporter?: User;
    assignee?: User;
    work_items?: WorkItem[];
}

export interface DashboardMetrics {
    capacity: {
        total: number;
        n1Reserved: number;
        n2Planned: number;
        available: number;
        n1ReservedPercent: number;
        n2PlannedPercent: number;
        availablePercent: number;
    };
    blockedItems: {
        count: number;
    };
}

export interface FlowMetrics {
    throughput: number;
    avg_cycle_time_hours: number | null;
    p95_cycle_time_hours: number | null;
    wip_aging: {
        count: number;
        avg_hours: number | null;
        max_hours: number | null;
        top: {
            id: number;
            title: string;
            assignee_id: number | null;
            age_hours: number;
        }[];
    };
    blocked_aging: {
        count: number;
        avg_hours: number | null;
        max_hours: number | null;
        top: {
            id: number;
            title: string;
            assignee_id: number | null;
            age_hours: number;
        }[];
    };
}
