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
          <!-- Honeypot field (hidden from users, visible to bots) -->
          <input
            type="text"
            v-model="honeypot"
            name="botcheck"
            style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;"
            tabindex="-1"
            autocomplete="off"
          />

          <input
            type="text"
            v-model="name"
            placeholder="➜ Who's reaching out?"
            :disabled="isLoading"
            required
            class="w-full bg-black border border-green-700 text-green-200 px-3 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <input
            type="email"
            v-model="email"
            placeholder="➜ Your email address (e.g. user@kernel.dev)"
            :disabled="isLoading"
            required
            class="w-full bg-black border border-green-700 text-green-200 px-3 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <textarea
            v-model="message"
            placeholder="➜ Type your message like it's a terminal..."
            rows="4"
            :disabled="isLoading"
            required
            class="w-full bg-black border border-green-700 text-green-200 px-3 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          ></textarea>

          <button
            type="submit"
            :disabled="isLoading || isRateLimited"
            class="w-full border border-green-600 px-4 py-2 hover:bg-green-700 hover:text-white rounded transition-all hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none"
          >
            <span v-if="isLoading">⏳ Sending...</span>
            <span v-else-if="isRateLimited">⏸️ Please wait before sending again</span>
            <span v-else>📨 Send Message</span>
          </button>

          <!-- Terminal-style status output -->
          <div v-if="statusMessage" class="bg-black border border-green-800 rounded p-3 font-mono text-sm">
            <div class="flex items-center space-x-2">
              <span class="text-green-400">$</span>
              <span :class="statusMessageType === 'success' ? 'text-green-400' : statusMessageType === 'error' ? 'text-red-400' : 'text-yellow-400'">
                {{ statusMessage }}
              </span>
              <span v-if="isLoading" class="blinking-cursor text-green-400">▊</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// ⚠️ IMPORTANT: Replace this with your Web3Forms access key
// Get your free access key from: https://web3forms.com
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY_HERE'

const name = ref('')
const email = ref('')
const message = ref('')
const honeypot = ref('')
const isLoading = ref(false)
const statusMessage = ref('')
const statusMessageType = ref('') // 'success', 'error', 'loading'
const isRateLimited = ref(false)
const copied = ref({
  email: false,
  linkedin: false,
  medium: false
})

// Rate limiting: 30 seconds cooldown between submissions
const RATE_LIMIT_COOLDOWN = 30000 // 30 seconds
const RATE_LIMIT_KEY = 'contact_form_last_submit'

onMounted(() => {
  checkRateLimit()
})

const checkRateLimit = () => {
  const lastSubmit = localStorage.getItem(RATE_LIMIT_KEY)
  if (lastSubmit) {
    const timeSinceLastSubmit = Date.now() - parseInt(lastSubmit)
    if (timeSinceLastSubmit < RATE_LIMIT_COOLDOWN) {
      isRateLimited.value = true
      const remainingTime = Math.ceil((RATE_LIMIT_COOLDOWN - timeSinceLastSubmit) / 1000)
      statusMessage.value = `error: rate limited. please wait ${remainingTime}s`
      statusMessageType.value = 'error'
      
      // Update countdown
      const interval = setInterval(() => {
        const timeLeft = Math.ceil((RATE_LIMIT_COOLDOWN - (Date.now() - parseInt(lastSubmit))) / 1000)
        if (timeLeft > 0) {
          statusMessage.value = `error: rate limited. please wait ${timeLeft}s`
        } else {
          isRateLimited.value = false
          statusMessage.value = ''
          clearInterval(interval)
        }
      }, 1000)
      
      setTimeout(() => {
        isRateLimited.value = false
        statusMessage.value = ''
        clearInterval(interval)
      }, RATE_LIMIT_COOLDOWN - timeSinceLastSubmit)
    }
  }
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

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

const submitForm = async () => {
  // Clear previous status
  statusMessage.value = ''
  statusMessageType.value = ''

  // Check rate limiting
  if (isRateLimited.value) {
    return
  }

  // Validate inputs
  if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
    statusMessage.value = 'error: all fields are required'
    statusMessageType.value = 'error'
    return
  }

  // Validate email format
  if (!validateEmail(email.value)) {
    statusMessage.value = 'error: invalid email format'
    statusMessageType.value = 'error'
    return
  }

  // Check honeypot (if filled, it's likely a bot)
  if (honeypot.value) {
    // Silently fail for bots
    statusMessage.value = 'error: failed to send message'
    statusMessageType.value = 'error'
    return
  }

  // Check if access key is configured
  if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
    statusMessage.value = 'error: web3forms access key not configured'
    statusMessageType.value = 'error'
    console.error('⚠️ Web3Forms access key not configured! Please set WEB3FORMS_ACCESS_KEY in Contact.vue')
    return
  }

  // Set loading state
  isLoading.value = true
  statusMessage.value = 'sending message...'
  statusMessageType.value = 'loading'

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name: name.value.trim(),
        email: email.value.trim(),
        message: message.value.trim(),
        subject: `Contact Form Submission from ${name.value.trim()}`,
        from_name: name.value.trim()
      })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      // Success - animate with delay like console printing
      await new Promise(resolve => setTimeout(resolve, 500))
      statusMessage.value = 'message sent successfully ✓'
      statusMessageType.value = 'success'
      
      // Clear form
      name.value = ''
      email.value = ''
      message.value = ''
      honeypot.value = ''

      // Set rate limit
      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString())
      isRateLimited.value = true
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        statusMessage.value = ''
        statusMessageType.value = ''
      }, 5000)

      // Reset rate limit after cooldown
      setTimeout(() => {
        isRateLimited.value = false
      }, RATE_LIMIT_COOLDOWN)
    } else {
      // API returned error
      throw new Error(data.message || 'Failed to send message')
    }
  } catch (error) {
    // Network or other errors
    console.error('Form submission error:', error)
    statusMessage.value = `error: failed to send message`
    statusMessageType.value = 'error'
  } finally {
    isLoading.value = false
  }
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

/* Blinking cursor animation for terminal effect */
@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.blinking-cursor {
  animation: blink 1s infinite;
  font-weight: bold;
}

/* Terminal-style status message animation */
.status-message {
  animation: typewriter 0.3s ease-in-out;
}

@keyframes typewriter {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
