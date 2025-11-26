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
            <div class="p-4 space-y-3">
              <!-- Full Description -->
              <div>
                <div class="text-xs text-green-600 mb-1">DESCRIPTION:</div>
                <p class="text-sm text-green-300 leading-relaxed">{{ project.description }}</p>
              </div>
              
              <!-- Repository Link -->
              <div>
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
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
