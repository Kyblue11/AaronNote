import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { useConnectivity } from '../src/hooks/useConnectivity';
import { notes$ } from '../src/state/notes';
import { observer } from '@legendapp/state/react';

const NotesListScreen = observer(() => {
  const { isOnline } = useConnectivity();
  const notes = notes$.get(); 

  return (
       <View style={styles.container}>
         {!isOnline && (
           <View>
             <Text>Offline - Changes will sync when reconnected</Text>
           </View>
         )}
         
         <Text>My Notes</Text>
         
         <FlatList
           data={Object.values(notes)}
           keyExtractor={(item) => item.note_id}
           renderItem={({ item }) => (
             <Link href={`/note/${item.note_id}`} asChild>
               <TouchableOpacity>
                 <Text>{item.note_title}</Text>
                 <Text>{item.note_content?.substring(0, 50)}...</Text>
                 {item.note_dirty_flag && <Text>●</Text>}
               </TouchableOpacity>
             </Link>
           )}
         />
       </View>
     );
   });

export default NotesListScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#25292e",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "hsl(0, 0%, 90%)",
    fontSize: 16,
  },
});