import {
  LIST_IGNORE,
  attrAccept,
  file2Obj,
  formatSize,
  genUid,
  getFileItem,
  isImageFileType,
  isImageUrl,
  removeFileItem,
  updateFileList
} from '../src/components/upload/upload-utils.js'

describe('upload-utils', () => {
  describe('genUid', () => {
    it('produces unique, prefixed ids', () => {
      const a = genUid()
      const b = genUid()
      expect(a).not.toBe(b)
      expect(a.startsWith('wk-upload-')).toBe(true)
    })
  })

  describe('attrAccept', () => {
    const png = { name: 'a.png', type: 'image/png' }
    const pdf = { name: 'doc.pdf', type: 'application/pdf' }

    it('allows everything when accept is empty', () => {
      expect(attrAccept(png, '')).toBe(true)
      expect(attrAccept(png, null)).toBe(true)
    })
    it('matches by extension', () => {
      expect(attrAccept(png, '.png')).toBe(true)
      expect(attrAccept(pdf, '.png')).toBe(false)
    })
    it('matches by wildcard mime', () => {
      expect(attrAccept(png, 'image/*')).toBe(true)
      expect(attrAccept(pdf, 'image/*')).toBe(false)
    })
    it('matches by exact mime', () => {
      expect(attrAccept(png, 'image/png')).toBe(true)
      expect(attrAccept(png, 'image/jpeg')).toBe(false)
    })
    it('accepts when any of a comma list matches', () => {
      expect(attrAccept(pdf, '.png,application/pdf')).toBe(true)
    })
  })

  describe('isImageFileType / isImageUrl', () => {
    it('detects image mime types', () => {
      expect(isImageFileType('image/png')).toBe(true)
      expect(isImageFileType('application/pdf')).toBe(false)
      expect(isImageFileType(undefined)).toBe(false)
    })
    it('detects image by mime or url extension', () => {
      expect(isImageUrl({ type: 'image/png' })).toBe(true)
      expect(isImageUrl({ type: '', url: 'https://x.test/pic.jpg' })).toBe(true)
      expect(isImageUrl({ type: '', url: 'https://x.test/file.pdf' })).toBe(false)
      expect(isImageUrl({ type: 'application/pdf' })).toBe(false)
    })
  })

  describe('formatSize', () => {
    it('formats byte scales', () => {
      expect(formatSize(0)).toBe('0 B')
      expect(formatSize(512)).toBe('512 B')
      expect(formatSize(25600)).toBe('25 KB')
      expect(formatSize(12582912)).toBe('12 MB')
    })
    it('returns empty for invalid input', () => {
      expect(formatSize(null)).toBe('')
      expect(formatSize(NaN)).toBe('')
    })
  })

  describe('file2Obj', () => {
    it('wraps a raw file into the normalized shape', () => {
      const raw = { name: 'a.png', size: 10, type: 'image/png' }
      const obj = file2Obj(raw, 'uid-1')
      expect(obj.uid).toBe('uid-1')
      expect(obj.name).toBe('a.png')
      expect(obj.status).toBe('uploading')
      expect(obj.percent).toBe(0)
      expect(obj.originFileObj).toBe(raw)
    })
  })

  describe('updateFileList / getFileItem / removeFileItem', () => {
    const list = [
      { uid: '1', name: 'a' },
      { uid: '2', name: 'b' }
    ]

    it('appends a new item immutably', () => {
      const next = updateFileList({ uid: '3', name: 'c' }, list)
      expect(next).toHaveLength(3)
      expect(list).toHaveLength(2) // original untouched
    })
    it('replaces an existing item by uid', () => {
      const next = updateFileList({ uid: '2', name: 'B!' }, list)
      expect(next).toHaveLength(2)
      expect(next[1].name).toBe('B!')
      expect(list[1].name).toBe('b') // original untouched
    })
    it('finds an item by uid', () => {
      expect(getFileItem({ uid: '2' }, list).name).toBe('b')
      expect(getFileItem({ uid: 'x' }, list)).toBeUndefined()
    })
    it('removes by uid, returns null when nothing removed', () => {
      expect(removeFileItem({ uid: '1' }, list)).toHaveLength(1)
      expect(removeFileItem({ uid: 'nope' }, list)).toBeNull()
    })
  })

  describe('LIST_IGNORE', () => {
    it('is a stable sentinel', () => {
      expect(typeof LIST_IGNORE).toBe('string')
      expect(LIST_IGNORE).toBe('WK_UPLOAD_LIST_IGNORE')
    })
  })
})
