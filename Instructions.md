# AaronNote
A local‑first, cross‑device Notes/TODO app using Expo + Legend‑State + Supabase.

---
## Notes:

Created app by doing the following:
```bash
npx create-expo-app AaronNote
cd AaronNote
npm run reset-project
npx expo start
```

---

## 🏗️ Phase 0: Prerequisites & Planning

1. **Install Tooling**

   * Node.js & npm/yarn
   * Expo CLI (`npm install -g expo-cli`)
   * Supabase account
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

## 📱 Phase 2: App Setup (Expo + Legend‑State)

1. **Initialize Expo Project**

   As shown above.

2. **Install Dependencies**

   * `npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-get-random-values` ✅ (completed)
   * `npm install @legendapp/state` ✅ (completed)
   * `npm install @legendapp/state/sync-plugins/supabase` ???
   * `npx expo install expo-image-picker expo-document-picker expo-file-system` ✅ (completed)
   * `npm install @react-native-community/netinfo` ✅ (completed)
   * `npm install react-native-url-polyfill` ✅ (completed)

   **Note**: Use `npx expo install` for Expo-managed packages to ensure SDK compatibility, and `npm install` for regular npm packages.o`

3. **Configure Legend‑State + Supabase Sync**

   * Create your Supabase client instance in `src/services/supabase.ts`.
   * Define synced observables for `notes`:

     ```js
     import { syncedCollection } from '@legendapp/state/sync-plugins/supabase';
     export const notes$ = syncedCollection('notes', {
       client: supabaseClient,
       persist: { name: 'notes', version: 1 },
       changesSince: (lastSync) => supabaseClient
         .from('notes')
         .select('*')
         .gt('updated_at', lastSync || 0),
     });
     ```
   * Legend‑State will auto‑persist metadata via AsyncStorage and queue changes offline.

4. **Organize Code Structure**

   * `/src/screens`: `NoteList`, `NoteEditor`, `AttachmentViewer`
   * `/src/components`: `NoteItem`, `AttachmentItem`, `SyncStatus`
   * `/src/services`: Supabase client, file-upload helpers
   * `src/state`: Legend‑State observables and sync setup
   * `/src/hooks`: `useConnectivity`, optional UI hooks

---

## 🔍 Phase 3: UI & CRUD with Legend‑State

1. **Note List Screen**

   * Use `use$` to subscribe to `notes$`
   * Render title, snippet, and a “dirty” indicator for pending sync

2. **Note Editor Screen**

   * Form for title, content, and attachment buttons
   * On save:

     * Mutate `notes$.set(id, { title, content, updated_at: Date.now(), dirty_flag: true })`
     * UI updates instantly via observables

3. **Attachment Handling (Offline & Online)**

   * Pick media using `expo-image-picker` / `expo-document-picker`
   * Copy file to local storage via `expo-file-system`:

     ```js
     const localUri = await FileSystem.copyAsync({ from: result.uri, to: `${FileSystem.documentDirectory}${filename}` });
     ```
   * Update the note observable with `{ attachments: [..., { uri: localUri, filename, type }] }`
   * Legend‑State persists the metadata (including local URIs)

---

## 🔄 Phase 4: Sync & File Upload Workflow

1. **Connectivity Detection** (`useConnectivity`)

   * Subscribe to `@react-native-community/netinfo`
   * Expose `isOnline` boolean to trigger uploads

2. **File Upload Logic**

   * Legend‑State sync plugin queues metadata changes, but file binaries need manual upload
   * On network re‑connect (or app focus):

     1. Iterate notes with attachments containing local URIs
     2. Upload each file to Supabase Storage via JS client
     3. On success, replace `uri` with the public `url` in the observable

3. **Legend‑State Auto Sync**

   * After replacing local URIs, Legend‑State will detect the change and sync updated metadata (including remote URLs) to Supabase
   * Conflicts are resolved “last-write-wins” based on `updated_at`

---

## 💻 Phase 5: Web App Access (Expo Web)

1. **Enable Web Target**

   ```bash
   expo start --web
   ```

2. **Unified Codebase**

   * Use the same Legend‑State observables and React components
   * On web, pickers return `File` objects or base64 strings via Expo modules
   * Upload directly to Supabase Storage and update the observable
   * No offline persistence needed for web—metadata saved remotely and read live

---

## 🛡️ Phase 6: Polish & Edge Cases

1. **Error Handling**

   * Show UI alerts on upload/download failures
   * Implement retry logic for failed file uploads or sync operations

2. **Performance**

   * Paginate or virtualize long note lists
   * Debounce rapid state changes to avoid excessive writes

3. **User Feedback**

   * Display sync status (e.g., “Last synced: 5 minutes ago”)
   * Show offline banner when `isOnline === false`

4. **Testing**

   * Test offline on mobile: create notes and attachments, restart app, reconnect → verify sync
   * Use browser dev‑tools to throttle network for web scenario

---

## 🎯 Phase 7: Future Improvements

* **Authentication** (Supabase Auth) → per‑user data isolation via sync plugin filter
* **Collaborative notes** (real-time via Supabase Realtime plugin)
* **Rich-text or Markdown editing**
* **Push notifications** for sync alerts
* **Desktop offline support** (Electron + Legend‑State)

---

This workflow leverages Legend‑State for seamless metadata persistence and sync, combined with `expo-file-system` for robust offline file storage. Let me know if you need deep‑dives into any step!


---