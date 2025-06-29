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
const filteredBlogs = computed(() =>
  selectedTag.value
    ? blogs.filter(post => post.tags.includes(selectedTag.value))
    : blogs
)
</script>