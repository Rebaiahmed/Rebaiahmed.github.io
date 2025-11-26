<template>
  <section
    id="contact"
    class="bg-black text-green-400 font-mono min-h-screen flex flex-col items-center justify-center p-6"
  >
    <div class="w-full max-w-2xl space-y-8">
      <!-- Header -->
      <h2 class="text-2xl font-bold mb-8 border-b border-green-600 text-center">
        📬 Contact
      </h2>

      <!-- Social Links - Terminal Style -->
      <div class="bg-[#0a0a0a] border border-green-800 rounded-lg p-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
        <div class="mb-4 text-green-500 text-sm">➜ Available contact methods:</div>
        
        <div class="space-y-3 font-mono">
          <!-- Email -->
          <div class="group flex items-center justify-between hover:bg-[#111] p-2 rounded transition-all">
            <div class="flex items-center space-x-3">
              <span class="text-green-600">📧</span>
              <span class="text-green-400">$</span>
              <span class="text-green-300">contact</span>
              <span class="text-green-500">--email</span>
              <span class="text-green-400">→</span>
              <a 
                href="mailto:rebai.ahmed@outlook.com" 
                class="text-green-200 hover:text-green-100 hover:underline transition-colors"
              >
                rebai.ahmed@outlook.com
              </a>
            </div>
            <button
              @click="copyToClipboard('rebai.ahmed@outlook.com', 'email')"
              class="opacity-0 group-hover:opacity-100 transition-opacity text-green-500 hover:text-green-300 ml-4"
              :title="copied.email ? 'Copied!' : 'Copy email'"
            >
              {{ copied.email ? '✓' : '📋' }}
            </button>
          </div>

          <!-- LinkedIn -->
          <div class="group flex items-center justify-between hover:bg-[#111] p-2 rounded transition-all">
            <div class="flex items-center space-x-3">
              <span class="text-green-600">💼</span>
              <span class="text-green-400">$</span>
              <span class="text-green-300">contact</span>
              <span class="text-green-500">--linkedin</span>
              <span class="text-green-400">→</span>
              <a 
                href="https://www.linkedin.com/in/rebaiahmed/" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-green-200 hover:text-green-100 hover:underline transition-colors"
              >
                linkedin.com/in/rebaiahmed
              </a>
            </div>
            <button
              @click="copyToClipboard('https://www.linkedin.com/in/rebaiahmed/', 'linkedin')"
              class="opacity-0 group-hover:opacity-100 transition-opacity text-green-500 hover:text-green-300 ml-4"
              :title="copied.linkedin ? 'Copied!' : 'Copy link'"
            >
              {{ copied.linkedin ? '✓' : '📋' }}
            </button>
          </div>

          <!-- Medium -->
          <div class="group flex items-center justify-between hover:bg-[#111] p-2 rounded transition-all">
            <div class="flex items-center space-x-3">
              <span class="text-green-600">✍️</span>
              <span class="text-green-400">$</span>
              <span class="text-green-300">contact</span>
              <span class="text-green-500">--medium</span>
              <span class="text-green-400">→</span>
              <a 
                href="https://medium.com/@ahmedrebai" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-green-200 hover:text-green-100 hover:underline transition-colors"
              >
                medium.com/@ahmedrebai
              </a>
            </div>
            <button
              @click="copyToClipboard('https://medium.com/@ahmedrebai', 'medium')"
              class="opacity-0 group-hover:opacity-100 transition-opacity text-green-500 hover:text-green-300 ml-4"
              :title="copied.medium ? 'Copied!' : 'Copy link'"
            >
              {{ copied.medium ? '✓' : '📋' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="bg-[#0a0a0a] border border-green-800 rounded-lg p-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
        <div class="mb-4 text-green-500 text-sm">➜ Send a message:</div>
        
        <form @submit.prevent="submitForm" class="space-y-4">
          <input
            type="text"
            v-model="name"
            placeholder="➜ Who's reaching out?"
            class="w-full bg-black border border-green-700 text-green-200 px-3 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
          />

          <input
            type="email"
            v-model="email"
            placeholder="➜ Your email address (e.g. user@kernel.dev)"
            class="w-full bg-black border border-green-700 text-green-200 px-3 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
          />

          <textarea
            v-model="message"
            placeholder="➜ Type your message like it's a terminal..."
            rows="4"
            class="w-full bg-black border border-green-700 text-green-200 px-3 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
          ></textarea>

          <button
            type="submit"
            class="w-full border border-green-600 px-4 py-2 hover:bg-green-700 hover:text-white rounded transition-all hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] font-semibold"
          >
            📨 Send Message
          </button>

          <div v-if="submitted" class="text-green-400 text-sm text-center">
            ✅ Message sent successfully.
          </div>
          <div v-if="error" class="text-red-400 text-sm text-center">
            ❌ Please fill in all fields correctly.
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')
const submitted = ref(false)
const error = ref(false)
const copied = ref({
  email: false,
  linkedin: false,
  medium: false
})

const copyToClipboard = async (text, type) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value[type] = true
    setTimeout(() => {
      copied.value[type] = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const submitForm = () => {
  if (!name.value || !email.value || !message.value) {
    error.value = true
    submitted.value = false
    return
  }

  submitted.value = true
  error.value = false
  name.value = ''
  email.value = ''
  message.value = ''
}
</script>

<style scoped>
/* Subtle neon glow effect */
section {
  text-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
}

/* Smooth transitions for terminal-style elements */
.group {
  transition: all 0.2s ease;
}

/* Ensure monospace font consistency */
.font-mono {
  font-family: 'Courier New', Courier, monospace;
}
</style>
