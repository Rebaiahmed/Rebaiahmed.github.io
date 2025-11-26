<template>
  <section id="blogs" class="p-6 text-green-400 bg-black font-mono min-h-screen">
    <h2 class="text-2xl font-bold border-b border-green-600 mb-6">📚 Blog Posts</h2>

    <!-- CLI Search Terminal -->
    <div class="bg-[#0a0a0a] border border-green-800 rounded-lg p-4 mb-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
      <div class="mb-2 text-green-500 text-sm">➜ blogs <span class="text-green-600">~</span> $</div>
      <div class="relative">
        <input
          v-model="command"
          @keyup.enter="executeCommand"
          @keyup.arrow-up.prevent="navigateHistory(-1)"
          @keyup.arrow-down.prevent="navigateHistory(1)"
          @input="handleInput"
          @keydown.tab.prevent="completeCommand"
          placeholder="Type: ls, search &lt;keyword&gt;, grep &lt;text&gt;, clear"
          class="w-full bg-black text-green-200 border-b border-green-700 outline-none pb-1 pr-20"
          ref="commandInput"
        />
        <div v-if="showSuggestions && suggestions.length > 0" 
             class="absolute top-full left-0 right-0 mt-1 bg-[#0a0a0a] border border-green-800 rounded max-h-40 overflow-y-auto z-10">
          <div
            v-for="(suggestion, index) in suggestions"
            :key="index"
            @click="selectSuggestion(suggestion)"
            @mouseenter="selectedSuggestionIndex = index"
            :class="['px-3 py-1 cursor-pointer hover:bg-green-900', selectedSuggestionIndex === index ? 'bg-green-900' : '']"
          >
            <span class="text-green-400">{{ suggestion }}</span>
          </div>
        </div>
      </div>
      
      <!-- Command Output -->
      <div v-if="commandOutput" class="mt-4 text-green-300 text-sm space-y-1">
        <div v-for="(line, index) in commandOutput" :key="index" class="animate-fade-in">
          {{ line }}
        </div>
      </div>
      
      <!-- Help Text -->
      <div v-if="!commandOutput && !command" class="mt-2 text-green-700 text-xs italic">
        Commands: <span class="text-green-500">ls</span> | 
        <span class="text-green-500">search &lt;keyword&gt;</span> | 
        <span class="text-green-500">grep &lt;text&gt;</span> | 
        <span class="text-green-500">clear</span>
      </div>
    </div>

    <!-- Tag Filter Pills -->
    <div class="mb-6">
      <div class="text-sm text-green-500 mb-2">Filter by tags:</div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in allTags"
          :key="tag"
          @click="toggleTag(tag)"
          class="px-2.5 py-1 text-xs border border-green-700 rounded-full hover:bg-green-800 hover:border-green-500 transition-all"
          :class="selectedTags.includes(tag) ? 'bg-green-700 border-green-500 text-white' : 'bg-[#0a0a0a] text-green-300'"
        >
          {{ tag }}
        </button>
        <button
          v-if="selectedTags.length > 0"
          @click="clearTags"
          class="px-2.5 py-1 text-xs border border-red-700 rounded-full hover:bg-red-800 text-red-400"
        >
          Clear ({{ selectedTags.length }})
        </button>
      </div>
    </div>

    <!-- Blog Posts List -->
    <div v-if="filteredBlogs.length > 0" class="space-y-4">
      <div class="text-sm text-green-500 mb-2">
        Found {{ filteredBlogs.length }} post{{ filteredBlogs.length !== 1 ? 's' : '' }}
      </div>
      <ul class="space-y-4">
        <li
          v-for="post in filteredBlogs"
          :key="post.title"
          class="border border-green-800 p-4 rounded bg-[#101010] hover:border-green-600 transition-all animate-fade-in"
        >
          <h3 class="text-green-200 text-lg font-semibold mb-2">{{ post.title }}</h3>
          <p class="text-sm italic mb-2 text-green-500">🕒 {{ post.published }}</p>
          <div class="mb-3 flex flex-wrap gap-1.5">
            <span
              v-for="tag in post.tags"
              :key="tag"
              @click="toggleTag(tag)"
              class="text-xs border px-2 py-0.5 border-green-700 rounded-full cursor-pointer hover:bg-green-800 transition-colors"
            >
              {{ tag }}
            </span>
          </div>
          <a :href="post.url" target="_blank" rel="noopener noreferrer" 
             class="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1">
            Read more →
          </a>
        </li>
      </ul>
    </div>
    
    <div v-else class="text-center py-8 text-green-600">
      <p>No blog posts found matching your criteria.</p>
      <p class="text-sm mt-2">Try: <span class="text-green-400">blogs ls</span> or <span class="text-green-400">blogs search &lt;keyword&gt;</span></p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import blogs from '../data/blogs.json'

// State
const command = ref('')
const commandOutput = ref([])
const selectedTags = ref([])
const commandHistory = ref([])
const historyIndex = ref(-1)
const showSuggestions = ref(false)
const suggestions = ref([])
const selectedSuggestionIndex = ref(0)

// All available tags from blogs
const allTags = computed(() => {
  const tags = new Set()
  blogs.forEach(post => {
    post.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
})

// Command parser - handles whitespace, quotes, and flags properly
const parseCommand = (cmd) => {
  const trimmed = cmd.trim()
  if (!trimmed) return { command: '', args: [], flags: {} }
  
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
  
  if (tokens.length === 0) return { command: '', args: [], flags: {} }
  
  const command = tokens[0].toLowerCase()
  const args = []
  const flags = {}
  let i = 1
  
  while (i < tokens.length) {
    if (tokens[i].startsWith('--')) {
      const flagName = tokens[i].substring(2)
      const flagValues = []
      i++
      // Collect values until next flag or end
      while (i < tokens.length && !tokens[i].startsWith('--')) {
        flagValues.push(tokens[i])
        i++
      }
      flags[flagName] = flagValues.length === 1 ? flagValues[0] : flagValues
    } else {
      args.push(tokens[i])
      i++
    }
  }
  
  return { command, args, flags }
}

// Fuzzy search function
const fuzzySearch = (text, query) => {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  
  // Exact match
  if (lowerText.includes(lowerQuery)) return 100
  
  // Word boundary match
  const words = lowerText.split(/\s+/)
  const queryWords = lowerQuery.split(/\s+/)
  let score = 0
  queryWords.forEach(qw => {
    if (words.some(w => w.startsWith(qw) || w.includes(qw))) {
      score += 50
    }
  })
  
  // Character sequence match
  let textIndex = 0
  for (let i = 0; i < lowerQuery.length; i++) {
    const char = lowerQuery[i]
    const foundIndex = lowerText.indexOf(char, textIndex)
    if (foundIndex !== -1) {
      textIndex = foundIndex + 1
      score += 10
    } else {
      return 0
    }
  }
  
  return score
}

// Execute command
const executeCommand = () => {
  if (!command.value.trim()) return
  
  // Add to history
  commandHistory.value.unshift(command.value)
  if (commandHistory.value.length > 50) commandHistory.value.pop()
  historyIndex.value = -1
  
  const parsed = parseCommand(command.value)
  commandOutput.value = []
  showSuggestions.value = false
  
  switch (parsed.command) {
    case 'ls':
    case 'list':
      commandOutput.value = [`Found ${blogs.length} blog posts:`]
      blogs.forEach((post, index) => {
        commandOutput.value.push(`${index + 1}. ${post.title}`)
      })
      selectedTags.value = []
      break
      
    case 'search':
      if (parsed.args.length === 0) {
        commandOutput.value = ['Error: search requires a keyword. Usage: search <keyword>']
        break
      }
      const searchQuery = parsed.args.join(' ')
      const tagFilter = parsed.flags.tags ? (Array.isArray(parsed.flags.tags) ? parsed.flags.tags : [parsed.flags.tags]) : []
      
      // Filter by search query and tags
      const searchResults = blogs.filter(post => {
        const matchesQuery = fuzzySearch(post.title + ' ' + post.tags.join(' '), searchQuery) > 0
        const matchesTags = tagFilter.length === 0 || tagFilter.some(tag => 
          post.tags.some(pt => pt.toLowerCase().includes(tag.toLowerCase()))
        )
        return matchesQuery && matchesTags
      })
      
      commandOutput.value = [`Found ${searchResults.length} result(s) for "${searchQuery}":`]
      searchResults.forEach((post, index) => {
        commandOutput.value.push(`${index + 1}. ${post.title}`)
      })
      
      // Update selected tags if --tags was used
      if (tagFilter.length > 0) {
        selectedTags.value = tagFilter
      }
      break
      
    case 'grep':
      if (parsed.args.length === 0) {
        commandOutput.value = ['Error: grep requires text to search. Usage: grep <text>']
        break
      }
      const grepQuery = parsed.args.join(' ')
      const grepResults = blogs.filter(post => {
        const searchText = (post.title + ' ' + post.tags.join(' ') + ' ' + (post.description || '')).toLowerCase()
        return searchText.includes(grepQuery.toLowerCase())
      })
      
      commandOutput.value = [`Found ${grepResults.length} post(s) containing "${grepQuery}":`]
      grepResults.forEach((post, index) => {
        commandOutput.value.push(`${index + 1}. ${post.title}`)
      })
      break
      
    case 'clear':
      command.value = ''
      commandOutput.value = []
      selectedTags.value = []
      break
      
    case 'help':
      commandOutput.value = [
        'Available commands:',
        '  ls                    - List all blog posts',
        '  search <keyword>      - Search posts by keyword',
        '  search <keyword> --tags <tag1> <tag2>  - Search with tag filter',
        '  grep <text>           - Search for text in posts',
        '  clear                 - Clear search and filters',
        '  help                  - Show this help message'
      ]
      break
      
    default:
      if (parsed.command) {
        commandOutput.value = [`Unknown command: ${parsed.command}. Type 'help' for available commands.`]
      }
  }
  
  // Clear command after execution (except for clear command)
  if (parsed.command !== 'clear') {
    setTimeout(() => {
      command.value = ''
    }, 100)
  }
}

// Handle input for autocomplete
const handleInput = () => {
  const trimmed = command.value.trim()
  if (!trimmed) {
    showSuggestions.value = false
    return
  }
  
  const parsed = parseCommand(trimmed)
  suggestions.value = []
  
  // Suggest commands
  const availableCommands = ['ls', 'search', 'grep', 'clear', 'help']
  if (!parsed.command || parsed.command.length < 2) {
    suggestions.value = availableCommands.filter(cmd => cmd.startsWith(parsed.command))
  } else if (parsed.command === 'search' && parsed.args.length > 0) {
    // Suggest tags
    const query = parsed.args[parsed.args.length - 1].toLowerCase()
    suggestions.value = allTags.value.filter(tag => 
      tag.toLowerCase().includes(query) && !parsed.args.slice(0, -1).includes(tag)
    ).slice(0, 5)
  } else if (parsed.command === 'search' && parsed.args.length === 0) {
    // Suggest popular tags
    suggestions.value = allTags.value.slice(0, 5)
  }
  
  showSuggestions.value = suggestions.value.length > 0
  selectedSuggestionIndex.value = 0
}

// Complete command with suggestion
const completeCommand = () => {
  if (suggestions.value.length > 0 && selectedSuggestionIndex.value >= 0) {
    const suggestion = suggestions.value[selectedSuggestionIndex.value]
    const parsed = parseCommand(command.value)
    
    if (parsed.command === 'search' && parsed.args.length > 0) {
      // Replace last arg with suggestion
      const args = [...parsed.args]
      args[args.length - 1] = suggestion
      command.value = `search ${args.join(' ')}`
    } else if (!parsed.command) {
      command.value = suggestion + ' '
    }
    
    showSuggestions.value = false
  }
}

// Select suggestion
const selectSuggestion = (suggestion) => {
  const parsed = parseCommand(command.value)
  if (parsed.command === 'search' && parsed.args.length > 0) {
    const args = [...parsed.args]
    args[args.length - 1] = suggestion
    command.value = `search ${args.join(' ')}`
  } else {
    command.value = suggestion + ' '
  }
  showSuggestions.value = false
}

// Navigate command history
const navigateHistory = (direction) => {
  if (commandHistory.value.length === 0) return
  
  historyIndex.value += direction
  if (historyIndex.value < 0) historyIndex.value = -1
  if (historyIndex.value >= commandHistory.value.length) {
    historyIndex.value = commandHistory.value.length - 1
  }
  
  if (historyIndex.value === -1) {
    command.value = ''
  } else {
    command.value = commandHistory.value[historyIndex.value]
  }
}

// Toggle tag filter
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

// Clear all tags
const clearTags = () => {
  selectedTags.value = []
  command.value = ''
  commandOutput.value = []
}

// Filtered blogs based on selected tags and command output
const filteredBlogs = computed(() => {
  let filtered = [...blogs]
  
  // Apply tag filter
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(post =>
      selectedTags.value.some(tag => post.tags.includes(tag))
    )
  }
  
  // Sort by date (newest first)
  const parseDate = (dateStr) => {
    if (dateStr.includes('May 2025')) return new Date('2025-05-01')
    const parts = dateStr.match(/(\w+)\s+(\d+),?\s+(\d+)/)
    if (parts) {
      const monthMap = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
      return new Date(parseInt(parts[3]), monthMap[parts[1]], parseInt(parts[2]))
    }
    return new Date(0)
  }
  
  return filtered.sort((a, b) => {
    const dateA = parseDate(a.published)
    const dateB = parseDate(b.published)
    return dateB - dateA
  })
})

// Watch for command changes to update suggestions
watch(command, () => {
  handleInput()
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

.font-mono {
  font-family: 'Courier New', Courier, monospace;
}
</style>
