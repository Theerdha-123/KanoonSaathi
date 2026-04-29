import { useState, useEffect, useCallback, useRef } from 'react';
import { SPEECH_LANG } from '../data/languages';

export function useSpeech(lang = 'en') {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [micError, setMicError] = useState('');
  const [micPerm, setMicPerm] = useState('prompt');
  const recognitionRef = useRef(null);
  const onResultRef = useRef(null);

  const SpeechRecognition = typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  const hasStt = !!SpeechRecognition;
  const hasTts = !!synth;
  const supported = { stt: hasStt, tts: hasTts };

  // Check mic permission
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' }).then(result => {
        setMicPerm(result.state);
        result.onchange = () => setMicPerm(result.state);
      }).catch(() => {});
    }
  }, []);

  const startListening = useCallback((onResult) => {
    if (!SpeechRecognition) {
      setMicError('Voice input is not supported in this browser. Try using Google Chrome.');
      return;
    }
    if (micPerm === 'denied') {
      setMicError('Microphone access is blocked. Please enable it in browser settings (click the lock icon in the address bar).');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = SPEECH_LANG[lang] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      onResultRef.current = onResult;
      recognitionRef.current = recognition;

      recognition.onstart = () => { setListening(true); setTranscript(''); setMicError(''); };
      recognition.onend = () => { setListening(false); };
      recognition.onerror = (e) => {
        setListening(false);
        if (e.error === 'not-allowed') {
          setMicPerm('denied');
          setMicError('Microphone access denied. Please allow it in browser settings.');
        } else if (e.error === 'no-speech') {
          setMicError('No speech detected. Please try speaking clearly.');
        } else {
          setMicError(`Voice error: ${e.error}. Please try again.`);
        }
      };
      recognition.onresult = (event) => {
        let final = '';
        let interim = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setTranscript(final || interim);
        if (final && onResultRef.current) {
          onResultRef.current(final);
        }
      };
      recognition.start();
    } catch (err) {
      setMicError(`Could not start voice input: ${err.message}`);
    }
  }, [SpeechRecognition, lang, micPerm]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setListening(false);
    setTranscript('');
  }, []);

  const speak = useCallback((text) => {
    if (!synth) return;
    synth.cancel();
    const clean = text.replace(/[*#_~`]/g, '').replace(/\n{2,}/g, '. ');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = SPEECH_LANG[lang] || 'en-IN';
    utterance.rate = 0.92;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synth.speak(utterance);
  }, [synth, lang]);

  const stopSpeaking = useCallback(() => {
    if (synth) synth.cancel();
    setSpeaking(false);
  }, [synth]);

  const clearError = useCallback(() => setMicError(''), []);

  return {
    listening, speaking, transcript, micError, micPerm,
    hasStt, hasTts, supported,
    startListening, stopListening, speak, stopSpeaking, clearError,
  };
}
