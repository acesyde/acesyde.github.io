<script lang="ts">
  import type { CollectionEntry } from 'astro:content';
  
  interface Props {
    post: CollectionEntry<'posts'>;
  }
  
  let { post } = $props<Props>();
  
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
  
  const postSlug = $derived(getPostSlug(post.id));
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
    
    <a href={getPostUrl(post.id)} class="article-link">
      Lire la suite →
    </a>
  </div>
</article>

<style>
  .article-card {
    border-bottom: 1px solid var(--color-border);
    padding-bottom: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
  }
  
  .article-card:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
  
  .article-cover {
    display: block;
    margin-bottom: var(--spacing-md);
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .article-cover img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform var(--transition-base);
  }
  
  .article-cover:hover img {
    transform: scale(1.02);
  }
  
  .article-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .article-title {
    margin: 0;
    font-size: 1.75rem;
  }
  
  .article-title a {
    color: var(--color-text);
    text-decoration: none;
  }
  
  .article-title a:hover {
    color: var(--color-accent);
    text-decoration: underline;
  }
  
  .article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    align-items: center;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
  }
  
  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
  
  .tag {
    color: var(--color-accent);
    font-size: 0.85rem;
  }
  
  .article-excerpt {
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
  
  .article-link {
    align-self: flex-start;
    font-weight: 500;
    margin-top: var(--spacing-sm);
  }
</style>
