-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.ATTACHMENT (
  note_id uuid NOT NULL DEFAULT gen_random_uuid(),
  att_id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  att_url text,
  att_filename character varying NOT NULL,
  att_mimetype character varying,
  CONSTRAINT ATTACHMENT_pkey PRIMARY KEY (note_id, att_id),
  CONSTRAINT ATTACHMENT_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.NOTE(note_id)
);
CREATE TABLE public.NOTE (
  note_id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  note_title character varying NOT NULL,
  note_content text,
  note_attachment ARRAY,
  note_date_updated timestamp without time zone NOT NULL,
  note_dirty_flag boolean NOT NULL DEFAULT false,
  CONSTRAINT NOTE_pkey PRIMARY KEY (note_id)
);