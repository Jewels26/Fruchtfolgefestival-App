import { useState, useEffect, useRef } from 'react'
import { fetchAnnouncements, POLL_INTERVAL } from '../utils/announcements'
import { loadSeenSet, saveSeenSet } from '../utils/persistedSet'
import { PatrickContext } from './patrickContextCore'

const ANNOUNCEMENTS_STORAGE_KEY = 'announcements'

export function PatrickProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [externalMessage, setExternalMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [announcementsLoading, setAnnouncementsLoading] = useState(true)
  const seenPatrickIds = useRef(loadSeenSet(ANNOUNCEMENTS_STORAGE_KEY))

  function triggerPatrick(message) {
    setExternalMessage(message)
    setNotification({ text: message })
  }

  function clearExternalMessage() {
    setExternalMessage(null)
  }

  function clearNotification() {
    setNotification(null)
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      const data = await fetchAnnouncements()
      if (cancelled) return
      setAnnouncements(data)
      setAnnouncementsLoading(false)
      for (const ann of data) {
        if (ann.patrick && !seenPatrickIds.current.has(ann.id)) {
          seenPatrickIds.current.add(ann.id)
          saveSeenSet(ANNOUNCEMENTS_STORAGE_KEY, seenPatrickIds.current)
          triggerPatrick(ann.patrick)
        }
      }
    }

    load()
    const interval = setInterval(load, POLL_INTERVAL)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return (
    <PatrickContext.Provider value={{ open, setOpen, externalMessage, clearExternalMessage, triggerPatrick, notification, clearNotification, announcements, announcementsLoading }}>
      {children}
    </PatrickContext.Provider>
  )
}
