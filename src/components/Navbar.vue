<template>
  <nav class="p-4 flex justify-between items-center bg-black text-green-400 border-b border-green-600 font-mono">
    <div class="text-lg font-bold">🧠 Ahmed Rebai</div>
    <div class="space-x-4">
      <RouterLink to="/experience" class="hover:text-green-200">Experience</RouterLink>
      <RouterLink to="/projects" class="hover:text-green-200">Projects</RouterLink>
      <RouterLink to="/blogs" class="hover:text-green-200">Blogs</RouterLink>
      <RouterLink to="/skills" class="hover:text-green-200">Skills</RouterLink>
      <RouterLink to="/certifications" class="hover:text-green-200">Certifications</RouterLink>
      <RouterLink to="/contact" class="hover:text-green-200">Contact</RouterLink>
    </div>
    <button @click="toggleTheme" class="ml-4 border px-2 py-1 border-green-500 rounded hover:bg-green-700 hover:text-white">
      Toggle Theme
    </button>
  </nav>
</template>

<script setup>
const toggleTheme = () => {
  document.body.classList.toggle('dark')
}
</script>

<style scoped>
nav {
  font-family: 'Courier New', Courier, monospace;
}
</style>
