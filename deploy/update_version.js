import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// Get the current file URL
const __filename = fileURLToPath(import.meta.url)

// Get the current directory path
const __dirname = path.dirname(__filename)

// Define the root path
const ROOT_PATH = path.join(__dirname, '..')

const PATCH_VERSION_PATH = `${ROOT_PATH}/.patch-version`
const PACKAGE_JSON_PATH = `${ROOT_PATH}/package.json`
const MANIFEST_JSON_PATH = `${ROOT_PATH}/manifest.json`

// This patch value is used to override the one from package.json
const currentPatch = fs.existsSync(PATCH_VERSION_PATH)
  ? Number(fs.readFileSync(PATCH_VERSION_PATH, 'utf-8'))
  : -1
const packageJsonContent = fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8')
const currentVersion = JSON.parse(packageJsonContent).version
const [major, minor] = currentVersion.split('.')

const newPatch = currentPatch + 1
const newVersion = [major, minor, newPatch].join('.')
const newPackageJsonContent = packageJsonContent.replace(
  `"version": "${currentVersion}"`,
  `"version": "${newVersion}"`
)

const manifestJsonContent = fs.readFileSync(MANIFEST_JSON_PATH, 'utf-8')
const currentVersionManifest = JSON.parse(manifestJsonContent).version
const [majorManifest, minorManifest] = currentVersionManifest.split('.')

const newPatchManifest = currentPatch + 1
const newVersionManifest = [majorManifest, minorManifest, newPatchManifest].join('.')
const newManifestJsonContent = manifestJsonContent.replace(
  `"version": "${currentVersionManifest}"`,
  `"version": "${newVersionManifest}"`
)

fs.writeFileSync(PATCH_VERSION_PATH, String(newPatch), 'utf-8')
fs.writeFileSync(MANIFEST_JSON_PATH, String(newPatch), 'utf-8')
fs.writeFileSync(PACKAGE_JSON_PATH, newPackageJsonContent, 'utf-8')
fs.writeFileSync(MANIFEST_JSON_PATH, newManifestJsonContent, 'utf-8')
