<script>
  import { onMount } from 'svelte';
  
  let mobileMenuOpen = $state(false);
  let mounted = $state(false);
  
  onMount(() => {
    mounted = true;
  });
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
</script>

<nav class="navigation">
  <div class="nav-container">
    <a href="/" class="nav-logo">acesyde</a>
    
    <button 
      class="nav-toggle"
      aria-label="Toggle menu"
      aria-expanded={mobileMenuOpen}
      onclick={toggleMobileMenu}
    >
      <span class="hamburger"></span>
      <span class="hamburger"></span>
      <span class="hamburger"></span>
    </button>
    
    <ul class="nav-menu" class:open={mobileMenuOpen}>
      <li><a href="/" onclick={closeMobileMenu}>Accueil</a></li>
      <li><a href="/tags" onclick={closeMobileMenu}>Tags</a></li>
      <li><a href="/about" onclick={closeMobileMenu}>À propos</a></li>
    </ul>
  </div>
</nav>

<style>
  .navigation {
    background-color: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.8);
  }
  
  @media (prefers-color-scheme: dark) {
    .navigation {
      background-color: rgba(15, 23, 42, 0.8);
    }
  }
  
  .nav-container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: var(--spacing-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-logo {
    font-weight: 600;
    font-size: 1.25rem;
    color: var(--color-text);
    text-decoration: none;
  }
  
  .nav-logo:hover {
    text-decoration: none;
    color: var(--color-accent);
  }
  
  .nav-toggle {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--spacing-sm);
  }
  
  .hamburger {
    width: 24px;
    height: 2px;
    background-color: var(--color-text);
    transition: all var(--transition-fast);
  }
  
  .nav-menu {
    display: flex;
    list-style: none;
    gap: var(--spacing-lg);
    padding: 0;
    margin: 0;
  }
  
  .nav-menu a {
    color: var(--color-text);
    font-weight: 500;
    padding: var(--spacing-sm) 0;
  }
  
  .nav-menu a:hover {
    color: var(--color-accent);
  }
  
  @media (max-width: 768px) {
    .nav-toggle {
      display: flex;
    }
    
    .nav-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      flex-direction: column;
      background-color: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
      padding: var(--spacing-md);
      gap: 0;
      max-height: 0;
      overflow: hidden;
      transition: max-height var(--transition-base);
    }
    
    .nav-menu.open {
      max-height: 300px;
    }
    
    .nav-menu li {
      padding: var(--spacing-sm) 0;
    }
  }
</style>
