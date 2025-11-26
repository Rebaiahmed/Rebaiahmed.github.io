<template>
  <section id="blogs" class="p-6 text-green-400 bg-black font-mono min-h-screen">
    <h2 class="text-2xl font-bold border-b border-green-600 mb-6">📚 Blog Posts</h2>

    <!-- Terminal Input Bar -->
    <div class="mb-6 bg-[#0a0a0a] border border-green-800 p-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
      <!-- Command History Output -->
      <div v-if="commandHistory.length > 0" class="mb-4 space-y-1 text-green-300 text-sm">
        <div v-for="(entry, idx) in commandHistory" :key="idx" class="opacity-80">
          <div class="text-green-500">$ {{ entry.command }}</div>
          <div v-if="entry.output" class="ml-4 text-green-200" v-html="entry.output"></div>
        </div>
      </div>

      <!-- Terminal Input -->
      <div class="flex items-center space-x-2">
        <span class="text-green-500">$</span>
        <div class="flex-1 relative">
          <input
            ref="terminalInput"
            v-model="commandInput"
            @keydown="handleKeyDown"
            @input="handleInput"
            @focus="isFocused = true"
            @blur="isFocused = false"
            type="text"
            placeholder="Type 'blog ls' or 'blog search keyword'"
            class="w-full bg-transparent text-green-200 border-none outline-none font-mono text-sm"
            autocomplete="off"
            spellcheck="false"
          />
          <!-- Blinking Cursor -->
          <span
            v-if="isFocused"
            class="absolute right-0 top-0 text-green-400 animate-blink"
            :style="{ animation: 'blink 1s infinite' }"
          >
            ▊
          </span>
        </div>
      </div>

      <!-- Autocomplete Suggestions -->
      <div v-if="autocompleteSuggestions.length > 0 && commandInput.trim()" class="mt-2 ml-6 text-green-600 text-xs space-y-0.5">
        <div v-for="(suggestion, idx) in autocompleteSuggestions.slice(0, 5)" :key="idx" class="opacity-70">
          → {{ suggestion }}
        </div>
      </div>

      <!-- Help Text -->
      <div v-if="!commandInput && commandHistory.length === 0" class="mt-2 text-green-600 text-xs opacity-60">
        Try: <span class="text-green-400">blog ls</span> | <span class="text-green-400">blog search "keyword"</span> | <span class="text-green-400">blog category fullstack</span>
      </div>
    </div>

    <!-- CLI Output Section -->
    <div v-if="cliOutput.length > 0" class="mb-6 bg-[#0a0a0a] border border-green-800 p-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
      <div class="space-y-1 text-green-300 text-sm">
        <div
          v-for="(line, idx) in cliOutput"
          :key="idx"
          class="terminal-line"
          :style="{ animationDelay: `${idx * 50}ms` }"
        >
          {{ line }}
        </div>
      </div>
    </div>

    <!-- Legacy Tag Filter (kept for backward compatibility) -->
    <div class="mb-4 space-x-2 flex-wrap flex">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="selectedTag = tag"
        class="px-2 py-1 border border-green-600 rounded hover:bg-green-600 hover:text-white mb-2"
        :class="{ 'bg-green-700 text-white': selectedTag === tag }"
      >
        {{ tag }}
      </button>
      <button
        @click="clearFilters"
        class="px-2 py-1 border border-green-800 rounded text-sm mb-2"
      >
        Clear
      </button>
    </div>

    <!-- Blog Posts List -->
    <ul class="space-y-4">
      <li
        v-for="(post, idx) in filteredBlogs"
        :key="post.title"
        class="border border-green-800 p-4 rounded bg-[#101010] blog-card"
        :style="{ animationDelay: `${idx * 80}ms` }"
      >
        <h3 class="text-green-200 text-lg font-semibold">{{ post.title }}</h3>
        <p class="text-sm italic mb-1">🕒 {{ post.published }}</p>
        <div class="mb-2 space-x-1 flex-wrap flex">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="text-xs border px-2 py-1 border-green-700 rounded mb-1"
          >
            {{ tag }}
          </span>
        </div>
        <a :href="post.url" target="_blank" class="text-blue-400 underline hover:text-blue-300">Read more →</a>
      </li>
      <li v-if="filteredBlogs.length === 0" class="border border-green-800 p-4 rounded bg-[#101010] text-green-500 text-center">
        No blog posts found. Try a different search.
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import blogs from '../data/blogs.json'

// Terminal state
const terminalInput = ref(null)
const commandInput = ref('')
const isFocused = ref(false)
const commandHistory = ref([])
const cliOutput = ref([])
const selectedTag = ref('')
const autocompleteSuggestions = ref([])

// Categories mapping
const categories = {
  frontend: ['Angular', 'Vue', 'Vue.js', 'React', 'TypeScript', 'Tailwind CSS', 'CSS', 'Frontend'],
  fullstack: ['Angular', 'Vue', 'Node.js', 'NestJS', 'MongoDB', 'PostgreSQL', 'Fullstack', 'Nx'],
  backend: ['Node.js', 'NestJS', 'Express.js', 'MongoDB', 'PostgreSQL', 'Backend', 'API', 'REST APIs', 'GraphQL'],
  devops: ['Docker', 'CI/CD', 'GitHub Actions', 'DevOps', 'Nx'],
  cloud: ['AWS', 'Cloud', 'Docker'],
  tooling: ['Nx', 'Schematics', 'CLI', 'Tooling', 'Git'],
  testing: ['Cypress', 'Jest', 'Testing', 'E2E'],
  architecture: ['Architecture', 'Best Practices', 'State Management', 'NgRx', 'RxJS']
}

// All available tags and keywords for autocomplete
const allTags = [...new Set(blogs.flatMap(post => post.tags))]
const allKeywords = computed(() => {
  const keywords = new Set()
  blogs.forEach(post => {
    post.tags.forEach(tag => keywords.add(tag.toLowerCase()))
    post.title.toLowerCase().split(/\s+/).forEach(word => {
      if (word.length > 2) keywords.add(word)
    })
  })
  return Array.from(keywords)
})

// Fuzzy search implementation
const fuzzyMatch = (pattern, text) => {
  const patternLower = pattern.toLowerCase()
  const textLower = text.toLowerCase()
  
  // Exact match
  if (textLower.includes(patternLower)) return 100
  
  // Fuzzy match - check if all pattern characters exist in order
  let patternIdx = 0
  for (let i = 0; i < textLower.length && patternIdx < patternLower.length; i++) {
    if (textLower[i] === patternLower[patternIdx]) {
      patternIdx++
    }
  }
  
  if (patternIdx === patternLower.length) {
    return 50 + (patternLower.length / textLower.length) * 50
  }
  
  return 0
}

// Command parser
const parseCommand = (input) => {
  const trimmed = input.trim()
  if (!trimmed) return null
  
  const parts = trimmed.split(/\s+/)
  const command = parts[0]
  
  if (command === 'clear') {
    return { type: 'clear' }
  }
  
  if (command === 'blog') {
    const subcommand = parts[1]
    
    if (subcommand === 'ls' || subcommand === 'list') {
      const flags = extractFlags(parts.slice(2))
      return { type: 'list', flags }
    }
    
    if (subcommand === 'search') {
      const keyword = extractQuotedString(trimmed) || parts[2] || ''
      const flags = extractFlags(parts.slice(2))
      return { type: 'search', keyword: keyword.trim(), flags }
    }
    
    if (subcommand === 'grep') {
      const pattern = extractQuotedString(trimmed) || parts[2] || ''
      const flags = extractFlags(parts.slice(2))
      return { type: 'grep', pattern: pattern.trim(), flags }
    }
    
    if (subcommand === 'category') {
      const category = parts[2] || ''
      const flags = extractFlags(parts.slice(3))
      return { type: 'category', category: category.toLowerCase(), flags }
    }
  }
  
  return null
}

const extractQuotedString = (input) => {
  const match = input.match(/"([^"]+)"/)
  return match ? match[1] : null
}

const extractFlags = (parts) => {
  const flags = { tags: [], sort: 'date' }
  
  let i = 0
  while (i < parts.length) {
    if (parts[i] === '--tags') {
      i++
      while (i < parts.length && !parts[i].startsWith('--')) {
        flags.tags.push(parts[i])
        i++
      }
      continue
    }
    
    if (parts[i]?.startsWith('--sort=')) {
      flags.sort = parts[i].split('=')[1] || 'date'
      i++
      continue
    }
    
    // Handle category flags like --fullstack, --backend, etc.
    if (parts[i]?.startsWith('--')) {
      const flagName = parts[i].substring(2)
      if (categories[flagName]) {
        flags.tags.push(...categories[flagName])
      }
      i++
      continue
    }
    
    i++
  }
  
  return flags
}

// Execute command
const executeCommand = (command) => {
  if (!command) return
  
  cliOutput.value = []
  
  if (command.type === 'clear') {
    commandHistory.value = []
    cliOutput.value = []
    selectedTag.value = ''
    return
  }
  
  if (command.type === 'list') {
    const results = filterBlogs(command)
    cliOutput.value = [
      `→ Found ${results.length} post${results.length !== 1 ? 's' : ''}`,
      ...results.slice(0, 10).map((post, idx) => 
        `→ [${post.published}] ${post.title}`
      ),
      ...(results.length > 10 ? [`→ ... and ${results.length - 10} more`] : [])
    ]
    return
  }
  
  if (command.type === 'search') {
    const results = filterBlogs(command)
    cliOutput.value = [
      `→ Searching for "${command.keyword}"...`,
      `→ Found ${results.length} post${results.length !== 1 ? 's' : ''}`,
      ...results.slice(0, 10).map(post => 
        `→ [${post.published}] ${post.title}`
      ),
      ...(results.length > 10 ? [`→ ... and ${results.length - 10} more`] : [])
    ]
    return
  }
  
  if (command.type === 'grep') {
    const results = filterBlogs(command)
    cliOutput.value = [
      `→ Grepping for "${command.pattern}"...`,
      `→ Found ${results.length} match${results.length !== 1 ? 'es' : ''}`,
      ...results.slice(0, 10).map(post => 
        `→ [${post.published}] ${post.title}`
      ),
      ...(results.length > 10 ? [`→ ... and ${results.length - 10} more`] : [])
    ]
    return
  }
  
  if (command.type === 'category') {
    const results = filterBlogs(command)
    cliOutput.value = [
      `→ Category: ${command.category}`,
      `→ Found ${results.length} post${results.length !== 1 ? 's' : ''}`,
      ...results.slice(0, 10).map(post => 
        `→ [${post.published}] ${post.title}`
      ),
      ...(results.length > 10 ? [`→ ... and ${results.length - 10} more`] : [])
    ]
    return
  }
}

// Filter blogs based on command
const filterBlogs = (command) => {
  let filtered = [...blogs]
  
  if (command.type === 'search' && command.keyword) {
    const keyword = command.keyword.toLowerCase()
    filtered = filtered.filter(post => {
      const titleMatch = fuzzyMatch(keyword, post.title) > 30
      const tagMatch = post.tags.some(tag => fuzzyMatch(keyword, tag) > 30)
      return titleMatch || tagMatch
    })
  }
  
  if (command.type === 'grep' && command.pattern) {
    const pattern = command.pattern.toLowerCase()
    filtered = filtered.filter(post => {
      return post.title.toLowerCase().includes(pattern) ||
             post.tags.some(tag => tag.toLowerCase().includes(pattern))
    })
  }
  
  if (command.type === 'category' && command.category) {
    const categoryTags = categories[command.category] || []
    if (categoryTags.length > 0) {
      filtered = filtered.filter(post => 
        post.tags.some(tag => categoryTags.includes(tag))
      )
    }
  }
  
  // Apply tag filters from flags
  if (command.flags?.tags && command.flags.tags.length > 0) {
    filtered = filtered.filter(post =>
      command.flags.tags.some(flagTag =>
        post.tags.some(postTag => 
          postTag.toLowerCase().includes(flagTag.toLowerCase()) ||
          flagTag.toLowerCase().includes(postTag.toLowerCase())
        )
      )
    )
  }
  
  // Sort
  const sortBy = command.flags?.sort || 'date'
  if (sortBy === 'date') {
    filtered.sort((a, b) => {
      const dateA = parseDate(a.published)
      const dateB = parseDate(b.published)
      return dateB - dateA
    })
  }
  
  return filtered
}

// Parse date
const parseDate = (dateStr) => {
  if (dateStr.includes('May 2025')) return new Date('2025-05-01')
  if (dateStr.includes('2024')) {
    const parts = dateStr.match(/(\w+)\s+(\d+),?\s+(\d+)/)
    if (parts) {
      const monthMap = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
      return new Date(parseInt(parts[3]), monthMap[parts[1]], parseInt(parts[2]))
    }
  }
  if (dateStr.includes('2023')) {
    const parts = dateStr.match(/(\w+)\s+(\d+),?\s+(\d+)/)
    if (parts) {
      const monthMap = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
      return new Date(parseInt(parts[3]), monthMap[parts[1]], parseInt(parts[2]))
    }
  }
  if (dateStr.includes('2022')) {
    const parts = dateStr.match(/(\w+)\s+(\d+),?\s+(\d+)/)
    if (parts) {
      const monthMap = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
      return new Date(parseInt(parts[3]), monthMap[parts[1]], parseInt(parts[2]))
    }
  }
  return new Date(0)
}

// Handle input for autocomplete
const handleInput = () => {
  const input = commandInput.value.toLowerCase().trim()
  
  if (!input) {
    autocompleteSuggestions.value = []
    return
  }
  
  const suggestions = new Set()
  
  // Command suggestions
  if (input.startsWith('blog ')) {
    const subcommands = ['search', 'ls', 'grep', 'category']
    const remaining = input.substring(5).trim()
    if (!remaining || remaining.split(' ').length === 1) {
      subcommands.forEach(cmd => {
        if (cmd.startsWith(remaining)) {
          suggestions.add(`blog ${cmd}`)
        }
      })
    }
  } else if (input.startsWith('blog search ')) {
    const keyword = input.substring(12).trim()
    if (keyword.length > 0) {
      allKeywords.value.forEach(kw => {
        if (kw.startsWith(keyword) && kw !== keyword) {
          suggestions.add(`blog search "${kw}"`)
        }
      })
    }
  } else if (input.startsWith('blog category ')) {
    const category = input.substring(14).trim()
    Object.keys(categories).forEach(cat => {
      if (cat.startsWith(category)) {
        suggestions.add(`blog category ${cat}`)
      }
    })
  } else {
    // Top-level commands
    if ('blog'.startsWith(input)) suggestions.add('blog')
    if ('clear'.startsWith(input)) suggestions.add('clear')
  }
  
  autocompleteSuggestions.value = Array.from(suggestions).slice(0, 5)
}

// Handle keydown events
const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    const command = parseCommand(commandInput.value)
    
    if (command) {
      commandHistory.value.push({
        command: commandInput.value,
        output: null
      })
      executeCommand(command)
      commandInput.value = ''
      autocompleteSuggestions.value = []
    }
  } else if (event.key === 'Tab' && autocompleteSuggestions.value.length > 0) {
    event.preventDefault()
    commandInput.value = autocompleteSuggestions.value[0]
    autocompleteSuggestions.value = []
  }
}

// Clear all filters
const clearFilters = () => {
  selectedTag.value = ''
  commandInput.value = ''
  commandHistory.value = []
  cliOutput.value = []
  autocompleteSuggestions.value = []
}

// Current filter state
const currentFilter = computed(() => {
  if (commandHistory.value.length === 0) {
    return selectedTag.value ? { type: 'tag', tag: selectedTag.value } : null
  }
  
  const lastCommand = commandHistory.value[commandHistory.value.length - 1].command
  return parseCommand(lastCommand)
})

// Filtered blogs
const filteredBlogs = computed(() => {
  if (currentFilter.value) {
    return filterBlogs(currentFilter.value)
  }
  
  if (selectedTag.value) {
    return blogs.filter(post => post.tags.includes(selectedTag.value))
  }
  
  return blogs.sort((a, b) => {
    const dateA = parseDate(a.published)
    const dateB = parseDate(b.published)
    return dateB - dateA
  })
})

// Focus input on mount
onMounted(() => {
  nextTick(() => {
    if (terminalInput.value) {
      terminalInput.value.focus()
    }
  })
})
</script>

<style scoped>
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-blink {
  animation: blink 1s infinite;
}

.terminal-line {
  animation: fadeIn 0.3s ease-out forwards;
  opacity: 0;
}

.blog-card {
  animation: fadeIn 0.4s ease-out forwards;
  opacity: 0;
}

/* Neon glow when focused */
input:focus {
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
}

/* Ensure monospace font */
.font-mono {
  font-family: 'Courier New', Courier, monospace;
}
</style>
