<template>
  <section id="certifications" class="p-6 text-green-400 bg-black font-mono min-h-screen">
    <h2 class="text-2xl font-bold border-b border-green-600 mb-4">🎓 Certifications</h2>
    <ul class="space-y-4">
      <li
        v-for="cert in certifications"
        :key="cert.title"
        class="border border-green-800 p-4 rounded bg-[#101010]"
      >
        <h3 class="text-lg text-green-300 font-semibold">{{ cert.title }}</h3>
        <p class="text-sm">🏢 {{ cert.issuer }}</p>
        <p class="text-sm italic">📅 {{ cert.year }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup>
import certifications from '../data/certifications.json'
</script>