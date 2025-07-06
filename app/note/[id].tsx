import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { notes$ } from '../../src/state/notes';
import { observer } from '@legendapp/state/react';

const NoteEditScreen = observer(() => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const note = notes$.get().find(n => n.note_id === id);

  const [title, setTitle] = useState(note?.note_title || '');
  const [content, setContent] = useState(note?.note_content || '');
  const [attachments, setAttachments] = useState(note?.note_attachments || []);

  const saveNote = () => {
    if (note) {
      note.note_title = title;
      note.note_content = content;
    note.note_attachments = attachments;
      note.note_dirty_flag = true;
    } else {
      notes$.push({
        note_id: Date.now().toString(),
        note_title: title,
        note_content: content,
        note_date_updated: new Date().toISOString(),
        note_dirty_flag: true,
      });
    }
    router.back();
  };

  return (
    <View>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity onPress={saveNote}>
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
});

export default NoteEditScreen;