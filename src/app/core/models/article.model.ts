export interface Article {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  artistId: number;
  author: { id: number; username: string };
  artist: { id: number; name: string; slug: string };
  edits?: EditHistory[];
}

export interface EditHistory {
  id: number;
  summary?: string;
  createdAt: string;
  editor: { username: string };
}

export interface CreateArticleDto {
  title: string;
  content: string;
  artistId: number;
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
  summary?: string;
}

// Structure for rich wiki page creation
export interface WikiSection {
  id: string;
  type: 'heading' | 'subheading' | 'paragraph' | 'image' | 'video' | 'link' | 'tags';
  content: string;
  level?: number;
}

export interface CreateWikiPageDto {
  artistId: number;
  title: string;
  sections: WikiSection[];
  tags?: string[];
  genres?: string[];
  references?: string[];
  externalLinks?: ExternalLink[];
  videoUrls?: string[];
}

export interface ExternalLink {
  label: string;
  url: string;
  icon?: string;
}
