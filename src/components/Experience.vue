<template>
  <section id="experience" class="p-6 bg-black text-green-400 font-mono min-h-screen">
    <h2 class="text-2xl font-bold mb-6 border-b border-green-600">💼 Experience</h2>

    <!-- CLI Terminal (Optional) -->
    <div class="bg-[#0a0a0a] border border-green-800 rounded-lg p-4 mb-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
      <div class="mb-2 text-green-500 text-sm">➜ experience <span class="text-green-600">~</span> $</div>
      <input
        v-model="command"
        @keyup.enter="executeCommand"
        @input="handleInput"
        placeholder="Type: ls, open &lt;company&gt;, filter &lt;tech&gt;, clear"
        class="w-full bg-black text-green-200 border-b border-green-700 outline-none pb-1"
      />
      <div v-if="commandOutput" class="mt-3 text-green-300 text-sm space-y-1">
        <div v-for="(line, index) in commandOutput" :key="index" class="animate-fade-in">
          {{ line }}
        </div>
      </div>
      <div v-if="!command && !commandOutput" class="mt-2 text-green-700 text-xs italic">
        Commands: <span class="text-green-500">ls</span> | 
        <span class="text-green-500">open &lt;company&gt;</span> | 
        <span class="text-green-500">filter &lt;tech&gt;</span> | 
        <span class="text-green-500">clear</span>
      </div>
    </div>

    <!-- Experience List -->
    <div class="space-y-4">
      <div
        v-for="(job, index) in filteredExperience"
        :key="`${job.company}-${index}`"
        :data-job-index="getOriginalIndex(job)"
        class="border border-green-800 rounded-lg bg-[#0a0a0a] hover:border-green-700 transition-all overflow-hidden"
        :class="{ 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]': expandedJobs.has(getOriginalIndex(job)) }"
      >
        <!-- Header -->
        <div class="p-4 cursor-pointer" @click="toggleExpand(index)">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-lg font-semibold text-green-300">{{ job.role }}</h3>
                <span class="text-green-600">@</span>
                <span class="text-green-400 font-semibold">{{ job.company }}</span>
              </div>
              <div class="flex flex-wrap items-center gap-3 text-sm text-green-500 mb-2">
                <span>📅 {{ job.start }} → {{ job.end }}</span>
                <span class="text-green-600">•</span>
                <span>⏱️ {{ job.duration }}</span>
                <span class="text-green-600">•</span>
                <span>📍 {{ job.location }}</span>
                <span v-if="job.type" class="text-green-600">•</span>
                <span v-if="job.type" class="px-2 py-0.5 border border-green-700 rounded text-xs">
                  {{ job.type }}
                </span>
              </div>
              <p class="text-green-200 text-sm mb-3">{{ job.summary }}</p>
              
              <!-- Tech Stack Pills -->
              <div class="flex flex-wrap gap-1.5 mb-2">
                <span
                  v-for="tech in job.tech"
                  :key="tech"
                  @click.stop="filterByTech(tech)"
                  class="text-xs border px-2 py-0.5 border-green-700 rounded-full cursor-pointer hover:bg-green-800 hover:border-green-500 transition-colors"
                  :class="selectedTech === tech ? 'bg-green-700 border-green-500' : 'bg-[#111]'"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            
            <!-- Expand/Collapse Button -->
            <button
              @click.stop="toggleExpand(getOriginalIndex(job))"
              class="ml-4 text-green-500 hover:text-green-300 transition-colors text-sm"
            >
              {{ expandedJobs.has(getOriginalIndex(job)) ? '▼' : '▶' }}
            </button>
          </div>
        </div>

        <!-- Expanded Details -->
        <transition name="expand">
          <div v-if="expandedJobs.has(getOriginalIndex(job))" class="border-t border-green-800 bg-[#111]">
            <div class="p-4 pt-3">
              <div class="text-green-400 text-sm mb-2 font-semibold">Details:</div>
              <ul class="space-y-2">
                <li
                  v-for="(detail, detailIndex) in job.details"
                  :key="detailIndex"
                  class="text-green-200 text-sm flex items-start gap-2"
                >
                  <span class="text-green-600 mt-1">▸</span>
                  <span>{{ detail }}</span>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredExperience.length === 0" class="text-center py-8 text-green-600">
      <p>No experience found matching your filter.</p>
      <button @click="clearFilters" class="mt-2 text-green-400 hover:text-green-300 underline">
        Clear filters
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import experience from '../data/experience.json'

// State
const expandedJobs = ref(new Set())
const command = ref('')
const commandOutput = ref([])
const selectedTech = ref('')

// Get original index from experience array
const getOriginalIndex = (job) => {
  return experience.findIndex(e => 
    e.company === job.company && e.role === job.role && e.start === job.start
  )
}

// Toggle expand/collapse
const toggleExpand = (index) => {
  if (expandedJobs.value.has(index)) {
    expandedJobs.value.delete(index)
  } else {
    expandedJobs.value.add(index)
  }
}

// Filter by tech
const filterByTech = (tech) => {
  if (selectedTech.value === tech) {
    selectedTech.value = ''
  } else {
    selectedTech.value = tech
  }
  command.value = ''
  commandOutput.value = []
}

// Clear filters
const clearFilters = () => {
  selectedTech.value = ''
  command.value = ''
  commandOutput.value = []
}

// Parse command
const parseCommand = (cmd) => {
  const trimmed = cmd.trim().toLowerCase()
  if (!trimmed) return { command: '', args: [] }
  
  const parts = trimmed.split(/\s+/)
  return {
    command: parts[0],
    args: parts.slice(1)
  }
}

// Execute command
const executeCommand = () => {
  if (!command.value.trim()) return
  
  const parsed = parseCommand(command.value)
  commandOutput.value = []
  
  switch (parsed.command) {
    case 'ls':
    case 'list':
      commandOutput.value = [`Found ${experience.length} experience entries:`]
      experience.forEach((job, index) => {
        commandOutput.value.push(`${index + 1}. ${job.role} @ ${job.company}`)
      })
      selectedTech.value = ''
      break
      
    case 'open':
      if (parsed.args.length === 0) {
        commandOutput.value = ['Error: open requires a company name. Usage: open <company>']
        break
      }
      const companyQuery = parsed.args.join(' ').toLowerCase()
      const foundJob = experience.findIndex(job => 
        job.company.toLowerCase().includes(companyQuery)
      )
      if (foundJob !== -1) {
        expandedJobs.value.add(foundJob)
        commandOutput.value = [`Opened: ${experience[foundJob].role} @ ${experience[foundJob].company}`]
        // Scroll to element
        setTimeout(() => {
          const element = document.querySelector(`[data-job-index="${foundJob}"]`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // Highlight briefly
            element.classList.add('border-green-500')
            setTimeout(() => {
              element.classList.remove('border-green-500')
            }, 2000)
          }
        }, 100)
      } else {
        commandOutput.value = [`No experience found for: ${parsed.args.join(' ')}`]
      }
      break
      
    case 'filter':
      if (parsed.args.length === 0) {
        commandOutput.value = ['Error: filter requires a tech name. Usage: filter <tech>']
        break
      }
      const techQuery = parsed.args.join(' ').toLowerCase()
      const matchingTech = experience
        .flatMap(job => job.tech)
        .find(tech => tech.toLowerCase().includes(techQuery))
      if (matchingTech) {
        selectedTech.value = matchingTech
        commandOutput.value = [`Filtered by: ${matchingTech}`]
      } else {
        commandOutput.value = [`No tech found matching: ${parsed.args.join(' ')}`]
      }
      break
      
    case 'clear':
      clearFilters()
      expandedJobs.value.clear()
      commandOutput.value = ['Cleared all filters and expanded items']
      break
      
    case 'help':
      commandOutput.value = [
        'Available commands:',
        '  ls                    - List all experience entries',
        '  open <company>        - Expand experience for company',
        '  filter <tech>         - Filter by technology',
        '  clear                 - Clear all filters',
        '  help                  - Show this help message'
      ]
      break
      
    default:
      if (parsed.command) {
        commandOutput.value = [`Unknown command: ${parsed.command}. Type 'help' for available commands.`]
      }
  }
  
  if (parsed.command !== 'clear') {
    setTimeout(() => {
      command.value = ''
    }, 100)
  }
}

// Handle input for autocomplete
const handleInput = () => {
  // Could add autocomplete here if needed
}

// Filtered experience
const filteredExperience = computed(() => {
  let filtered = [...experience]
  
  if (selectedTech.value) {
    filtered = filtered.filter(job =>
      job.tech.some(tech => tech === selectedTech.value)
    )
  }
  
  // Sort by date (newest first)
  return filtered.sort((a, b) => {
    const dateA = new Date(a.start)
    const dateB = new Date(b.start)
    return dateB - dateA
  })
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1000px;
  opacity: 1;
}

.font-mono {
  font-family: 'Courier New', Courier, monospace;
}
</style>
