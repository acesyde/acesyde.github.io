<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Heading {
    id: string;
    text: string;
    level: number;
  }
  
  let headings = $state<Heading[]>([]);
  let activeId = $state<string>('');
  let mounted = $state(false);
  
  onMount(() => {
    mounted = true;
    extractHeadings();
    setupScrollSpy();
  });
  
  function extractHeadings() {
    const article = document.querySelector('.post-content');
    if (!article) return;
    
    const headingElements = article.querySelectorAll('h2, h3');
    headings = Array.from(headingElements).map((heading) => {
      const id = heading.id || generateId(heading.textContent || '');
      if (!heading.id) {
        heading.id = id;
      }
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      };
    });
  }
  
  function generateId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  function setupScrollSpy() {
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId = entry.target.id;
        }
      });
    }, observerOptions);
    
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });
    
    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }
  
  function scrollToHeading(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
</script>

{#if mounted && headings.length > 0}
  <nav class="toc">
    <h3 class="toc-title">Table des matières</h3>
    <ul class="toc-list">
      {#each headings as heading}
        <li class="toc-item" class:toc-item-h2={heading.level === 2} class:toc-item-h3={heading.level === 3}>
          <a
            href="#{heading.id}"
            class="toc-link"
            class:active={activeId === heading.id}
            onclick={(e) => {
              e.preventDefault();
              scrollToHeading(heading.id);
            }}
          >
            {heading.text}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

<style>
  .toc {
    position: sticky;
    top: 100px;
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    padding: var(--spacing-md);
    font-size: 0.875rem;
  }
  
  .toc-title {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 var(--spacing-md) 0;
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .toc-item {
    margin-bottom: var(--spacing-xs);
  }
  
  .toc-item-h2 {
    margin-bottom: var(--spacing-sm);
  }
  
  .toc-item-h3 {
    padding-left: var(--spacing-md);
    margin-bottom: var(--spacing-xs);
  }
  
  .toc-link {
    color: var(--color-text-secondary);
    text-decoration: none;
    display: block;
    padding: var(--spacing-xs) 0;
    transition: color var(--transition-fast);
    line-height: 1.5;
  }
  
  .toc-link:hover {
    color: var(--color-accent);
  }
  
  .toc-link.active {
    color: var(--color-accent);
    font-weight: 500;
  }
  
  @media (max-width: 1024px) {
    .toc {
      position: static;
      margin-top: var(--spacing-lg);
    }
  }
</style>
