<template>
  <section id="skills" class="p-6 bg-black text-green-400 font-mono min-h-screen">
    <h2 class="text-2xl font-bold border-b border-green-600 mb-4">🧠 Skills</h2>
    <TerminalFilter label="skills" :data="skills" />
  </section>
</template>

<script setup>
import TerminalFilter from './TerminalFilter.vue'
import skills from '../data/skills.json'
</script>