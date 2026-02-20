<script lang="ts">
let {
  title,
  options,
  value = $bindable(),
  image,
}: {
  title: string
  options: number[]
  value: number
  image?: string
} = $props()
</script>

<label class="w-fit" data-tooltip={image ? title : undefined}>
  {#if image}
    <img class="w-20 aspect-3/2 object-cover m-auto" src={`/assets/${image}.webp`} alt={title} />
  {:else}
    <h2>{title}</h2>
  {/if}
  <select bind:value>
    {#each options as option}
      <option value={option}>{option.toLocaleString('ja-JP')}</option>
    {/each}
  </select>
</label>

<style>
  :root {
    --pico-form-element-spacing-vertical: 0.5rem;
  }
  label {
    border: none;
  }
  select {
    width: 6.75rem;
    padding-inline-end: calc(var(--pico-form-element-spacing-horizontal) + 1rem);
    margin-bottom: 0;
  }
</style>
