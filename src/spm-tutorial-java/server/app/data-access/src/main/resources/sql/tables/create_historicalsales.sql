

CREATE TABLE if not exists historicalsales
(
    distributor varchar,
    brand varchar,
    product varchar,
    opening_inventory int,
    closing_inventory int,
    date timestamp,
    id int
);

INSERT INTO historicalsales (distributor,brand,product,opening_inventory,closing_inventory,date,id)
VALUES( 'Mediboon Pharma Pvt. Ltd.', 'Ranbaxy', 'Abacavir', 210 , 150 , '03-03-2020', 1);
