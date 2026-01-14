<script lang="ts">
  import type { CollectionEntry } from 'astro:content';
  
  interface Props {
    post: CollectionEntry<'posts'>;
    excerpt?: string;
  }
  
  let { post, excerpt: providedExcerpt } = $props<Props>();
  
  function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function getPostSlug(id) {
    // Extract slug from id like: posts/2025/04/how-we-use-mise-at-work-part-1/index.md
    const slugParts = id.split('/');
    slugParts.pop(); // Remove 'index.md'
    slugParts.shift(); // Remove 'posts'
    return slugParts.join('/');
  }
  
  function getPostUrl(id) {
    const slug = getPostSlug(id);
    return `/posts/${slug}`;
  }
  
  function generateExcerpt(body: string, maxLength: number = 200): string {
    if (!body) return '';
    
    // Remove markdown headers (lines starting with #)
    let text = body.replace(/^#{1,6}\s+.+$/gm, '');
    
    // Remove code blocks
    text = text.replace(/```[\s\S]*?```/g, '');
    
    // Remove inline code
    text = text.replace(/`[^`]+`/g, '');
    
    // Remove markdown links but keep the text
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    
    // Remove images
    text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');
    
    // Remove bold/italic markdown
    text = text.replace(/\*\*([^\*]+)\*\*/g, '$1');
    text = text.replace(/\*([^\*]+)\*/g, '$1');
    text = text.replace(/__([^_]+)__/g, '$1');
    text = text.replace(/_([^_]+)_/g, '$1');
    
    // Remove list markers
    text = text.replace(/^[\s]*[-*+]\s+/gm, '');
    text = text.replace(/^[\s]*\d+\.\s+/gm, '');
    
    // Clean up whitespace
    text = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Truncate and add ellipsis if needed
    if (text.length > maxLength) {
      // Try to cut at a word boundary
      const truncated = text.substring(0, maxLength);
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > maxLength * 0.8) {
        return truncated.substring(0, lastSpace) + '...';
      }
      return truncated + '...';
    }
    
    return text;
  }
  
  const postSlug = $derived(getPostSlug(post.id));
  const excerpt = $derived(
    providedExcerpt || post.data.description || generateExcerpt(post.body || '', 200)
  );
</script>

<article class="article-card">
  {#if post.data.cover}
    <a href={getPostUrl(post.id)} class="article-cover">
      <img 
        src={post.data.cover.relative ? `/posts/${postSlug}/${post.data.cover.image}` : post.data.cover.image}
        alt={post.data.cover.alt || post.data.title}
        loading="lazy"
      />
    </a>
  {/if}
  
  <div class="article-content">
    <h2 class="article-title">
      <a href={getPostUrl(post.id)}>{post.data.title}</a>
    </h2>
    
    <div class="article-meta">
      <time datetime={post.data.date.toISOString()}>
        {formatDate(post.data.date)}
      </time>
      {#if post.data.tags && post.data.tags.length > 0}
        <span class="article-tags">
          {#each post.data.tags as tag}
            <a href={`/tags/${tag}`} class="tag">#{tag}</a>
          {/each}
        </span>
      {/if}
    </div>
    
    {#if excerpt}
      <p class="article-excerpt">{excerpt}</p>
    {/if}
    
    <a href={getPostUrl(post.id)} class="article-link">
      Lire la suite →
    </a>
  </div>
</article>

<style>
  .article-card {
    background-color: var(--color-bg);
    border-radius: 1rem;
    padding: 0;
    margin-bottom: var(--spacing-lg);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04);
    transition: box-shadow var(--transition-base), transform var(--transition-base);
    overflow: hidden;
  }
  
  .article-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-4px);
  }
  
  .article-card:last-child {
    margin-bottom: 0;
  }
  
  .article-cover {
    display: block;
    margin: 0;
    border-radius: 1rem 1rem 0 0;
    overflow: hidden;
  }
  
  .article-cover:hover img {
    transform: scale(1.05);
  }
  
  .article-cover img {
    width: 100%;
    height: 240px;
    object-fit: cover;
    transition: transform var(--transition-base);
    display: block;
  }
  
  .article-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-xl);
  }
  
  .article-title {
    margin: 0;
    font-size: 1.75rem;
    line-height: 1.3;
  }
  
  .article-title a {
    color: var(--color-text);
    text-decoration: none;
    transition: color var(--transition-fast);
  }
  
  .article-title a:hover {
    color: var(--color-accent);
    text-decoration: none;
  }
  
  .article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    align-items: center;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  
  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
  
  .tag {
    color: var(--color-accent);
    font-size: 0.875rem;
    text-decoration: none;
    transition: opacity var(--transition-fast);
  }
  
  .tag:hover {
    opacity: 0.7;
    text-decoration: underline;
  }
  
  .article-excerpt {
    color: var(--color-text-secondary);
    line-height: 1.7;
    margin: 0;
    font-size: 1rem;
  }
  
  .article-link {
    align-self: flex-start;
    font-weight: 500;
    margin-top: var(--spacing-xs);
    color: var(--color-accent);
    text-decoration: none;
    transition: color var(--transition-fast);
  }
  
  .article-link:hover {
    color: var(--color-accent-hover);
    text-decoration: underline;
  }
</style>
