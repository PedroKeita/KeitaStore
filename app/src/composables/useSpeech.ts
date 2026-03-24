import { ref } from 'vue'

const isSpeaking = ref(false)
const isSupported = 'speechSynthesis' in window

export function useSpeech() {
  function speak(text: string) {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'
    utterance.onstart = () => (isSpeaking.value = true)
    utterance.onend = () => (isSpeaking.value = false)
    utterance.onerror = () => (isSpeaking.value = false)
    window.speechSynthesis.speak(utterance)
  }

  function stop() {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
  }

  return { speak, stop, isSpeaking, isSupported }
}