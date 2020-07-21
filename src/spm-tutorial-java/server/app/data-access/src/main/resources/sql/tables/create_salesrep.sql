set search_path to tutorial;

CREATE TABLE if not exists salesrep
(
    id bigint,
    name varchar,
    city varchar,
    country varchar,
    zipcode varchar,
    gender varchar
);

INSERT INTO salesrep (id,name,city,country,zipcode,gender)
VALUES(1, 'Emma Linemann', 'Chicago', 'USA', '66001', 'Female');
