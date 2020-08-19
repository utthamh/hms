

CREATE TABLE if not exists salesrep
(
    id bigserial primary key,
    name varchar,
    city varchar,
    country varchar,
    zipcode varchar,
    gender varchar
);

INSERT INTO salesrep (name,city,country,zipcode,gender)
VALUES( 'Emma Linemann', 'Chicago', 'USA', '66001', 'Female');
