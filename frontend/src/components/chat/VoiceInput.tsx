"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, StopCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  isListening: boolean
  setIsListening: (isListening: boolean) => void
}

export function VoiceInput({ onTranscript, isListening, setIsListening }: VoiceInputProps) {
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)
  const [volume, setVolume] = useState(0)
  const animationRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneStreamRef = useRef<MediaStream | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"
        
        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex
          const result = event.results[current]
          const transcriptText = result[0].transcript
          
          setTranscript(transcriptText)
          
          // Reset silence timeout when we get new speech
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current)
          }
          
          if (result.isFinal) {
            // Set a timeout to stop listening after 1.5 seconds of silence
            silenceTimeoutRef.current = setTimeout(() => {
              onTranscript(transcriptText)
              setIsListening(false)
            }, 1500)
          }
        }
        
        recognitionRef.current.onerror = (event: any) => {
          let errorMessage = "Error: "
          switch (event.error) {
            case 'network':
              errorMessage += "Network error occurred"
              break
            case 'not-allowed':
              errorMessage += "Microphone access denied"
              break
            case 'no-speech':
              errorMessage += "No speech detected"
              break
            default:
              errorMessage += event.error
          }
          setError(errorMessage)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          // Attempt to restart if we're still supposed to be listening
          if (isListening) {
            try {
              recognitionRef.current.start()
            } catch (e) {
              // Ignore errors from trying to start when already started
            }
          }
        }
      } else {
        setIsSupported(false)
        setError("Speech recognition is not supported in your browser")
      }
    }
    
    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore errors from stopping when already stopped
        }
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [onTranscript, setIsListening, isListening])

  // Setup audio visualization
  const setupAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      microphoneStreamRef.current = stream
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      
      const updateVolume = () => {
        if (!analyserRef.current || !isListening) return
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(dataArray)
        
        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length
        setVolume(average / 128)
        
        animationRef.current = requestAnimationFrame(updateVolume)
      }
      
      updateVolume()
    } catch (err) {
      console.error("Error accessing microphone:", err)
      setError("Could not access microphone")
      setIsListening(false)
    }
  }

  // Handle start/stop listening
  useEffect(() => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
          setupAudioVisualization()
          setTranscript("")
          setError(null)
        } catch (e) {
          // Ignore errors from trying to start when already started
        }
      }
    } else {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore errors from stopping when already stopped
        }
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [isListening])

  const handleStopListening = () => {
    if (transcript.trim()) {
      onTranscript(transcript.trim())
    }
    setIsListening(false)
  }

  if (!isSupported) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-gray-400 cursor-not-allowed" 
        disabled
        title="Voice input not supported in this browser"
      >
        <MicOff className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant={isListening ? "destructive" : "ghost"}
        size="icon"
        onClick={() => setIsListening(!isListening)}
        className={`rounded-full transition-all ${isListening ? 'bg-red-600 hover:bg-red-700' : ''}`}
        aria-label={isListening ? "Stop recording" : "Start recording"}
        title={isListening ? "Stop recording" : "Start voice input"}
      >
        {isListening ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
      
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 min-w-[250px] z-50"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center space-x-1 h-8 mb-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-red-600 rounded-full"
                    animate={{
                      height: volume > 0 ? `${20 + Math.random() * 20 * volume}px` : "4px"
                    }}
                    transition={{
                      duration: 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
              <div className="max-h-20 overflow-y-auto w-full">
                <p className="text-sm text-gray-700 dark:text-gray-300 text-center break-words">
                  {transcript || "Listening..."}
                </p>
              </div>
              {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2 text-xs"
                onClick={handleStopListening}
              >
                Done
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 