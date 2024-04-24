<script lang="ts">
  import { onMount } from 'svelte'

  let alertText = ''

  let minifluxUrl: string
  let minifluxApiKey: string
  let refreshInterval: string

  function loadOptions() {
    chrome.storage.sync.get({ minifluxUrl: '', minifluxApiKey: '', refreshInterval: '10' }, (items) => {
      minifluxUrl = items.minifluxUrl
      minifluxApiKey = items.minifluxApiKey
      refreshInterval = items.refreshInterval
    })
  }

  function saveOptions() {
    if (!minifluxUrl || !minifluxApiKey || !refreshInterval) {
      alertText = 'All fields must be filled'
      // setTimeout(() => {
      //   alertText = ''
      // }, 2000)
      return
    }

    if (!/^https?:\/\//.test(minifluxUrl)) {
      alertText = 'Miniflux URL must start with http or https'
      // setTimeout(() => {
      //   alertText = ''
      // }, 2000)
      return
    }

    if (minifluxUrl.endsWith('/')) {
      minifluxUrl = minifluxUrl.slice(0, -1)
    }

    chrome.storage.sync.set({ minifluxUrl, minifluxApiKey, refreshInterval })
    alertText = 'Saved!'
    setTimeout(() => {
      alertText = ''
    }, 2000)

    chrome.runtime.sendMessage({
      action: 'saveOptions'
    })
  }

  onMount(() => {
    loadOptions()
  })
</script>

<main>
  <h3>Miniflux Checker Options</h3>
  <form>
    <label for="url">Miniflux URL</label>
    <input
      id="url"
      type="url"
      bind:value={minifluxUrl}
      placeholder="e.g. https://miniflux.example.com"
    />

    <label for="apiKey">Miniflux API Token</label>
    <input
      id="apiKey"
      type="text"
      bind:value={minifluxApiKey}
      placeholder="Your API token from miniflux"
    />


    <label for="refreshInterval">Refresh interval (in minutes)</label>
    <input
      id="refreshInterval"
      type="number"
      min="1"
      bind:value={refreshInterval}
      placeholder="Default: 10"
    />

    <button type="button" on:click={saveOptions}>Save</button>
    <div class="alert">{alertText}</div>
  </form>
</main>

<style>
  :global(:root) {
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      'Open Sans',
      'Helvetica Neue',
      sans-serif;

    color-scheme: light dark;
    background-color: #242424;
  }

  @media (prefers-color-scheme: light) {
    :global(:root) {
      background-color: #fafafa;
    }

    /* a:hover {
      color: #ff3e00;
    } */
  }

  :global(body) {
    min-width: 20rem;
    max-width: 40rem;
    margin: 0 auto;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h3 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 1.5rem;
    font-weight: 300;
    line-height: 1.2rem;
    margin: 2rem auto;
  }

  /* a {
    font-size: 1em;
    margin: 0.5rem;
    color: #cccccc;
    text-decoration: none;
  } */

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input[type='url'],
  input[type='number'],
  input[type='text'] {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    background: #333;
    color: #ccc;
    border: none;
    border-radius: 0.25rem;
  }

  input[type='url']:focus,
  input[type='number']:focus,
  input[type='text']:focus {
    outline: none;
    box-shadow: 0 0 0 2px #ff3e00;
  }

  button {
    padding: 0.5rem 1rem;
    background: #333;
    color: #ccc;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }

  .alert {
    color: #0099ff;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
</style>
