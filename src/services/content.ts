import { apiService, ApiResponse } from './api';

// Content interfaces
export interface Content {
    _id: string;
    title: string;
    type: 'blog' | 'resource' | 'news';
    category: string;
    author: {
        _id: string;
        name: string;
        avatar?: string;
        bio?: string;
    };
    excerpt: string;
    content: string;
    coverImage?: string;
    images?: string[];
    tags: string[];
    publishedAt: string;
    readTime: string;
    views: number;
    likes: number;
    comments: number;
    status: 'draft' | 'published' | 'archived';
    featured: boolean;
    relatedContent?: Array<{
        _id: string;
        title: string;
        type: string;
        coverImage?: string;
        readTime: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface CreateContentData {
    title: string;
    type: 'blog' | 'resource' | 'news';
    category: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    tags?: string[];
    featured?: boolean;
}

export interface ContentFilters {
    page?: number;
    limit?: number;
    type?: 'blog' | 'resource' | 'news';
    category?: string;
    search?: string;
    featured?: boolean;
    sort?: 'date' | '-date' | 'title' | '-title' | 'views' | '-views';
}

export interface ContentCategory {
    name: string;
    count: number;
    slug: string;
}

// Content service class
class ContentService {
    // Get all content
    async getContent(filters: ContentFilters = {}): Promise<{
        content: Content[];
        pagination: ApiResponse['pagination'];
    }> {
        const response = await apiService.get<{ content: Content[] }>('/content', filters);
        return {
            content: response.data!.content,
            pagination: response.pagination!,
        };
    }

    // Get single content item
    async getContentItem(id: string): Promise<Content> {
        const response = await apiService.get<{ content: Content }>(`/content/${id}`);
        return response.data!.content;
    }

    // Create content
    async createContent(data: CreateContentData): Promise<Content> {
        const response = await apiService.post<{ content: Content }>('/content', data);
        return response.data!.content;
    }

    // Update content
    async updateContent(id: string, data: Partial<CreateContentData>): Promise<Content> {
        const response = await apiService.put<{ content: Content }>(`/content/${id}`, data);
        return response.data!.content;
    }

    // Delete content
    async deleteContent(id: string): Promise<void> {
        await apiService.delete(`/content/${id}`);
    }

    // Like content
    async likeContent(id: string): Promise<void> {
        await apiService.post(`/content/${id}/like`);
    }

    // Unlike content
    async unlikeContent(id: string): Promise<void> {
        await apiService.delete(`/content/${id}/like`);
    }

    // Get content categories
    async getCategories(): Promise<ContentCategory[]> {
        const response = await apiService.get<{ categories: ContentCategory[] }>('/content/categories');
        return response.data!.categories;
    }

    // Get featured content
    async getFeaturedContent(limit: number = 6): Promise<Content[]> {
        const response = await apiService.get<{ content: Content[] }>('/content', {
            featured: true,
            limit,
        });
        return response.data!.content;
    }

    // Get content by category
    async getContentByCategory(
        category: string,
        limit: number = 10
    ): Promise<Content[]> {
        const response = await apiService.get<{ content: Content[] }>('/content', {
            category,
            limit,
        });
        return response.data!.content;
    }

    // Search content
    async searchContent(query: string, filters: ContentFilters = {}): Promise<{
        content: Content[];
        pagination: ApiResponse['pagination'];
    }> {
        const response = await apiService.get<{ content: Content[] }>('/content', {
            ...filters,
            search: query,
        });
        return {
            content: response.data!.content,
            pagination: response.pagination!,
        };
    }

    // Get related content
    async getRelatedContent(
        contentId: string,
        limit: number = 4
    ): Promise<Content[]> {
        const response = await apiService.get<{ content: Content[] }>(
            `/content/${contentId}/related`,
            { limit }
        );
        return response.data!.content;
    }

    // Get popular content
    async getPopularContent(limit: number = 10): Promise<Content[]> {
        const response = await apiService.get<{ content: Content[] }>('/content', {
            sort: '-views',
            limit,
        });
        return response.data!.content;
    }

    // Get recent content
    async getRecentContent(limit: number = 10): Promise<Content[]> {
        const response = await apiService.get<{ content: Content[] }>('/content', {
            sort: '-date',
            limit,
        });
        return response.data!.content;
    }

    // Upload content image
    async uploadContentImage(file: File): Promise<{
        url: string;
        publicId: string;
        secureUrl: string;
    }> {
        const response = await apiService.uploadFile<{
            url: string;
            publicId: string;
            secureUrl: string;
        }>('/upload/images', file, 'images');
        return response.data!.images[0];
    }
}

// Create and export content service instance
export const contentService = new ContentService();

// Export the class for testing
export { ContentService };

