export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    analyst_role?: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type OrganizationSummary = {
    id: number;
    name: string;
    slug: string;
    logo_path?: string | null;
    planning_unit?: 'hours' | 'story_points' | null;
    role?: string | null;
};

export type ProjectSummary = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    role?: string | null;
};

export type Auth = {
    user: User;
    organizations?: OrganizationSummary[];
    currentOrganization?: OrganizationSummary | null;
    currentOrganizationRole?: string | null;
    projects?: ProjectSummary[];
    currentProject?: ProjectSummary | null;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
