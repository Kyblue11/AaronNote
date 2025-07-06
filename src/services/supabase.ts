import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  })

// For now, let's comment out the Legend-State sync until we verify the correct import
// We'll add this back once we confirm the package structure

// import { syncedCollection } from '@legendapp/state/sync-plugins/supabase'

// export const notes$ = syncedCollection('notes', {
//   client: supabase,
//   persist: { name: 'notes', version: 1 },
//   changesSince: (lastSync) => supabase
//     .from('notes')
//     .select('*')
//     .gt('updated_at', lastSync || 0),
// });
