# Chat App

Aplikasi realtime chat dibuat menggunakan :
- NodeJS (express)
- PostgreSQL
- Redis (session management)
- Bootstrap 4
- Vanilla JavaScript

### Setup and configuration

- Buat database di PostgreSQL lalu paste script berikut:
```
  CREATE SEQUENCE public.s_chat
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
  
  CREATE SEQUENCE public.s_users
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
  
  CREATE TABLE public.chat (
    id int8 NOT NULL DEFAULT nextval('s_chat'::regclass),
    sender_id bpchar(36) NOT NULL,
    receiver_id bpchar(36) NOT NULL,
    message text NULL,
    created_at timestamp NULL,
    updated_at timestamp NULL,
    deleted_at timestamp NULL,
    conversation_id varchar NOT NULL,
    "read" bool NULL
  );
  
  CREATE TABLE public.users (
    id bpchar(36) NOT NULL,
    username varchar(255) NULL,
    email varchar(255) NULL,
    "password" varchar(255) NULL,
    created_at timestamp NULL,
    updated_at timestamp NULL,
    last_seen int8 NULL,
    online bool NULL,
    avatar_img varchar(255) NULL,
    user_conversation_id int8 NOT NULL DEFAULT nextval('s_users'::regclass),
    socket_id varchar(255) NULL,
    "token" varchar(255) NULL,
    CONSTRAINT users_pk PRIMARY KEY (id)
  );
  CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);
  CREATE UNIQUE INDEX users_username_idx ON public.users USING btree (username);
```

- Buat `environment variable` sesuai `.env.example`
> Note: Jika anda tidak ingin menggunakan Redis untuk session management kalian boleh skip untuk setup `environment variable` nya. namun anda harus konfigurasi untuk storage sessionnya.\
> See: https://www.npmjs.com/package/express-session

- Run `npm install`

- Run `node app.js`
