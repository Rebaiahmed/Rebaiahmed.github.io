<template>
  <section id="projects" class="p-6 bg-black text-green-400 font-mono min-h-screen">
    <h2 class="text-2xl font-bold mb-6 border-b border-green-600 pb-2">📁 Projects</h2>

    <!-- Tag Filter -->
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

    <!-- Projects List -->
    <div v-if="filteredProjects.length > 0" class="space-y-4">
      <div class="text-sm text-green-500 mb-2">
        Found {{ filteredProjects.length }} project{{ filteredProjects.length !== 1 ? 's' : '' }}
      </div>
      
      <div
        v-for="project in filteredProjects"
        :key="project.name"
        class="project-card border border-green-800 rounded-lg bg-[#0a0a0a] hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all duration-300 animate-fade-in"
      >
        <!-- Card Header -->
        <div class="p-4">
          <!-- Terminal-style Header -->
          <div v-if="project.terminalHeader" class="mb-3 pb-2 border-b border-green-800">
            <div class="text-green-400 text-sm font-semibold">{{ project.terminalHeader }}</div>
          </div>
          
          <!-- Project Title -->
          <h3 class="text-green-200 text-lg font-semibold mb-2">{{ project.name }}</h3>
          
          <!-- Short Description (Always Visible) -->
          <p class="text-sm text-green-300 mb-3 leading-relaxed">{{ getShortDescription(project.description) }}</p>
          
          <!-- Tech Stack Pills -->
          <div class="flex flex-wrap gap-1.5 mb-3">
            <span
              v-for="tag in project.tags"
              :key="tag"
              @click.stop="toggleTag(tag)"
              class="text-xs border px-2 py-0.5 border-green-700 rounded-full cursor-pointer hover:bg-green-800 hover:border-green-500 transition-all bg-[#111] text-green-300"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-2 mb-3">
            <a
              v-if="project.url"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs px-3 py-1.5 border border-green-700 rounded hover:bg-green-800 hover:border-green-500 transition-all text-green-300 inline-flex items-center gap-1"
            >
              <span>🔗</span> Open Repository
            </a>
            <button
              v-if="project.githubBadge"
              class="text-xs px-3 py-1.5 border border-green-700 rounded hover:bg-green-800 hover:border-green-500 transition-all text-green-300 inline-flex items-center gap-1 cursor-not-allowed opacity-60"
              disabled
            >
              <span>⚙️</span> Run Commands
            </button>
          </div>

          <!-- Expand/Collapse Button -->
          <button
            @click.stop="toggleExpand(project.name)"
            class="flex-shrink-0 text-green-500 hover:text-green-300 transition-colors text-sm px-3 py-1 border border-green-700 rounded hover:bg-green-800"
            :class="expandedProjects.has(project.name) ? 'bg-green-800' : ''"
          >
            {{ expandedProjects.has(project.name) ? '▼ Show less' : '▶ Show more...' }}
          </button>
        </div>

        <!-- Expanded Details - Collapsible -->
        <transition name="expand">
          <div v-if="expandedProjects.has(project.name)" class="expanded-content border-t border-green-800 bg-[#050505]">
            <div class="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <!-- Terminal Commands (if available) -->
              <div v-if="project.commands && project.commands.length > 0" class="terminal-commands border border-green-700 rounded p-3 bg-[#000]">
                <div class="text-xs text-green-600 mb-2">TERMINAL COMMANDS:</div>
                <div class="space-y-1">
                  <div
                    v-for="(cmd, idx) in project.commands"
                    :key="idx"
                    class="text-xs text-green-300 font-mono"
                  >
                    <span class="text-green-600">$</span> {{ cmd }}
                  </div>
                </div>
              </div>

              <!-- README Content (if available) -->
              <div v-if="project.readme" class="readme-content">
                <div class="text-xs text-green-600 mb-2 border-b border-green-800 pb-1">README:</div>
                <div class="markdown-content" v-html="renderMarkdown(project.readme)"></div>
              </div>

              <!-- Full Description (fallback if no README) -->
              <div v-else>
                <div class="text-xs text-green-600 mb-1">DESCRIPTION:</div>
                <p class="text-sm text-green-300 leading-relaxed">{{ project.description }}</p>
              </div>
              
              <!-- Repository Link -->
              <div v-if="project.url">
                <div class="text-xs text-green-600 mb-1">REPOSITORY:</div>
                <a 
                  :href="project.url" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1 text-sm"
                >
                  {{ project.url }} →
                </a>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    
    <div v-else class="text-center py-8 text-green-600">
      <p>No projects found matching your criteria.</p>
      <p class="text-sm mt-2">Try selecting different tags or clearing the filter.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import projects from '../data/projects.json'

// State
const selectedTags = ref([])
const expandedProjects = ref(new Set())

// All available tags from projects
const allTags = computed(() => {
  const tags = new Set()
  projects.forEach(project => {
    project.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
})

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
}

// Toggle expand/collapse
const toggleExpand = (projectName) => {
  if (expandedProjects.value.has(projectName)) {
    expandedProjects.value.delete(projectName)
  } else {
    expandedProjects.value.add(projectName)
  }
}

// Get short description (first sentence or first 100 chars)
const getShortDescription = (description) => {
  const firstSentence = description.split('.')[0]
  if (firstSentence.length <= 100) {
    return firstSentence + (description.includes('.') ? '.' : '')
  }
  return description.substring(0, 100) + '...'
}

// Filtered projects based on selected tags
const filteredProjects = computed(() => {
  if (selectedTags.value.length === 0) {
    return projects
  }
  return projects.filter(project =>
    selectedTags.value.some(tag => project.tags.includes(tag))
  )
})

// Markdown renderer - preserves exact formatting
const renderMarkdown = (markdown) => {
  if (!markdown || markdown === 'PLACEHOLDER_README_CONTENT') return ''
  
  let html = markdown
  const codeBlocks = []
  const inlineCodes = []
  
  // Store code blocks temporarily
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    const id = `__CODEBLOCK_${codeBlocks.length}__`
    codeBlocks.push(match)
    return id
  })
  
  // Store inline code temporarily
  html = html.replace(/`[^`]+`/g, (match) => {
    const id = `__INLINECODE_${inlineCodes.length}__`
    inlineCodes.push(match)
    return id
  })
  
  // Escape HTML to prevent XSS
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // Restore and format code blocks
  codeBlocks.forEach((block, idx) => {
    const placeholder = `__CODEBLOCK_${idx}__`
    const code = block.replace(/```/g, '').trim()
    const escaped = code
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
    html = html.replace(placeholder, `<pre class="bg-[#000] border border-green-700 rounded p-3 my-3 overflow-x-auto"><code class="text-green-300 text-xs font-mono whitespace-pre">${escaped}</code></pre>`)
  })
  
  // Restore and format inline code
  inlineCodes.forEach((code, idx) => {
    const placeholder = `__INLINECODE_${idx}__`
    const codeContent = code.replace(/`/g, '')
    const escaped = codeContent
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
    html = html.replace(placeholder, `<code class="bg-[#000] border border-green-800 px-1.5 py-0.5 rounded text-green-300 text-xs font-mono">${escaped}</code>`)
  })
  
  // Headers (process in order from most specific to least)
  html = html.replace(/^### (.*)$/gim, '<h3 class="text-green-200 text-base font-semibold mt-4 mb-2 border-b border-green-800 pb-1">$1</h3>')
  html = html.replace(/^## (.*)$/gim, '<h2 class="text-green-200 text-lg font-semibold mt-5 mb-3 border-b border-green-800 pb-2">$1</h2>')
  html = html.replace(/^# (.*)$/gim, '<h1 class="text-green-200 text-xl font-bold mt-6 mb-4 border-b border-green-700 pb-2">$1</h1>')
  
  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="border-green-800 my-4">')
  html = html.replace(/^\*\*\*$/gim, '<hr class="border-green-800 my-4">')
  
  // Checklists (before regular lists)
  html = html.replace(/^[\*\-] \[x\] (.+)$/gim, '<li class="text-green-300 text-sm ml-4 mb-1"><input type="checkbox" checked disabled class="mr-2">$1</li>')
  html = html.replace(/^[\*\-] \[ \] (.+)$/gim, '<li class="text-green-300 text-sm ml-4 mb-1"><input type="checkbox" disabled class="mr-2">$1</li>')
  
  // Unordered lists
  html = html.replace(/^[\*\-] (.+)$/gim, '<li class="text-green-300 text-sm ml-4 mb-1">$1</li>')
  
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gim, '<li class="text-green-300 text-sm ml-4 mb-1">$1</li>')
  
  // Wrap consecutive list items in ul/ol tags
  html = html.replace(/(<li[^>]*>.*?<\/li>\n?)+/g, (match) => {
    if (match.includes('checkbox')) {
      return `<ul class="list-none my-2 space-y-1">${match}</ul>`
    }
    return `<ul class="list-disc list-inside my-2 space-y-1">${match}</ul>`
  })
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
  
  // Bold (after links to avoid conflicts)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-200 font-semibold">$1</strong>')
  html = html.replace(/__(.*?)__/g, '<strong class="text-green-200 font-semibold">$1</strong>')
  
  // Italic (after bold to avoid conflicts)
  html = html.replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '<em class="text-green-300">$1</em>')
  html = html.replace(/(?<!_)_(?!_)([^_]+?)(?<!_)_(?!_)/g, '<em class="text-green-300">$1</em>')
  
  // Process paragraphs - split by double newlines and wrap non-HTML content
  const lines = html.split('\n')
  const processed = []
  let currentPara = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (!line) {
      if (currentPara.length > 0) {
        const paraText = currentPara.join(' ')
        if (paraText && !paraText.match(/^<[h|u|o|l|p|d|h|r]/)) {
          processed.push(`<p class="text-green-300 text-sm leading-relaxed mb-3">${paraText}</p>`)
        } else {
          processed.push(paraText)
        }
        currentPara = []
      }
      continue
    }
    
    if (line.match(/^<[h|u|o|l|p|d|h|r|pre]/)) {
      if (currentPara.length > 0) {
        const paraText = currentPara.join(' ')
        if (paraText && !paraText.match(/^<[h|u|o|l|p|d|h|r]/)) {
          processed.push(`<p class="text-green-300 text-sm leading-relaxed mb-3">${paraText}</p>`)
        } else {
          processed.push(paraText)
        }
        currentPara = []
      }
      processed.push(line)
    } else {
      currentPara.push(line)
    }
  }
  
  if (currentPara.length > 0) {
    const paraText = currentPara.join(' ')
    if (paraText && !paraText.match(/^<[h|u|o|l|p|d|h|r]/)) {
      processed.push(`<p class="text-green-300 text-sm leading-relaxed mb-3">${paraText}</p>`)
    } else {
      processed.push(paraText)
    }
  }
  
  html = processed.join('\n')
  
  // Preserve emojis
  html = html.replace(/&amp;#(\d+);/g, '&#$1;')
  
  return html
}
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

.project-card {
  position: relative;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.project-card:hover::before {
  opacity: 1;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.4s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 2000px;
  opacity: 1;
}

/* Markdown content styling */
.markdown-content {
  color: #86efac;
  font-size: 0.875rem;
  line-height: 1.6;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3 {
  color: #86efac;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.markdown-content p {
  margin-bottom: 0.75rem;
}

.markdown-content ul,
.markdown-content ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-content li {
  margin-bottom: 0.25rem;
}

.markdown-content code {
  background-color: #000;
  border: 1px solid #166534;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #86efac;
}

.markdown-content pre {
  background-color: #000;
  border: 1px solid #166534;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin: 0.75rem 0;
  overflow-x: auto;
}

.markdown-content pre code {
  border: none;
  padding: 0;
  background: transparent;
}

.markdown-content a {
  color: #60a5fa;
  text-decoration: underline;
}

.markdown-content a:hover {
  color: #93c5fd;
}

.markdown-content strong {
  color: #86efac;
  font-weight: 600;
}

.markdown-content em {
  color: #a7f3d0;
  font-style: italic;
}

.markdown-content hr {
  border-color: #166534;
  margin: 1rem 0;
}

/* Terminal commands styling */
.terminal-commands {
  font-family: 'Courier New', Courier, monospace;
  background: #000;
  border: 1px solid #166534;
  border-radius: 0.375rem;
  padding: 0.75rem;
}

.terminal-commands .text-green-600::before {
  content: '➜';
  margin-right: 0.5rem;
}

/* Scrollbar styling for long content */
.expanded-content::-webkit-scrollbar {
  width: 8px;
}

.expanded-content::-webkit-scrollbar-track {
  background: #0a0a0a;
  border-radius: 4px;
}

.expanded-content::-webkit-scrollbar-thumb {
  background: #166534;
  border-radius: 4px;
}

.expanded-content::-webkit-scrollbar-thumb:hover {
  background: #15803d;
}
</style>
