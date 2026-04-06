--
-- PostgreSQL database dump
--

\restrict XLo6ter3woLjRVSrHNKAmPQYe3WN5sXVzi3U970ILmB0gXYGsoo8UIlFM1M7VCA

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: update_modified_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_modified_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authors (
    name text,
    email text NOT NULL,
    grade integer,
    password text,
    status text,
    admin_rechte boolean,
    author_id uuid NOT NULL,
    schueler_mail text
);


ALTER TABLE public.authors OWNER TO postgres;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id bigint NOT NULL,
    title text,
    slug text,
    date text,
    tag text[],
    summary text,
    cover_img text,
    content jsonb NOT NULL,
    visible boolean,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: posts_authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts_authors (
    blog_id bigint NOT NULL,
    author_id uuid NOT NULL
);


ALTER TABLE public.posts_authors OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authors (name, email, grade, password, status, admin_rechte, author_id, schueler_mail) FROM stdin;
Gianluca Rossi	itafun1000@gmail.com	\N	$2b$10$K/.57w8RrTsgvF1URhMBvuIrpnvdgzQkJKnLMKwtnxO3wn6WYeTuO	Alumni	f	367eabb8-5c5f-4bb5-9169-ab3f0b1df445	\N
Gianluca Rossi	gianlucarossi666@yahoo.com	12	$2b$10$fmOIs1Yez6c1VUDBiO...OP5TW4IZxjh0xtV.CIoftu971FEJwRWS	Alumni	f	cf2a5a19-304c-4086-97d9-13c0ec3ccf29	gianlucacar.rossi@bbs-me.org
Gianluca Rossi	gianluca.rossi@bbs-me.org	12	$2b$10$YhBKQ.6zdaSC6f4ZdmDk/OxJuu7i0qtaEr3NsOHMkY1WnjYIee65y	Schüler	f	f8617b8a-9544-4e77-bf44-357b8b3a8b95	\N
test test	test.test@bbs-me.org	13	$2b$10$g.l2jDmBUOJLV3VOlkcNeuE00MQvbLoMeX/vaJ/u8rgwhLIhtHVzC	Schüler	f	87861fde-f89d-4234-8c83-24ae78040895	\N
Test Test	test.testtt@bbs-me.org	11	$2b$10$j72bBbOI/HuOk8peNWH3Wu5Occa7r9Jjjg0C16OZbdTZEmOtEqNCC	Schüler	f	0bde05e4-62f2-4cce-b48f-7506c02c0ab5	\N
Lehrer	testlehrer.test@bbs-me.de	\N	$2b$10$2GFuElT0bF4j4fRdUhw2feGtUNDDLdpq2248Eih4mNtsOX1Tm6sQG	Lehrer	t	6be4263f-0ec3-4218-b0ae-a50773834332	\N
Gianluca Rossi	gianluca123@bbs-me.de	\N	$2b$10$jFuSJ0k1Ml0EfdwFC/WwG.4L0DBoupsaZhzwD1Snb6/dXe7Kd2swK	Lehrer	t	51f56a1a-abde-41eb-8e25-971551459766	\N
Albert Einstein	royalsloths@yahoo.com	\N	$2b$10$glrppeYa0K4Yc.0kDSSzzO5UHidOV1KtpphDIMbG1wGL.AUVrCFP.	Alumni	f	d902e947-e12d-4f53-bece-fad0b48b26d9	\N
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, title, slug, date, tag, summary, cover_img, content, visible, updated_at) FROM stdin;
3	Life Organisation Station	life-organisation-station	2025/25	{Technik,Informatik}	Ein Wecker, der dein Leben organisiert.	/uploads/1770836395212-seitenbildLos.jpeg	[{"text": "Technik trifft Unternehmergeist – Projektarbeit der Klasse 11A im Fach Informatik", "type": "heading", "level": 3}, {"text": "Im Sommer 2025 verwandelte sich das Berufliche Gymnasium der BBS ME Hannover in eine schulische Version der Höhle der Löwen: Die Schüler*innen der 11A entwickelten in interdisziplinären Teams technisch innovative Produkte mit realem Alltagsnutzen – von der ersten Idee über den funktionalen Prototyp bis hin zur Vermarktung.", "type": "paragraph"}, {"text": "Ziel der Projektarbeit", "type": "heading", "level": 2}, {"text": "Ziel der Mini-Projektphase war es, technisches Fachwissen praxisnah anzuwenden, dabei eigenständig zu planen und die Ergebnisse überzeugend zu präsentieren – ganz im Sinne einer modernen, berufsnahen gymnasialen Bildung. Besonders betont wurde der Verbindung von Technik, Kreativität und wirtschaftlichem Denken.", "type": "paragraph"}, {"text": "Projektverlauf in drei Phasen", "type": "heading", "level": 2}, {"text": "Phase 1: Handout & Planung", "type": "heading", "level": 3}, {"text": "In der ersten Phase entwickelten die Teams ein detailliertes Konzeptpapier mit Zieldefinition, Systemarchitektur, technischen Spezifikationen und einem Gantt-Diagramm zur Zeitplanung. Begleitet wurde diese Phase von Literaturrecherche und Feedback-Loops.", "type": "paragraph"}, {"text": "📱 L.O.S. – Life Organization Station", "type": "heading", "level": 3}, {"text": "Ein digitales Organisations-Tool mit Touchscreen, Timer, API-Anbindung und Audiofunktionen.", "type": "paragraph"}, {"alt": "Ein Beispielbild", "src": "/uploads/1770836395213-los_ai.png", "type": "image", "caption": "Dies ist die Bildunterschrift"}]	t	2026-03-01 20:38:00.985239
51	test	test	2025/26	{Informatik}	Ein text	/uploads/1774256581053-carbon (5).png	[{"type": "youtube", "videoId": "dyaz6L8FVsA", "videoUrl": "https://youtu.be/dyaz6L8FVsA?si=EmGA0UzXkWpbqvPy"}, {"url": "bbs-me.de", "type": "link", "label": "test", "target": "_blank"}]	f	2026-03-23 10:03:01.059862
35	das	das	12	{Technik}	asdasd	/assets/1764447221928-1764416693436-Adobe Express - file	[{"text": "123asd", "type": "paragraph"}, {"text": "Das ist ein motorbike", "type": "paragraph"}, {"alt": ",", "src": "/assets/undefined", "type": "image", "caption": ""}, {"alt": ",", "src": "/assets/undefined", "type": "image", "caption": ""}]	t	2026-03-01 20:38:00.985239
50	Teste neues feature	teste-neues-feature	2025/25	{Technik}	moin du das	/uploads/1773065829462-restapi.png	[{"text": "what the fuck", "type": "heading", "level": 1}]	t	2026-03-09 15:18:28.359961
2	BGT-HUB.me	bgt-hub	2025/25	{Medien,Informatik}	Die Plattform für Schülerprojekte	/assets/projekt-wallpaper.jpg	[{"text": "Das ist der erste Absatz deines Artikels.", "type": "paragraph"}, {"alt": "Ein Beispielbild", "src": "/assets/los_bts.jpg", "type": "image", "caption": "Dies ist die Bildunterschrift"}, {"text": "Hier geht der Text weiter ...", "type": "paragraph"}, {"text": "Zwischenüberschrift", "type": "heading", "level": 2}, {"text": "Noch mehr Text ...", "type": "paragraph"}]	t	2026-03-01 20:38:00.985239
38	WIr sind fast fertig	wir-sind-fast-fertig	2025/26	{Medien}	Das ist es 	/assets/undefined	[{"text": "Wir sind sehr weit", "type": "paragraph"}, {"alt": "", "src": "/assets/undefined", "type": "image", "caption": ""}]	t	2026-03-01 20:38:00.985239
1	WIllkommen du krasser typ	willkommen-du-krasser-typ	2025/26	{Medien,Technik}	Willkommen auf der besten Webseite des Internets	/uploads/1774793840329-bennet3.jpeg	[{"text": "Hier geht der Text weiter ...", "type": "paragraph"}, {"text": "Zwischenüberschrift", "type": "heading", "level": 2}, {"text": "Noch mehr Text ...", "type": "paragraph"}, {"text": "Das habe ich hinzugefügt", "type": "paragraph"}, {"text": "d", "type": "paragraph"}, {"alt": ",", "src": "/uploads/1774793840330-Gemini_Generated_Image_bosiqnbosiqnbosi (1).png", "type": "image", "caption": ""}, {"alt": ",", "src": "/uploads/1774793840332-Maja_Thumbnail.png", "type": "image", "caption": ""}]	f	2026-03-29 16:17:20.341695
42	Welcome zur Alpha Version	welcome-zur-alpha-version	2025/26	{Technik}	Wir sind in der Alpha	/assets/undefined	[{"text": "Welcome to alpha", "type": "paragraph"}, {"alt": ",", "src": "/assets/undefined", "type": "image", "caption": ""}, {"text": "Das porjekt läuft", "type": "paragraph"}, {"text": "Es läuft!!!", "type": "heading", "level": 1}]	t	2026-03-01 20:38:00.985239
39	Der Test artikel	der-test-artikel	2025/26	{Informatik}	Das ist ein Test, um zu schauen ob der suer gespeichert wird?	/assets/1764449554085-Gemini_Generated_Image_siypa9siypa9siyp (1).png	[{"alt": ",", "src": "/assets/1764449554092-Gemini_Generated_Image_siypa9siypa9siyp (1).png", "type": "image", "caption": ""}]	t	2026-03-01 20:38:00.985239
45	test lehrer	test-lehrer	2025/26	{Technik}	test	/uploads1764620138904-Gemini_Generated_Image_419znr419znr419z (2) (1).png	[{"text": "das test", "type": "heading", "level": 1}]	t	2026-03-01 20:38:00.985239
40	Moin du da	moin-du-da	2025/26	{Informatik,Technik}	Das ist ein Test 	/assets/undefined	[{"text": "Noch ein Test", "type": "heading", "level": 1}, {"alt": ",", "src": "/assets/undefined", "type": "image", "caption": ""}]	t	2026-03-01 20:38:00.985239
\.


--
-- Data for Name: posts_authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts_authors (blog_id, author_id) FROM stdin;
1	cf2a5a19-304c-4086-97d9-13c0ec3ccf29
2	cf2a5a19-304c-4086-97d9-13c0ec3ccf29
3	cf2a5a19-304c-4086-97d9-13c0ec3ccf29
35	cf2a5a19-304c-4086-97d9-13c0ec3ccf29
38	cf2a5a19-304c-4086-97d9-13c0ec3ccf29
39	cf2a5a19-304c-4086-97d9-13c0ec3ccf29
40	cf2a5a19-304c-4086-97d9-13c0ec3ccf29
42	87861fde-f89d-4234-8c83-24ae78040895
45	6be4263f-0ec3-4218-b0ae-a50773834332
50	cf2a5a19-304c-4086-97d9-13c0ec3ccf29
51	cf2a5a19-304c-4086-97d9-13c0ec3ccf29
\.


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 51, true);


--
-- Name: authors author_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT author_email_unique UNIQUE (email);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (author_id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: posts posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key UNIQUE (slug);


--
-- Name: posts update_tabelle_modtime; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_tabelle_modtime BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- Name: posts_authors fk_author; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts_authors
    ADD CONSTRAINT fk_author FOREIGN KEY (author_id) REFERENCES public.authors(author_id);


--
-- Name: posts_authors posts_authors_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts_authors
    ADD CONSTRAINT posts_authors_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: TABLE authors; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.authors TO me;


--
-- Name: TABLE posts; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.posts TO me;


--
-- Name: TABLE posts_authors; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.posts_authors TO me;


--
-- Name: SEQUENCE posts_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.posts_id_seq TO me;


--
-- PostgreSQL database dump complete
--

\unrestrict XLo6ter3woLjRVSrHNKAmPQYe3WN5sXVzi3U970ILmB0gXYGsoo8UIlFM1M7VCA

