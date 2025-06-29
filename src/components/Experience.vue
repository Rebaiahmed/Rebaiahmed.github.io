<template>
  <section id="experience" class="p-6 bg-black text-green-400 font-mono min-h-screen">
    <h2 class="text-2xl font-bold mb-6 border-b border-green-600">💼 Experience</h2>

    <ul class="space-y-6">
      <li
        v-for="job in experience"
        :key="job.company"
        class="border-l-4 border-green-500 pl-4"
      >
        <div class="text-lg font-semibold text-green-300">
          {{ job.role }} @ {{ job.company }}
        </div>
        <div class="text-sm text-green-500 mb-1">
          {{ job.start }} → {{ job.end }}
        </div>
        <p class="text-green-200 leading-relaxed">
          {{ job.description }}
        </p>
      </li>
    </ul>
  </section>
</template>

<script setup>
import experience from '../data/experience.json'
</script>
