import { vi } from 'vitest'
import { nextTick } from 'vue'
import { wkMessage } from '../src/index.js'

// Disable all CSS transitions and animations in jsdom so Vue removes elements synchronously
const style = document.createElement('style')
style.textContent = '* { transition: none !important; animation: none !important; }'
document.head.appendChild(style)

// The service mounts a singleton container to document.body on first use.
// Keep the container alive between tests; just clear messages in afterEach.
beforeEach(() => {
  // Make all messages sticky (no auto-removal) so timers don't fire mid-test.
  wkMessage.config({ duration: 0, maxCount: 0, placement: 'top', offset: 24 })
})

afterEach(async () => {
  wkMessage.destroyAll()
  await nextTick()
})

describe('wkMessage', () => {
  it('mounts container to document.body on first call', async () => {
    wkMessage.info('Hello')
    await nextTick()
    // Vue3: app.mount() renders INTO hostEl (host stays in DOM).
    // Vue2: $mount() replaces hostEl with the component root — host is gone.
    // Both versions render .ui-message-container into the body, so check that.
    expect(document.querySelector('.ui-message-container')).not.toBeNull()
  })

  it('success() shows a success message', async () => {
    wkMessage.success('Event has been created')
    await nextTick()
    const el = document.querySelector('.ui-message--success')
    expect(el).not.toBeNull()
    expect(el.textContent).toContain('Event has been created')
  })

  it('error() shows an error message', async () => {
    wkMessage.error('Something went wrong')
    await nextTick()
    const el = document.querySelector('.ui-message--error')
    expect(el).not.toBeNull()
    expect(el.textContent).toContain('Something went wrong')
  })

  it('info() shows an info message', async () => {
    wkMessage.info('Heads up — this is an info message')
    await nextTick()
    expect(document.querySelector('.ui-message--info')).not.toBeNull()
  })

  it('warning() shows a warning message', async () => {
    wkMessage.warning('Please double-check your input')
    await nextTick()
    expect(document.querySelector('.ui-message--warning')).not.toBeNull()
  })

  it('loading() shows a loading message with spinner', async () => {
    wkMessage.loading('Uploading...')
    await nextTick()
    expect(document.querySelector('.ui-message--loading')).not.toBeNull()
    expect(document.querySelector('.ui-spinner')).not.toBeNull()
  })

  it('returns a close function that removes the message', async () => {
    const close = wkMessage.info('Dismiss me')
    await nextTick()
    expect(document.querySelector('.ui-message--info')).not.toBeNull()
    close()
    await nextTick()
    expect(document.querySelector('.ui-message--info')).toBeNull()
  })

  it('open() with key replaces an existing message (loading → success)', async () => {
    const KEY = 'upload-op'
    wkMessage.open({ content: 'Uploading...', type: 'loading', key: KEY, duration: 0 })
    await nextTick()
    expect(document.querySelector('.ui-message--loading')).not.toBeNull()

    wkMessage.open({ content: 'Uploaded!', type: 'success', key: KEY, duration: 0 })
    await nextTick()
    expect(document.querySelectorAll('.ui-message').length).toBe(1)
    expect(document.querySelector('.ui-message--success')).not.toBeNull()
    expect(document.querySelector('.ui-message--loading')).toBeNull()
    expect(document.querySelector('.ui-message').textContent).toContain('Uploaded!')
  })

  it('destroy(key) removes a specific message and leaves others', async () => {
    wkMessage.open({ content: 'Keep this', type: 'info', key: 'keep', duration: 0 })
    wkMessage.open({ content: 'Remove this', type: 'success', key: 'remove', duration: 0 })
    await nextTick()
    expect(document.querySelectorAll('.ui-message').length).toBe(2)

    wkMessage.destroy('remove')
    await nextTick()
    expect(document.querySelectorAll('.ui-message').length).toBe(1)
    expect(document.querySelector('.ui-message').textContent).toContain('Keep this')
  })

  it('destroy() with no args removes all messages', async () => {
    wkMessage.success('One')
    wkMessage.error('Two')
    wkMessage.info('Three')
    await nextTick()
    expect(document.querySelectorAll('.ui-message').length).toBe(3)

    wkMessage.destroy()
    await nextTick()
    expect(document.querySelectorAll('.ui-message').length).toBe(0)
  })

  it('destroyAll() removes all messages', async () => {
    wkMessage.success('A')
    wkMessage.error('B')
    await nextTick()
    expect(document.querySelectorAll('.ui-message').length).toBe(2)

    wkMessage.destroyAll()
    await nextTick()
    expect(document.querySelectorAll('.ui-message').length).toBe(0)
  })

  it('config({ maxCount }) evicts oldest messages when limit is exceeded', async () => {
    wkMessage.config({ maxCount: 3 })
    for (let i = 1; i <= 6; i++) {
      wkMessage.info('Message #' + i)
    }
    await nextTick()
    expect(document.querySelectorAll('.ui-message').length).toBe(3)
  })

  it('success() with description object shows description text', async () => {
    wkMessage.success({
      content: 'Event has been created',
      description: 'Sunday, December 03, 2023 at 9:00 AM'
    })
    await nextTick()
    const desc = document.querySelector('.ui-message__description')
    expect(desc).not.toBeNull()
    expect(desc.textContent).toContain('Sunday, December 03, 2023')
  })

  it('onClose callback fires when message is removed', async () => {
    const onClose = vi.fn()
    wkMessage.open({ content: 'Bye', type: 'info', duration: 0, onClose })
    await nextTick()

    wkMessage.destroyAll()
    await nextTick()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('auto-removes message after duration elapses', async () => {
    vi.useFakeTimers()
    wkMessage.open({ content: 'Flash', type: 'info', duration: 2500 })
    await nextTick()
    expect(document.querySelector('.ui-message--info')).not.toBeNull()

    vi.advanceTimersByTime(2500)
    await nextTick()
    expect(document.querySelector('.ui-message--info')).toBeNull()
    vi.useRealTimers()
  })

  it('config({ placement }) updates the container placement class', async () => {
    wkMessage.config({ placement: 'bottom-left' })
    wkMessage.info('Anchored bottom')
    await nextTick()
    const container = document.querySelector('.ui-message-container')
    expect(container.classList.contains('ui-message-container--bottom-left')).toBe(true)
  })

  it('multiple messages stack independently', async () => {
    wkMessage.success('Saved')
    wkMessage.error('Failed')
    wkMessage.info('Note')
    await nextTick()
    const messages = document.querySelectorAll('.ui-message')
    expect(messages.length).toBe(3)
  })

  it('open() with progress renders a progress bar at the given value', async () => {
    wkMessage.open({ type: 'loading', content: 'Uploading...', progress: 40, duration: 0 })
    await nextTick()
    const bar = document.querySelector('.ui-progress__bar')
    expect(bar).not.toBeNull()
    expect(bar.style.width).toBe('40%')
  })

  it('open() with same key updates progress value reactively', async () => {
    const KEY = 'prog-update'
    wkMessage.open({ key: KEY, type: 'loading', content: 'Uploading...', progress: 20, duration: 0 })
    await nextTick()
    expect(document.querySelector('.ui-progress__bar').style.width).toBe('20%')

    wkMessage.open({ key: KEY, type: 'loading', content: 'Uploading...', progress: 80, duration: 0 })
    await nextTick()
    expect(document.querySelectorAll('.ui-message').length).toBe(1)
    expect(document.querySelector('.ui-progress__bar').style.width).toBe('80%')
  })

  it('open() without progress shows no progress bar', async () => {
    wkMessage.info('No bar here')
    await nextTick()
    expect(document.querySelector('.ui-progress')).toBeNull()
  })
})
