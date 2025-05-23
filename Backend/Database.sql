PGDMP                      }            Tutorias    17.3    17.2 2               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    17470    Tutorias    DATABASE     p   CREATE DATABASE "Tutorias" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
    DROP DATABASE "Tutorias";
                     postgres    false            [           1247    17482    rol_usuario    TYPE     W   CREATE TYPE public.rol_usuario AS ENUM (
    'Estudiante',
    'Tutor',
    'Admin'
);
    DROP TYPE public.rol_usuario;
       public               postgres    false            �            1259    17525    cita    TABLE     D  CREATE TABLE public.cita (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    profesor_id integer NOT NULL,
    agendada timestamp without time zone DEFAULT now(),
    fecha_cita date NOT NULL,
    hora_cita time without time zone NOT NULL,
    duracion_min integer DEFAULT 60,
    status character varying(20) DEFAULT 'pendiente'::character varying,
    CONSTRAINT cita_status_check CHECK (((status)::text = ANY ((ARRAY['pendiente'::character varying, 'confirmada'::character varying, 'completada'::character varying, 'cancelada'::character varying])::text[])))
);
    DROP TABLE public.cita;
       public         heap r       postgres    false            �            1259    17524    cita_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cita_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.cita_id_seq;
       public               postgres    false    223                       0    0    cita_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.cita_id_seq OWNED BY public.cita.id;
          public               postgres    false    222            �            1259    17562    pagos    TABLE     �  CREATE TABLE public.pagos (
    id integer NOT NULL,
    cita_id integer NOT NULL,
    monto numeric(10,2) NOT NULL,
    metodo character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'pendiente'::character varying,
    transaccion_id character varying(100),
    fecha_pago timestamp without time zone,
    CONSTRAINT pagos_metodo_check CHECK (((metodo)::text = ANY ((ARRAY['tarjeta'::character varying, 'transferencia'::character varying, 'efectivo'::character varying, 'paypal'::character varying])::text[]))),
    CONSTRAINT pagos_status_check CHECK (((status)::text = ANY ((ARRAY['pendiente'::character varying, 'completado'::character varying, 'rechazado'::character varying, 'reembolsado'::character varying])::text[])))
);
    DROP TABLE public.pagos;
       public         heap r       postgres    false            �            1259    17561    pagos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.pagos_id_seq;
       public               postgres    false    227                       0    0    pagos_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.pagos_id_seq OWNED BY public.pagos.id;
          public               postgres    false    226            �            1259    17511    perfil_profesor    TABLE       CREATE TABLE public.perfil_profesor (
    profesor_id integer NOT NULL,
    temas character varying(255)[] NOT NULL,
    descripcion text,
    certificado_url character varying(255),
    precio_por_hora numeric(10,2),
    horario jsonb DEFAULT '{}'::jsonb NOT NULL
);
 #   DROP TABLE public.perfil_profesor;
       public         heap r       postgres    false            �            1259    17546    recursos    TABLE       CREATE TABLE public.recursos (
    id integer NOT NULL,
    profesor_id integer NOT NULL,
    tipo character varying(20) NOT NULL,
    url character varying(255) NOT NULL,
    titulo character varying(100) NOT NULL,
    descripcion text,
    fecha_publicacion timestamp without time zone DEFAULT now(),
    CONSTRAINT recursos_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['imagen'::character varying, 'pdf'::character varying, 'video'::character varying, 'presentacion'::character varying, 'enlace'::character varying])::text[])))
);
    DROP TABLE public.recursos;
       public         heap r       postgres    false            �            1259    17545    recursos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.recursos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.recursos_id_seq;
       public               postgres    false    225            	           0    0    recursos_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.recursos_id_seq OWNED BY public.recursos.id;
          public               postgres    false    224            �            1259    17489    roles    TABLE     d   CREATE TABLE public.roles (
    usuario_id integer NOT NULL,
    rol public.rol_usuario NOT NULL
);
    DROP TABLE public.roles;
       public         heap r       postgres    false    859            �            1259    17499    telefono    TABLE     r   CREATE TABLE public.telefono (
    usuario_id integer NOT NULL,
    telefonos character varying(15)[] NOT NULL
);
    DROP TABLE public.telefono;
       public         heap r       postgres    false            �            1259    17472    usuario    TABLE     �   CREATE TABLE public.usuario (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.usuario;
       public         heap r       postgres    false            �            1259    17471    usuario_id_seq    SEQUENCE     �   CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.usuario_id_seq;
       public               postgres    false    218            
           0    0    usuario_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;
          public               postgres    false    217            B           2604    17528    cita id    DEFAULT     b   ALTER TABLE ONLY public.cita ALTER COLUMN id SET DEFAULT nextval('public.cita_id_seq'::regclass);
 6   ALTER TABLE public.cita ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    223    222    223            H           2604    17565    pagos id    DEFAULT     d   ALTER TABLE ONLY public.pagos ALTER COLUMN id SET DEFAULT nextval('public.pagos_id_seq'::regclass);
 7   ALTER TABLE public.pagos ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    227    227            F           2604    17549    recursos id    DEFAULT     j   ALTER TABLE ONLY public.recursos ALTER COLUMN id SET DEFAULT nextval('public.recursos_id_seq'::regclass);
 :   ALTER TABLE public.recursos ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    225    225            ?           2604    17475 
   usuario id    DEFAULT     h   ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);
 9   ALTER TABLE public.usuario ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217    218            �          0    17525    cita 
   TABLE DATA           u   COPY public.cita (id, estudiante_id, profesor_id, agendada, fecha_cita, hora_cita, duracion_min, status) FROM stdin;
    public               postgres    false    223   �>                  0    17562    pagos 
   TABLE DATA           _   COPY public.pagos (id, cita_id, monto, metodo, status, transaccion_id, fecha_pago) FROM stdin;
    public               postgres    false    227   ?       �          0    17511    perfil_profesor 
   TABLE DATA           u   COPY public.perfil_profesor (profesor_id, temas, descripcion, certificado_url, precio_por_hora, horario) FROM stdin;
    public               postgres    false    221   /?       �          0    17546    recursos 
   TABLE DATA           f   COPY public.recursos (id, profesor_id, tipo, url, titulo, descripcion, fecha_publicacion) FROM stdin;
    public               postgres    false    225   L?       �          0    17489    roles 
   TABLE DATA           0   COPY public.roles (usuario_id, rol) FROM stdin;
    public               postgres    false    219   i?       �          0    17499    telefono 
   TABLE DATA           9   COPY public.telefono (usuario_id, telefonos) FROM stdin;
    public               postgres    false    220   �?       �          0    17472    usuario 
   TABLE DATA           J   COPY public.usuario (id, nombre, email, password, created_at) FROM stdin;
    public               postgres    false    218   �?                  0    0    cita_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.cita_id_seq', 1, false);
          public               postgres    false    222                       0    0    pagos_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.pagos_id_seq', 1, false);
          public               postgres    false    226                       0    0    recursos_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.recursos_id_seq', 1, false);
          public               postgres    false    224                       0    0    usuario_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.usuario_id_seq', 1, true);
          public               postgres    false    217            Y           2606    17534    cita cita_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.cita DROP CONSTRAINT cita_pkey;
       public                 postgres    false    223            ]           2606    17570    pagos pagos_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.pagos DROP CONSTRAINT pagos_pkey;
       public                 postgres    false    227            W           2606    17518 $   perfil_profesor perfil_profesor_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.perfil_profesor
    ADD CONSTRAINT perfil_profesor_pkey PRIMARY KEY (profesor_id);
 N   ALTER TABLE ONLY public.perfil_profesor DROP CONSTRAINT perfil_profesor_pkey;
       public                 postgres    false    221            [           2606    17555    recursos recursos_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.recursos
    ADD CONSTRAINT recursos_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.recursos DROP CONSTRAINT recursos_pkey;
       public                 postgres    false    225            S           2606    17493    roles roles_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (usuario_id);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public                 postgres    false    219            U           2606    17505    telefono telefono_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.telefono
    ADD CONSTRAINT telefono_pkey PRIMARY KEY (usuario_id);
 @   ALTER TABLE ONLY public.telefono DROP CONSTRAINT telefono_pkey;
       public                 postgres    false    220            O           2606    17480    usuario usuario_email_key 
   CONSTRAINT     U   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);
 C   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_email_key;
       public                 postgres    false    218            Q           2606    17478    usuario usuario_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_pkey;
       public                 postgres    false    218            a           2606    17535    cita cita_estudiante_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.usuario(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.cita DROP CONSTRAINT cita_estudiante_id_fkey;
       public               postgres    false    218    223    4689            b           2606    17540    cita cita_profesor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_profesor_id_fkey FOREIGN KEY (profesor_id) REFERENCES public.usuario(id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.cita DROP CONSTRAINT cita_profesor_id_fkey;
       public               postgres    false    223    4689    218            d           2606    17571    pagos pagos_cita_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_cita_id_fkey FOREIGN KEY (cita_id) REFERENCES public.cita(id) ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.pagos DROP CONSTRAINT pagos_cita_id_fkey;
       public               postgres    false    223    4697    227            `           2606    17519 0   perfil_profesor perfil_profesor_profesor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.perfil_profesor
    ADD CONSTRAINT perfil_profesor_profesor_id_fkey FOREIGN KEY (profesor_id) REFERENCES public.usuario(id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.perfil_profesor DROP CONSTRAINT perfil_profesor_profesor_id_fkey;
       public               postgres    false    218    221    4689            c           2606    17556 "   recursos recursos_profesor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.recursos
    ADD CONSTRAINT recursos_profesor_id_fkey FOREIGN KEY (profesor_id) REFERENCES public.usuario(id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.recursos DROP CONSTRAINT recursos_profesor_id_fkey;
       public               postgres    false    218    225    4689            ^           2606    17494    roles roles_usuario_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;
 E   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_usuario_id_fkey;
       public               postgres    false    219    218    4689            _           2606    17506 !   telefono telefono_usuario_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.telefono
    ADD CONSTRAINT telefono_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.telefono DROP CONSTRAINT telefono_usuario_id_fkey;
       public               postgres    false    220    218    4689            �      x������ � �             x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   �   x�3�t�KTpO,J>�6�31/�!5+5� '_/9?�S�(Q��@�«�Ǵ���'(�"]��%�24�\/���<�K�2�,*�'�<�<�,(�<<�ǰ*2�2�����T��D��X��������B�����Đ+F��� ?�"|     