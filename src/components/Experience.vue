<template>
  <section id="experience" class="p-6 bg-black text-green-400 font-mono min-h-screen">
    <h2 class="text-2xl font-bold mb-6 border-b border-green-600">💼 Experience</h2>

    <!-- CLI Terminal -->
    <div class="bg-[#0a0a0a] border border-green-800 rounded-lg p-4 mb-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
      <div class="mb-2 text-green-500 text-sm">➜ experience <span class="text-green-600">~</span> $</div>
      <input
        v-model="command"
        @keyup.enter="executeCommand"
        @input="handleInput"
        placeholder="Type: ls, open &lt;company&gt;, filter &lt;tech&gt;, clear"
        class="w-full bg-black text-green-200 border-b border-green-700 outline-none pb-1"
      />
      <div v-if="commandOutput.length > 0" class="mt-3 text-green-300 text-sm space-y-1">
        <div v-for="(line, index) in commandOutput" :key="index" class="animate-fade-in">
          {{ line }}
        </div>
      </div>
      <div v-if="!command && commandOutput.length === 0" class="mt-2 text-green-700 text-xs italic">
        Commands: <span class="text-green-500">ls</span> | 
        <span class="text-green-500">open &lt;company&gt;</span> | 
        <span class="text-green-500">filter &lt;tech&gt;</span> | 
        <span class="text-green-500">clear</span>
      </div>
    </div>

    <!-- Experience List -->
    <div class="space-y-5">
      <div
        v-for="(job, index) in filteredExperience"
        :key="`${job.company}-${job.start}`"
        :data-job-index="getOriginalIndex(job)"
        class="border border-green-800 rounded-lg bg-[#0a0a0a] hover:border-green-700 transition-all overflow-hidden"
        :class="{ 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]': expandedJobs.has(getOriginalIndex(job)) }"
      >
        <!-- Header - Always Visible -->
        <div class="p-5">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <!-- Role and Company -->
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <h3 class="text-lg font-semibold text-green-300">{{ job.role }}</h3>
                <span class="text-green-600">@</span>
                <span class="text-green-400 font-semibold">{{ job.company }}</span>
              </div>
              
              <!-- Meta Information -->
              <div class="flex flex-wrap items-center gap-3 text-sm text-green-500 mb-3">
                <span class="flex items-center gap-1">
                  <span>📅</span>
                  <span>{{ job.start }} → {{ job.end }}</span>
                </span>
                <span class="text-green-600">•</span>
                <span class="flex items-center gap-1">
                  <span>⏱️</span>
                  <span>{{ job.duration }}</span>
                </span>
                <span class="text-green-600">•</span>
                <span class="flex items-center gap-1">
                  <span>📍</span>
                  <span>{{ job.location }}</span>
                </span>
                <span v-if="job.type" class="text-green-600">•</span>
                <span v-if="job.type" class="px-2 py-0.5 border border-green-700 rounded text-xs bg-[#111]">
                  {{ job.type }}
                </span>
              </div>
              
              <!-- Summary - Always Visible -->
              <p class="text-green-200 text-sm mb-3 leading-relaxed">{{ job.summary }}</p>
              
              <!-- Tech Stack Pills -->
              <div class="flex flex-wrap gap-1.5 mb-3">
                <span
                  v-for="tech in job.tech"
                  :key="tech"
                  @click.stop="filterByTech(tech)"
                  class="text-xs border px-2 py-0.5 border-green-700 rounded-full cursor-pointer hover:bg-green-800 hover:border-green-500 transition-all"
                  :class="selectedTech === tech ? 'bg-green-700 border-green-500 text-white' : 'bg-[#111] text-green-300'"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            
            <!-- Expand/Collapse Button -->
            <button
              @click.stop="toggleExpand(getOriginalIndex(job))"
              class="flex-shrink-0 text-green-500 hover:text-green-300 transition-colors text-sm px-3 py-1 border border-green-700 rounded hover:bg-green-800"
              :class="expandedJobs.has(getOriginalIndex(job)) ? 'bg-green-800' : ''"
            >
              {{ expandedJobs.has(getOriginalIndex(job)) ? '▼ Show less' : '▶ Show more...' }}
            </button>
          </div>
        </div>

        <!-- Expanded Details - Collapsible -->
        <transition name="expand">
          <div v-if="expandedJobs.has(getOriginalIndex(job))" class="border-t border-green-800 bg-[#111]">
            <div class="p-5 pt-4">
              <div class="text-green-400 text-sm mb-3 font-semibold flex items-center gap-2">
                <span>▸</span>
                <span>Detailed Responsibilities & Achievements:</span>
              </div>
              <ul class="space-y-2.5">
                <li
                  v-for="(detail, detailIndex) in job.details"
                  :key="detailIndex"
                  class="text-green-200 text-sm flex items-start gap-2.5 leading-relaxed"
                >
                  <span class="text-green-600 mt-1 flex-shrink-0">▸</span>
                  <span>{{ detail }}</span>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredExperience.length === 0" class="text-center py-12 text-green-600">
      <p class="mb-2">No experience found matching your filter.</p>
      <button @click="clearFilters" class="mt-3 px-4 py-2 border border-green-700 rounded hover:bg-green-800 text-green-400 hover:text-green-300 transition-colors">
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
  expandedJobs.value.clear()
}

// Parse command
const parseCommand = (cmd) => {
  const trimmed = cmd.trim().toLowerCase()
  if (!trimmed) return { command: '', args: [] }
  
  // Handle quoted strings
  const tokens = []
  let current = ''
  let inQuotes = false
  let quoteChar = ''
  
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i]
    
    if ((char === '"' || char === "'") && (i === 0 || trimmed[i - 1] !== '\\')) {
      if (!inQuotes) {
        inQuotes = true
        quoteChar = char
      } else if (char === quoteChar) {
        inQuotes = false
        quoteChar = ''
      } else {
        current += char
      }
    } else if (char === ' ' && !inQuotes) {
      if (current) {
        tokens.push(current)
        current = ''
      }
    } else {
      current += char
    }
  }
  if (current) tokens.push(current)
  
  if (tokens.length === 0) return { command: '', args: [] }
  
  return {
    command: tokens[0],
    args: tokens.slice(1)
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
            element.classList.add('border-green-500', 'shadow-[0_0_20px_rgba(34,197,94,0.3)]')
            setTimeout(() => {
              element.classList.remove('border-green-500', 'shadow-[0_0_20px_rgba(34,197,94,0.3)]')
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
      const allTechs = experience.flatMap(job => job.tech)
      const matchingTech = allTechs.find(tech => 
        tech.toLowerCase().includes(techQuery)
      )
      if (matchingTech) {
        selectedTech.value = matchingTech
        commandOutput.value = [`Filtered by: ${matchingTech}`]
      } else {
        commandOutput.value = [`No tech found matching: ${parsed.args.join(' ')}`]
      }
      break
      
    case 'clear':
      clearFilters()
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
  
  // Sort by date (newest first) - parse dates properly
  return filtered.sort((a, b) => {
    const parseDate = (dateStr) => {
      if (dateStr === 'Present') return new Date()
      const parts = dateStr.match(/(\w+)\s+(\d+)/)
      if (parts) {
        const monthMap = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
        return new Date(parseInt(parts[2]), monthMap[parts[1]], 1)
      }
      return new Date(0)
    }
    const dateA = parseDate(a.start)
    const dateB = parseDate(b.start)
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

.expand-enter-active {
  transition: all 0.3s ease-out;
  overflow: hidden;
}

.expand-leave-active {
  transition: all 0.3s ease-in;
  overflow: hidden;
}

.expand-enter-from {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

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
