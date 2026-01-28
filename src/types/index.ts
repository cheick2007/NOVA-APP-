
export interface Profile {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
}

export interface Video {
    id: string;
    user_id: string;
    video_url: string;
    description: string | null;
    song_name: string | null;
    likes_count: number;
    comments_count: number;
    created_at: string;
    profiles?: Profile; // Relation joined
}
