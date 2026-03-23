<script lang="ts">
let { title, value = $bindable(), max }: { title: string; value: number; max: number } = $props()
</script>

<label class="items-center gap-2">
  <h2>{title}</h2>
  <input type="number" bind:value min={0} max={max} />
</label>

<style>
  :root {
    --pico-form-element-spacing-vertical: 0.5rem;
  }
  label {
    display: flex;
    border: none;
    margin-bottom: 0;
  }
  h2 {
    margin: 0;
  }
  input {
    width: 3.75rem;
    padding-inline-end: .5rem;
    margin: 0;
  }
</style>
