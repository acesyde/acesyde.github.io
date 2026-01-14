<script lang="ts">
  import { onMount } from 'svelte';
  import type { CollectionEntry } from 'astro:content';
  
  interface Props {
    posts: CollectionEntry<'posts'>[];
  }
  
  let { posts } = $props<Props>();
  
  let searchQuery = $state('');
  let isOpen = $state(false);
  let results = $state<CollectionEntry<'posts'>[]>([]);
  let mounted = $state(false);
  
  onMount(() => {
    mounted = true;
  });
  
  function handleSearch(query: string) {
    searchQuery = query;
    
    if (!query.trim()) {
      results = [];
      return;
    }
    
    const queryLower = query.toLowerCase();
    results = posts
      .filter(post => {
        const title = post.data.title.toLowerCase();
        const tags = post.data.tags?.join(' ').toLowerCase() || '';
        // Note: post.body is not available until rendered, so we only search in title and tags
        return title.includes(queryLower) || tags.includes(queryLower);
      })
      .slice(0, 10);
  }
  
  function openSearch() {
    isOpen = true;
    if (mounted) {
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeSearch() {
    isOpen = false;
    searchQuery = '';
    results = [];
    if (mounted) {
      document.body.style.overflow = '';
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      openSearch();
    }
    if (event.key === 'Escape') {
      closeSearch();
    }
  }
  
  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    };
  });
</script>

<button 
  class="search-trigger"
  onclick={openSearch}
  aria-label="Rechercher"
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
  <span class="search-hint">⌘K</span>
</button>

{#if isOpen}
  <div class="search-overlay" onclick={closeSearch}>
    <div class="search-modal" onclick={(e) => e.stopPropagation()}>
      <div class="search-header">
        <input
          type="text"
          class="search-input"
          placeholder="Rechercher des articles..."
          bind:value={searchQuery}
          oninput={(e) => handleSearch(e.target.value)}
          autofocus
        />
        <button class="search-close" onclick={closeSearch} aria-label="Fermer">
          ✕
        </button>
      </div>
      
      <div class="search-results">
        {#if searchQuery && results.length === 0}
          <p class="search-empty">Aucun résultat trouvé</p>
        {:else if results.length > 0}
          <ul class="results-list">
            {#each results as post}
              <li>
                <a href={`/posts/${post.slug}`} onclick={closeSearch} class="result-item">
                  <h3 class="result-title">{post.data.title}</h3>
                  {#if post.data.tags && post.data.tags.length > 0}
                    <div class="result-tags">
                      {#each post.data.tags as tag}
                        <span class="result-tag">#{tag}</span>
                      {/each}
                    </div>
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .search-trigger {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: all var(--transition-fast);
    font-size: 0.9rem;
  }
  
  .search-trigger:hover {
    background-color: var(--color-border);
    color: var(--color-text);
  }
  
  .search-hint {
    font-size: 0.75rem;
    opacity: 0.7;
  }
  
  .search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: var(--spacing-xl);
  }
  
  .search-modal {
    background-color: var(--color-bg);
    border-radius: 0.5rem;
    width: 100%;
    max-width: 600px;
    margin-top: 10vh;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    max-height: 70vh;
    display: flex;
    flex-direction: column;
  }
  
  .search-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
  }
  
  .search-input {
    flex: 1;
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
    font-size: 1rem;
    background-color: var(--color-bg);
    color: var(--color-text);
  }
  
  .search-input:focus {
    outline: none;
    border-color: var(--color-accent);
  }
  
  .search-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .search-close:hover {
    color: var(--color-text);
  }
  
  .search-results {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);
  }
  
  .search-empty {
    text-align: center;
    color: var(--color-text-secondary);
    padding: var(--spacing-xl);
  }
  
  .results-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .result-item {
    display: block;
    padding: var(--spacing-md);
    border-radius: 0.25rem;
    text-decoration: none;
    margin-bottom: var(--spacing-sm);
    transition: background-color var(--transition-fast);
  }
  
  .result-item:hover {
    background-color: var(--color-bg-secondary);
    text-decoration: none;
  }
  
  .result-title {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: 1rem;
    color: var(--color-text);
  }
  
  .result-tags {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
  }
  
  .result-tag {
    font-size: 0.75rem;
    color: var(--color-accent);
  }
  
  @media (max-width: 768px) {
    .search-overlay {
      padding: 0;
    }
    
    .search-modal {
      margin-top: 0;
      max-height: 100vh;
      border-radius: 0;
    }
    
    .search-hint {
      display: none;
    }
  }
</style>
