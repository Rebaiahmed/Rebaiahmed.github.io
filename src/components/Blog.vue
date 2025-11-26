<template>
  <section id="blogs" class="p-6 text-green-400 bg-black font-mono min-h-screen">
    <h2 class="text-2xl font-bold border-b border-green-600 mb-4">📚 Blog Posts</h2>

    <div class="mb-4 space-x-2">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="selectedTag = tag"
        class="px-2 py-1 border border-green-600 rounded hover:bg-green-600 hover:text-white"
        :class="{ 'bg-green-700 text-white': selectedTag === tag }"
      >
        {{ tag }}
      </button>
      <button
        @click="selectedTag = ''"
        class="px-2 py-1 border border-green-800 rounded text-sm"
      >
        Clear
      </button>
    </div>

    <ul class="space-y-4">
      <li
        v-for="post in filteredBlogs"
        :key="post.title"
        class="border border-green-800 p-4 rounded bg-[#101010]"
      >
        <h3 class="text-green-200 text-lg font-semibold">{{ post.title }}</h3>
        <p class="text-sm italic mb-1">🕒 {{ post.published }}</p>
        <div class="mb-2 space-x-1">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="text-xs border px-2 py-1 border-green-700 rounded"
          >
            {{ tag }}
          </span>
        </div>
        <a :href="post.url" target="_blank" class="text-blue-400 underline">Read more →</a>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import blogs from '../data/blogs.json'

const selectedTag = ref('')
const allTags = [...new Set(blogs.flatMap(post => post.tags))]

// Parse date string to Date object for sorting
const parseDate = (dateStr) => {
  // Handle different date formats
  if (dateStr.includes('May 2025')) return new Date('2025-05-01')
  if (dateStr.includes('2024')) {
    // Format: "Nov 17, 2024" or "May 6, 2024"
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
  // Fallback for unknown formats
  return new Date(0)
}

const filteredBlogs = computed(() => {
  const filtered = selectedTag.value
    ? blogs.filter(post => post.tags.includes(selectedTag.value))
    : blogs
  
  // Sort by date (newest first)
  return [...filtered].sort((a, b) => {
    const dateA = parseDate(a.published)
    const dateB = parseDate(b.published)
    return dateB - dateA
  })
})
</script>