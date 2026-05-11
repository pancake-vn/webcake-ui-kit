import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = 8000
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const storybookPath = path.join(
  __dirname,
  'storybook-vue3',
  'storybook-static'
)

app.use(express.static(storybookPath))

app.get('*', (_, res) => {
  res.sendFile(path.join(storybookPath, 'index.html'))
})

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`))