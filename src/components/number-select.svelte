<script lang="ts">
let {
  title,
  options,
  value = $bindable(),
}: {
  title: string
  options: number[]
  value: number
} = $props()
</script>

<label>
  {title}:
  <select bind:value>
    {#each options as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
</label>
