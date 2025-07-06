Here’s a step‑by‑step roadmap to build your offline‑first, cross‑device Notes/TODO app using Expo + SQLite + Supabase. No code—just the sequence and key considerations so you can tackle each phase yourself.

---
Created app by doing the following:
```bash
npx create-expo-app AaronNote
cd AaronNote
npm run reset-project
npx expo start
```

## 🏗️ Phase 0: Prerequisites & Planning

1. **Install Tooling**

   * Node.js & npm/yarn
   * Expo CLI (`npm install -g expo-cli`)
   * A Supabase account
   * (Optional) VS Code with relevant React/TypeScript plugins

2. **Define Core Features**

   * Create/Edit/Delete text notes and TODOs
   * Attach images & documents
   * Local persistence & offline editing on mobile
   * Automatic two‑way sync with Supabase when online
   * Web access (via Expo Web) reading/updating same data
   * No authentication initially

3. **Sketch Your Data Model**

   * **notes** table: `id (uuid), title, content, attachments[], updated_at, dirty_flag`
   * **attachments** bucket: Supabase Storage → store files; metadata linked in notes

---

## 🚀 Phase 1: Backend Setup (Supabase)

1. **Create a Supabase Project**

   * Enable Database (PostgreSQL)
   * Enable Storage (for attachments)

2. **Define Tables (SQL Editor)**

   * `notes` table schema as above
   * Optionally a separate `attachments` table (to track metadata: `id, note_id, url, filename, mime_type`)

3. **Configure Storage Bucket**

   * Create a bucket (e.g. `notes-attachments`)
   * Set public/read policies (or private if you’ll add auth later)

4. **Test with Supabase Studio**

   * Insert a sample note row
   * Upload a file to Storage → get URL
   * Verify you can read/write via REST API (you’ll use the JS client)

---

## 📱 Phase 2: Mobile App Setup (Expo Project)

1. **Initialize Expo**

   ```bash
   expo init notes-app
   cd notes-app
   ```

2. **Install Dependencies**

   * `expo-sqlite` (local DB)
   * `@react-native-community/netinfo` (connectivity)
   * `expo-image-picker` & `expo-document-picker`
   * Supabase JS client (`@supabase/supabase-js`)
   * State management: e.g. **Zustand** or Context API
   * Data‑fetching: **TanStack Query** (React Query)

3. **Set Up Local SQLite**

   * Create/open a database on app launch
   * Execute DDL to create `notes` table with a `dirty_flag` boolean

4. **Organize Code Structure**

   * `/src/screens`: NoteList, NoteEditor, AttachmentViewer
   * `/src/components`: NoteItem, AttachmentItem, SyncStatus
   * `/src/db`: local DB setup & helper functions
   * `/src/services`: Supabase client, file‐upload helpers
   * `/src/hooks`: useNotes (local cache + sync), useConnectivity

---

## 🔍 Phase 3: Local CRUD & UI

1. **Build Note List Screen**

   * Query all notes from SQLite
   * Display title, snippet, “dirty” indicator

2. **Build Note Editor Screen**

   * Form for title + content + attach buttons
   * On save:

     * Insert/update in SQLite, set `dirty_flag = true`, update `updated_at = now()`
     * Show immediate UI feedback

3. **Attachment Handling**

   * On mobile: use `expo-image-picker` / `expo-document-picker` to pick media
   * Save local URI & metadata in SQLite (or in-memory until sync)
   * Preview attachments in editor & list

---

## 🔄 Phase 4: Sync Logic & Hooks

1. **Connectivity Detection** (`useConnectivity`)

   * Subscribe to NetInfo
   * Expose `isOnline` boolean

2. **Sync Hook** (`useSync`)

   * Trigger on:

     * App resume / focus
     * Connectivity change from offline → online
     * Manual “Sync Now” button (optional)
   * **Push** dirty notes:

     * Read `notes WHERE dirty_flag = true` from SQLite
     * For each:

       * Upload attachments to Supabase Storage → get URL(s)
       * Upsert note row via Supabase JS client (Postgres)
       * On success: clear `dirty_flag` in SQLite
   * **Pull** remote changes:

     * Query Supabase for notes updated since last sync timestamp
     * Upsert into SQLite (cover new & updated rows)

3. **Conflict Resolution**

   * Simple “last-write-wins” using `updated_at` timestamps
   * (Future) flag conflicts for manual merge if two edits coincide

---

## 💻 Phase 5: Web App Access (Expo Web)

1. **Enable Web Target**

   * `expo start --web`
   * Confirm your UI renders in browser

2. **Platform‑Specific Code**

   * Use `Platform.OS === 'web'` in your hooks/components
   * **Web**: bypass SQLite & sync hook; read/write directly via Supabase
   * **Mobile**: continue using local DB + sync

3. **File & Image Upload on Web**

   * Use the same `expo-*` pickers (they work on web)
   * On web: you’ll get a `File` object or base64 string
   * Upload directly via Supabase Storage JS API

---

## 🛡️ Phase 6: Polish & Edge Cases

1. **Error Handling**

   * Show UI alerts on upload/download failures
   * Retry logic for failed syncs

2. **Performance**

   * Paginate note list if large
   * Debounce auto‑sync intervals

3. **User Feedback**

   * Sync status indicator (last synced time, in‑progress spinner)
   * Show “offline” banner when no network

4. **Testing**

   * Simulate offline on mobile: make edits, relaunch, go online → verify sync
   * Use browser dev‑tools to throttle or cut network on web

---

## 🎯 Phase 7: Future Improvements

* **Authentication** (Supabase Auth) → per‑user data isolation
* **Collaborative notes** (real‑time updates via Supabase Realtime)
* **Rich‑text editing** or Markdown support
* **Push notifications** for updates
* **Desktop app** via Electron if you need offline on PC

---

With this sequence you can methodically build—starting from the backend schema, wiring up local storage + UI, then layering on sync logic, and finally enabling web access. Let me know which phase you’d like to dive into next (e.g. detailed SQLite schema design, syncing pseudocode, or setting up your Supabase project)!
