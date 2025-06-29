<template>
  <div class="bg-black text-green-400 font-mono p-4 rounded border border-green-800 shadow">
    <div class="mb-2">➜ {{ label }} <span class="text-green-600">~</span> $</div>
    <input
      v-model="command"
      @keyup.enter="runCommand"
      placeholder="Type 'ls skills' or 'pwd fullstack'"
      class="w-full bg-black text-green-200 border-b border-green-700 outline-none pb-1"
    />

    <div class="mt-4 space-y-1 text-green-300" v-if="filtered.length">
      <div v-for="item in filtered" :key="item">
        <span v-if="iconMap[item]">🔹 {{ iconMap[item] }}</span> {{ item }}
      </div>
    </div>

    <p v-else class="text-green-700 italic mt-2">Try: ls skills, pwd frontend, pwd fullstack</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  label: String,
  data: Array
})

const iconMap = {
  'Angular': '🅰️',
  'Vue.js': '🖖',
  'Node.js': '🟢',
  'NestJS': '🚀',
  'MongoDB': '🍃',
  'PostgreSQL': '🐘',
  'Docker': '🐳',
  'Cypress': '🧪',
  'Jest': '🃏',
  'Storybook': '📘',
  'AWS': '☁️',
  'Express.js': '🚂',
  'Tailwind CSS': '🎨',
  'Nx': '📦',
  'GraphQL': '🔺',
  'TypeScript': '🔷',
  'GitHub Actions': '⚙️',
  'RxJS': '📡',
  'NgRx': '📦'
}

const command = ref('')
const filtered = computed(() => {
  const cmd = command.value.toLowerCase()
  if (cmd.includes('pwd fullstack')) {
    return props.data.filter(skill =>
      ['Angular', 'Vue.js', 'Node.js', 'NestJS', 'MongoDB', 'Nx', 'Docker'].includes(skill)
    )
  }
  if (cmd.includes('pwd frontend')) {
    return props.data.filter(skill =>
      ['Angular', 'Vue.js', 'RxJS', 'NgRx', 'Storybook', 'Cypress', 'Tailwind CSS'].includes(skill)
    )
  }
  if (cmd.includes('pwd backend')) {
    return props.data.filter(skill =>
      ['Node.js', 'NestJS', 'Express.js', 'MongoDB', 'PostgreSQL'].includes(skill)
    )
  }
  if (cmd.includes('ls skills')) {
    return props.data
  }
  return []
})

const runCommand = () => {}
</script>