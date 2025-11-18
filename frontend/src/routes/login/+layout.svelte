<script>
  let { children } = $props();
</script>

<section class="centered">
  {@render children()}
</section>

<style>
  .centered {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
