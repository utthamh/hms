
# Please add additional table or make an update to existing schema if needed

CREATE TABLE public.sales_rep(
	rep_id SERIAL CONSTRAINT rep_id_pkey PRIMARY KEY,
	rep_name varchar NOT NULL,
	rep_email_address varchar NOT NULL
	is_deleted boolean
);

CREATE TABLE public.insights(
	insight_id SERIAL CONSTRAINT insight_id_pkey PRIMARY KEY,
	user_name varchar NOT NULL,
	email_address varchar NOT NULL
);