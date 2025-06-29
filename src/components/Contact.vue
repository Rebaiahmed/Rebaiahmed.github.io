<template>
  <section
    id="contact"
    class="bg-black text-green-400 font-mono min-h-screen flex flex-col items-center justify-center p-6"
  >
    <h2 class="text-2xl font-bold mb-6 border-b border-green-600 w-full max-w-md text-left">
      📬 Contact
    </h2>

    <form @submit.prevent="submitForm" class="space-y-4 w-full max-w-md">
      <input
        type="text"
        v-model="name"
        placeholder="➜ Who’s reaching out?"
        class="w-full bg-black border border-green-700 text-green-200 px-3 py-2 rounded focus:ring focus:ring-green-500"
      />

      <input
        type="email"
        v-model="email"
        placeholder="➜ Your email address (e.g. user@kernel.dev)"
        class="w-full bg-black border border-green-700 text-green-200 px-3 py-2 rounded focus:ring focus:ring-green-500"
      />

      <textarea
        v-model="message"
        placeholder="➜ Type your message like it's a terminal..."
        rows="4"
        class="w-full bg-black border border-green-700 text-green-200 px-3 py-2 rounded focus:ring focus:ring-green-500"
      ></textarea>

      <button
        type="submit"
        class="border border-green-600 px-4 py-2 hover:bg-green-700 hover:text-white rounded transition"
      >
        📨 Send
      </button>

      <p v-if="submitted" class="text-green-400 mt-2">✅ Message sent successfully.</p>
      <p v-if="error" class="text-red-400 mt-2">❌ Please fill in all fields correctly.</p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')
const submitted = ref(false)
const error = ref(false)

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
