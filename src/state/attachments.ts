import { observable } from '@legendapp/state';
import { supabase } from '../services/supabase';


export interface Attachments {
    note_id: string;
    att_id: string;
    att_url?: string;
    att_filename: string;
    att_mimetype?: string;
}

export const attachments$ = observable<Attachments[]>([]);