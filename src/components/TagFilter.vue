<template>
  <div class="tag-filter-container p-4">
    <h2 class="text-xl font-bold mb-2">🔍 Filter by Tag</h2>
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="tag in availableTags"
        :key="tag"
        :class="['px-3 py-1 rounded-full text-sm', tag === selectedTag ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700']"
        @click="filterByTag(tag)"
      >
        {{ tag }}
      </button>
      <button
        v-if="selectedTag"
        class="ml-2 px-3 py-1 text-sm rounded-full bg-red-500 text-white"
        @click="clearFilter"
      >
        Clear
      </button>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2">Projects:</h3>
      <ul>
        <li
          v-for="project in filteredProjects"
          :key="project.name"
          class="mb-4 p-4 border border-gray-600 rounded bg-white dark:bg-gray-800 dark:text-white"
        >
          <strong>{{ project.name }}</strong>
          <p>{{ project.description }}</p>
          <a :href="project.url" class="text-blue-500 underline" target="_blank">View Repo</a>
          <div class="mt-2 text-xs">
            Tags:
            <span
              v-for="t in project.tags"
              :key="t"
              class="mr-1 bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded"
            >
              {{ t }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import projects from '../data/projects.json';

const selectedTag = ref(null);
const availableTags = [...new Set(projects.flatMap(p => p.tags))];

const filterByTag = tag => {
  selectedTag.value = tag;
};

const clearFilter = () => {
  selectedTag.value = null;
};

const filteredProjects = computed(() => {
  return selectedTag.value
    ? projects.filter(p => p.tags.includes(selectedTag.value))
    : projects;
});
</script>

<style scoped>
.tag-filter-container {
  background: #f9f9f9;
  border-radius: 8px;
}
.dark .tag-filter-container {
  background: #1e1e1e;
}
</style>