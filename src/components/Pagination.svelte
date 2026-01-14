<script lang="ts">
  interface Props {
    currentPage?: number;
    totalPages?: number;
  }
  
  let { currentPage = 1, totalPages = 1 } = $props<Props>();
  
  function getPageUrl(page) {
    if (page === 1) {
      return '/';
    }
    return `/page/${page}`;
  }
  
  function getPages() {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  }
</script>

{#if totalPages > 1}
  <nav class="pagination" aria-label="Pagination">
    <div class="pagination-container">
      {#if currentPage > 1}
        <a href={getPageUrl(currentPage - 1)} class="pagination-link pagination-prev">
          ← Précédent
        </a>
      {:else}
        <span class="pagination-link pagination-prev disabled">← Précédent</span>
      {/if}
      
      <div class="pagination-pages">
        {#each getPages() as page}
          {#if page === '...'}
            <span class="pagination-ellipsis">...</span>
          {:else if page === currentPage}
            <span class="pagination-link pagination-current" aria-current="page">
              {page}
            </span>
          {:else}
            <a href={getPageUrl(page)} class="pagination-link">
              {page}
            </a>
          {/if}
        {/each}
      </div>
      
      {#if currentPage < totalPages}
        <a href={getPageUrl(currentPage + 1)} class="pagination-link pagination-next">
          Suivant →
        </a>
      {:else}
        <span class="pagination-link pagination-next disabled">Suivant →</span>
      {/if}
    </div>
  </nav>
{/if}

<style>
  .pagination {
    margin: var(--spacing-2xl) 0;
  }
  
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }
  
  .pagination-pages {
    display: flex;
    gap: var(--spacing-xs);
  }
  
  .pagination-link {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: 0.25rem;
    color: var(--color-text);
    text-decoration: none;
    transition: background-color var(--transition-fast);
    min-width: 2.5rem;
    text-align: center;
  }
  
  .pagination-link:hover:not(.disabled) {
    background-color: var(--color-bg-secondary);
    text-decoration: none;
  }
  
  .pagination-link.disabled {
    color: var(--color-text-secondary);
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  .pagination-current {
    background-color: var(--color-accent);
    color: white;
    font-weight: 600;
  }
  
  .pagination-ellipsis {
    padding: var(--spacing-sm);
    color: var(--color-text-secondary);
  }
  
  @media (max-width: 768px) {
    .pagination-container {
      gap: var(--spacing-xs);
    }
    
    .pagination-link {
      padding: var(--spacing-sm);
      min-width: 2rem;
      font-size: 0.9rem;
    }
  }
</style>
