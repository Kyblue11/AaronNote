import { observable } from '@legendapp/state';
import { supabase } from '../services/supabase';
import { Attachments } from './attachments';

export interface Note {
    note_id: string;
    note_title: string;
    note_content?: string;
    note_attachments?: Attachments[];
    note_date_updated: string;
    note_dirty_flag: boolean;
}

export const notes$ = observable<Note[]>([]);